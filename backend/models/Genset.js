const mongoose = require('mongoose');

const gensetSchema = new mongoose.Schema({
  model: { 
    type: String, 
    required: [true, 'Model is required'],
    trim: true
  },
  brand: {
    type: String,
    required: true,
    enum: ['Cummins', 'Caterpillar', 'Kohler', 'Perkins', 'Honda', 'Generac', 'Kirloskar', 'Ashok Leyland', 'Other'],
    trim: true
  },
  capacity: { 
    type: Number,
    required: true,
    min: [0, 'Capacity must be positive']
  },
  fuelType: {
    type: String,
    enum: ['Diesel', 'Natural Gas', 'Propane', 'Gasoline', 'Petrol', 'Gas', 'CNG', 'LPG', 'Bi-Fuel'],
    required: true,
    trim: true
  },
  phase: {
    type: String,
    enum: ['Single Phase', 'Three Phase'],
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Refurbished'],
    default: 'New'
  },
  specifications: {
    voltage: String,
    frequency: String, // 50Hz or 60Hz
    engineModel: String,
    runningHours: Number,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [String],
  warrantyMonths: {
    type: Number,
    default: 12
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Index for faster queries
gensetSchema.index({ isActive: 1 });
gensetSchema.index({ model: 1 });
gensetSchema.index({ brand: 1 });
gensetSchema.index({ capacity: 1 });

module.exports = mongoose.model('Genset', gensetSchema);
