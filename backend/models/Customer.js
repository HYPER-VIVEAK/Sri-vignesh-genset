const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  customerType: {
    type: String,
    enum: ['Individual', 'Business', 'Government', 'Industrial'],
    default: 'Individual'
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'technician'],
    default: 'customer'
  }
}, {
  timestamps: true
});

// Index for faster queries
customerSchema.index({ email: 1 });
customerSchema.index({ role: 1 });

module.exports = mongoose.model('Customer', customerSchema);
