const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

// Create service request
router.post('/', async (req, res) => {
  try {
    const serviceRequest = new ServiceRequest(req.body);
    await serviceRequest.save();
    res.status(201).json({ success: true, message: 'Service request created', data: serviceRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create service request', error: error.message });
  }
});

// Get all service requests with filters
router.get('/', async (req, res) => {
  try {
    const { status, serviceType, priority, customerId } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (serviceType) filter.serviceType = serviceType;
    if (priority) filter.priority = priority;
    if (customerId) filter.customerId = customerId;
    
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

// Get single service request
router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customerId', 'name email phone company address')
      .populate('assignedTechnician', 'name email phone')
      .populate('gensetId');
      
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service request', error: error.message });
  }
});

// Assign technician to service request
router.patch('/:id/assign', async (req, res) => {
  try {
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
router.patch('/:id/status', async (req, res) => {
  try {
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
router.patch('/:id/complete', async (req, res) => {
  try {
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
router.patch('/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { 
        customerFeedback: { rating, comment }
      },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Service request not found' });
    }
    res.json({ success: true, message: 'Feedback added successfully', data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to add feedback', error: error.message });
  }
});

module.exports = router;
