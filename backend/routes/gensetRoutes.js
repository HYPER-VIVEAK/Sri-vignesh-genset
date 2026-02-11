const express = require('express');
const router = express.Router();
const Genset = require('../models/Genset');
const { validateGenset } = require('../utils/validation');

// GET all active gensets with filtering
router.get('/', async (req, res) => {
  try {
    const { brand, fuelType, minCapacity, maxCapacity, condition, phase } = req.query;
    
    let filter = { isActive: true };
    
    if (brand) filter.brand = brand;
    if (fuelType) filter.fuelType = fuelType;
    if (condition) filter.condition = condition;
    if (phase) filter.phase = phase;
    
    if (minCapacity || maxCapacity) {
      filter.capacity = {};
      if (minCapacity) filter.capacity.$gte = Number(minCapacity);
      if (maxCapacity) filter.capacity.$lte = Number(maxCapacity);
    }
    
    const gensets = await Genset.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: gensets.length, data: gensets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gensets', error: error.message });
  }
});

// GET single genset by ID
router.get('/:id', async (req, res) => {
  try {
    const genset = await Genset.findById(req.params.id);
    if (!genset) {
      return res.status(404).json({ success: false, message: 'Genset not found' });
    }
    res.json({ success: true, data: genset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch genset', error: error.message });
  }
});

// POST create new genset
router.post('/', validateGenset, async (req, res) => {
  try {
    const genset = new Genset(req.body);
    await genset.save();
    res.status(201).json({ success: true, message: 'Genset created successfully', data: genset });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create genset', error: error.message });
  }
});

// PUT update genset
router.put('/:id', validateGenset, async (req, res) => {
  try {
    const genset = await Genset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!genset) {
      return res.status(404).json({ success: false, message: 'Genset not found' });
    }
    res.json({ success: true, message: 'Genset updated successfully', data: genset });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update genset', error: error.message });
  }
});

// PATCH soft delete (deactivate) genset
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const genset = await Genset.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!genset) {
      return res.status(404).json({ success: false, message: 'Genset not found' });
    }
    res.json({ success: true, message: 'Genset deactivated successfully', data: genset });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to deactivate genset', error: error.message });
  }
});

// DELETE permanently remove genset
router.delete('/:id', async (req, res) => {
  try {
    const genset = await Genset.findByIdAndDelete(req.params.id);
    if (!genset) {
      return res.status(404).json({ success: false, message: 'Genset not found' });
    }
    res.json({ success: true, message: 'Genset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete genset', error: error.message });
  }
});

module.exports = router;
