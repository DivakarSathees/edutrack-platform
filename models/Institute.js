const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Institute', instituteSchema);
