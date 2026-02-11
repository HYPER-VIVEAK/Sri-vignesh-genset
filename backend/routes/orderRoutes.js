const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const Genset = require('../models/Genset');

// Create new sales order
router.post('/', async (req, res) => {
  try {
    const { customerId, items, deliveryAddress, paymentMethod } = req.body;
    
    // Calculate totals and verify stock
    let subtotal = 0;
    for (let item of items) {
      const genset = await Genset.findById(item.gensetId);
      if (!genset) {
        return res.status(404).json({ 
          success: false, 
          message: `Genset ${item.gensetId} not found` 
        });
      }
      if (genset.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${genset.model}. Available: ${genset.stock}` 
        });
      }
      
      item.unitPrice = genset.price;
      const discount = item.discount || 0;
      item.total = (item.unitPrice * item.quantity) - discount;
      subtotal += item.total;
    }
    
    const tax = subtotal * 0.18; // 18% tax (adjust as needed)
    const totalAmount = subtotal + tax + (req.body.shippingCost || 0);
    
    const order = new SalesOrder({
      customerId,
      items,
      subtotal,
      tax,
      shippingCost: req.body.shippingCost || 0,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      deliveryDate: req.body.deliveryDate,
      notes: req.body.notes
    });
    
    await order.save();
    
    // Reduce stock
    for (let item of items) {
      await Genset.findByIdAndUpdate(item.gensetId, {
        $inc: { stock: -item.quantity }
      });
    }
    
    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// Get all orders with optional customer filter
router.get('/', async (req, res) => {
  try {
    const { customerId, status } = req.query;
    let filter = {};
    
    if (customerId) filter.customerId = customerId;
    if (status) filter.status = status;
    
    const orders = await SalesOrder.find(filter)
      .populate('customerId', 'name email phone company')
      .populate('items.gensetId', 'model brand capacity price')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// Get customer orders
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await SalesOrder.find({ customerId: req.params.customerId })
      .populate('items.gensetId', 'model brand capacity price')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders', error: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id)
      .populate('customerId', 'name email phone company')
      .populate('items.gensetId');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Payment status updated', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update payment status', error: error.message });
  }
});

// Cancel order
router.patch('/:id/cancel', async (req, res) => {
  try {
    const order = await SalesOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Restore stock if order was confirmed
    if (order.status !== 'Cancelled') {
      for (let item of order.items) {
        await Genset.findByIdAndUpdate(item.gensetId, {
          $inc: { stock: item.quantity }
        });
      }
    }
    
    order.status = 'Cancelled';
    await order.save();
    
    res.json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
});

module.exports = router;
