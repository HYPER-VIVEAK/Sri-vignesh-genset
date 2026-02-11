const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    gensetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genset',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: Number,
    discount: {
      type: Number,
      default: 0
    },
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Quotation', 'Confirmed', 'In Production', 'Ready for Delivery', 'Delivered', 'Cancelled'],
    default: 'Quotation'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'Financing']
  },
  deliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

// Auto-generate order number
salesOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('SalesOrder').countDocuments();
    this.orderNumber = `SO-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes (orderNumber already indexed via unique: true)
salesOrderSchema.index({ customerId: 1 });
salesOrderSchema.index({ status: 1 });
salesOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
