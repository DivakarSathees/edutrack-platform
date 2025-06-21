const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendTrainerEmail } = require('../utils/emailService');
const router = express.Router();

// Setup file upload destination
const upload = multer({ dest: 'uploads/' });

router.post('/import-users', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = XLSX.utils.sheet_to_json(sheet);

    const now = new Date();
    const insertedUsers = [];

    for (const [i, user] of users.entries()) {
      const username = user.email.split('@')[0];
      const passwordHash = await bcrypt.hash(username, 10);

      const newUser = new User({
        // _id: `user_${user.role}${String(i + 1).padStart(3, '0')}`,
        // _id:'',
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        mobile: user.mobile,
        instituteId: null,
        batchId: user.batchId || '',
        isActive: true,
        // profileImageUrl: `https://cdn.avatar.com/${username}.jpg`,
        lastLoginAt: now,
        createdAt: now,
        updatedAt: now
      });

      // if user email already exists then find the user nby mail id & then update the user 
        const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        // Update existing user
        existingUser.name = user.name;
        existingUser.role = user.role;
        existingUser.mobile = user.mobile;
        existingUser.batchId = user.batchId || '';
        existingUser.updatedAt = now;
        existingUser.passwordHash = passwordHash; // Update password hash
        existingUser.isActive = true; // Ensure user is active

        // ✅ Send email if trainer
        if (existingUser.role === 'trainer') {
          sendTrainerEmail(existingUser.email, existingUser.name); // Don't await to keep API responsive
        }

        await existingUser.save();
        insertedUsers.push(existingUser.email);
        continue; // Skip to next user
        }


       // ✅ Send email if trainer
        if (user.role === 'trainer') {
        sendTrainerEmail(user.email, user.name); // Don't await to keep API responsive
        }

      await newUser.save();
      insertedUsers.push(user.email);
    }

    res.status(200).json({ message: 'Users imported successfully', insertedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
