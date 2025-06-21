/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { sendTrainerEmail } = require('../utils/emailService');

router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */

// ✅ Create user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
     // ✅ Send email if trainer
    if (newUser.role === 'trainer') {
      sendTrainerEmail(newUser.email, newUser.name); // Don't await to keep API responsive
    }
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */

// ✅ Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 */

// ✅ Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (superadmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated user
 */
// ✅ Update user
router.put('/:id', authorize('superadmin'), async (req, res) => {
  try {
    // from req, updatedat should be set to current date
    req.body.updatedAt = new Date();
    // Validate the role if provided
    if (req.body.role && !['superadmin', 'center_admin', 'trainer', 'student', 'content_admin'].includes(req.body.role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// /**
//  * @swagger
//  * /api/users/{id}:
//  *   delete:
//  *     summary: Delete a user (superadmin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: User deleted
//  */

// ✅ Delete user
// router.delete('/:id', authorize('superadmin'), async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ error: 'User not found' });
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

module.exports = router;
