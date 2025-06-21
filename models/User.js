const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
//   _id: String,
  name: String,
  email: String,
  passwordHash: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // role can be 'student', 'teacher', or 'admin'
  role: {
    type: String,
    enum: ['superadmin', 'center_admin', 'trainer', 'student', 'content_admin'],
    required: true
  },
  mobile: String,
  instituteId: { type: String, default: null },
  batchId: { type: String, default: null },
  isActive: { type: Boolean, default: true },
//   profileImageUrl: String,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('User', userSchema);
