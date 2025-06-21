/**
 * @swagger
 * tags:
 *   name: Institutes
 *   description: Institute management
 */

/**
 * @swagger
 * /api/institutes:
 *   get:
 *     summary: Get all institutes
 *     tags: [Institutes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of institutes
 *   
 */


const express = require('express');
const router = express.Router();
const Institute = require('../models/Institute');
const { authenticate, authorize } = require('../middleware/auth');

// 👮‍♂️ All routes require authentication
router.use(authenticate);

// 📌 Create institute – only superadmin
router.post('/', authorize('superadmin'), async (req, res) => {
  try {
    const institute = new Institute(req.body);
    const saved = await institute.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Get all institutes – any logged-in user
router.get('/', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.json(institutes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get institute by ID – any logged-in user
router.get('/:id', async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) return res.status(404).json({ error: 'Institute not found' });
    res.json(institute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Update institute – only superadmin
router.put('/:id', authorize('superadmin'), async (req, res) => {
  try {
    const updated = await Institute.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Institute not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Delete institute – only superadmin
router.delete('/:id', authorize('superadmin'), async (req, res) => {
  try {
    const deleted = await Institute.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Institute not found' });
    res.json({ message: 'Institute deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
