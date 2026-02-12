const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  gensetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genset'
  },
  serviceType: {
    type: String,
    enum: ['Installation', 'Repair', 'Maintenance', 'Inspection', 'Emergency', 'Warranty'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer' // Technician is a type of user
  },
  status: {
    type: String,
    enum: ['Open', 'Assigned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  scheduledDate: Date,
  completedDate: Date,
  serviceLocation: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  estimatedCost: Number,
  actualCost: Number,
  partsUsed: [{
    partName: String,
    quantity: Number,
    cost: Number
  }],
  technicianNotes: String,
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }
}, {
  timestamps: true
});

// Auto-generate ticket number before validation
serviceRequestSchema.pre('validate', async function() {
  if (!this.ticketNumber) {
    const count = await mongoose.model('ServiceRequest').countDocuments();
    this.ticketNumber = `SR-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
});

// Indexes (ticketNumber already indexed via unique: true)
serviceRequestSchema.index({ customerId: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ assignedTechnician: 1 });
serviceRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
