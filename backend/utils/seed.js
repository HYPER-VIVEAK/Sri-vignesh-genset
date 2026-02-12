const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Genset = require('../models/Genset');
const Customer = require('../models/Customer');
const ServiceRequest = require('../models/ServiceRequest');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Genset.deleteMany({});
    await Customer.deleteMany({});
    await ServiceRequest.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Seed Gensets
    const gensets = await Genset.insertMany([
      {
        model: 'DG-5000',
        brand: 'Cummins',
        capacity: 5000,
        fuelType: 'Diesel',
        phase: 'Three Phase',
        price: 250000,
        condition: 'New',
        stock: 10,
      },
      {
        model: 'DG-10000',
        brand: 'Caterpillar',
        capacity: 10000,
        fuelType: 'Diesel',
        phase: 'Three Phase',
        price: 450000,
        condition: 'New',
        stock: 10,
      },
      {
        model: 'GG-3000',
        brand: 'Honda',
        capacity: 3000,
        fuelType: 'Gasoline',
        phase: 'Single Phase',
        price: 120000,
        condition: 'New',
        stock: 10,
      },
    ]);
    console.log(`📦 Seeded ${gensets.length} gensets`);

    // Seed Customers with plain passwords (pre-save hook will hash them)
    // Must save individually so pre-save hook runs
    const customers = [];
    const customerData = [
      {
        name: 'viveak',
        email: 'admin@example.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin',
        company: 'Admin',
      },
      {
        name: 'Acme Corporation',
        email: 'acme@example.com',
        phone: '9876543210',
        password: 'password123',
        company: 'Acme Corp',
      },
      {
        name: 'Tech Industries',
        email: 'tech@example.com',
        phone: '9123456789',
        password: 'password123',
        company: 'Tech Industries Ltd',
      },
    ];
    
    for (const data of customerData) {
      const customer = new Customer(data);
      await customer.save();
      customers.push(customer);
    }
    console.log(`👥 Seeded ${customers.length} customers (including 1 admin)`);

    const makeTicket = (index) => `SR-${Date.now()}-${String(index).padStart(4, '0')}`;

    const serviceRequests = await ServiceRequest.insertMany([
      {
        customerId: customers[1]._id,
        ticketNumber: makeTicket(1),
        gensetId: gensets[0]._id,
        serviceType: 'Maintenance',
        priority: 'Medium',
        description: 'Quarterly maintenance and oil service.',
        contactNumber: '9876543210',
        status: 'Open'
      },
      {
        customerId: customers[2]._id,
        ticketNumber: makeTicket(2),
        gensetId: gensets[1]._id,
        serviceType: 'Repair',
        priority: 'High',
        description: 'Unit is not starting after power outage.',
        contactNumber: '9123456789',
        assignedTechnician: customers[0]._id,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'Assigned'
      },
      {
        customerId: customers[1]._id,
        ticketNumber: makeTicket(3),
        gensetId: gensets[2]._id,
        serviceType: 'Inspection',
        priority: 'Low',
        description: 'Routine inspection for annual compliance.',
        contactNumber: '9876543210',
        status: 'Completed',
        completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actualCost: 3500,
        technicianNotes: 'All checks passed. Filters replaced.',
        customerFeedback: { rating: 5, comment: 'Quick and professional service.' }
      }
    ]);
    console.log(`🛠️  Seeded ${serviceRequests.length} service requests`);

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
