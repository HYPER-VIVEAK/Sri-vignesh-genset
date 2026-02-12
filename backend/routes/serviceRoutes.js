const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const { verifyToken } = require('../middleware/auth');

const isStaff = (role) => ['admin', 'employee', 'technician'].includes(role);

// Create service request
router.post('/', verifyToken, async (req, res) => {
  try {
    req.body.customerId = new mongoose.Types.ObjectId(req.user.id);
    if (req.body.gensetId === '') {
      delete req.body.gensetId;
    }

    if (req.body.gensetId && !mongoose.Types.ObjectId.isValid(req.body.gensetId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid genset ID'
      });
    }

    const serviceRequest = new ServiceRequest(req.body);
    const populatedRequest = await serviceRequest.save();
    
    // Populate customer info before returning
    await populatedRequest.populate('customerId', 'name email phone company');
    
    res.status(201).json({ success: true, message: 'Service request created', data: populatedRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create service request', error: error.message });
  }
});

// Get all service requests with filters
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, serviceType, priority, customerId } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (priority) filter.priority = priority;
    if (customerId) filter.customerId = new mongoose.Types.ObjectId(customerId);

    if (!isStaff(req.user.role)) {
      filter.customerId = new mongoose.Types.ObjectId(req.user.id);
    }
    
    const requests = await ServiceRequest.find(filter)
      .populate('customerId', 'name email phone company')
      .populate('assignedTechnician', 'name email phone')
      .populate('gensetId', 'model brand capacity')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service requests', error: error.message });
  }
});

// Get service requests by customer
router.get('/customer/:customerId', verifyToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!isStaff(req.user.role) && req.user.id !== customerId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const requests = await ServiceRequest.find({ customerId: new mongoose.Types.ObjectId(customerId) })
      .populate('customerId', 'name email phone company')
      .populate('assignedTechnician', 'name email phone')
      .populate('gensetId', 'model brand capacity')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service requests', error: error.message });
  }
});

// Get single service request
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customerId', 'name email phone company address')
      .populate('assignedTechnician', 'name email phone')
      .populate('gensetId');
      
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    if (!isStaff(req.user.role) && String(request.customerId?._id) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service request', error: error.message });
  }
});

// Assign technician to service request
router.patch('/:id/assign', verifyToken, async (req, res) => {
  try {
    if (!isStaff(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { technicianId, scheduledDate } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTechnician: technicianId,
        scheduledDate,
        status: 'Assigned'
      },
      { new: true }
    ).populate('assignedTechnician', 'name email');
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, message: 'Technician assigned successfully', data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to assign technician', error: error.message });
  }
});

// Update service request status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (!isStaff(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { status } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, message: 'Status updated successfully', data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update status', error: error.message });
  }
});

// Complete service request
router.patch('/:id/complete', verifyToken, async (req, res) => {
  try {
    if (!isStaff(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { actualCost, partsUsed, technicianNotes } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Completed',
        completedDate: new Date(),
        actualCost,
        partsUsed,
        technicianNotes
      },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, message: 'Service completed successfully', data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to complete service', error: error.message });
  }
});

// Add customer feedback
router.patch('/:id/feedback', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }

    if (!isStaff(req.user.role) && String(request.customerId) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        customerFeedback: { rating, comment }
      },
      { new: true }
    );
    
    res.json({ success: true, message: 'Feedback added successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to add feedback', error: error.message });
  }
});

module.exports = router;
