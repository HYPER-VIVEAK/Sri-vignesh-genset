const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Genset = require('../models/Genset');
const Customer = require('../models/Customer');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Genset.deleteMany({});
    await Customer.deleteMany({});
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
      },
      {
        model: 'DG-10000',
        brand: 'Caterpillar',
        capacity: 10000,
        fuelType: 'Diesel',
        phase: 'Three Phase',
        price: 450000,
        condition: 'New',
      },
      {
        model: 'GG-3000',
        brand: 'Honda',
        capacity: 3000,
        fuelType: 'Gasoline',
        phase: 'Single Phase',
        price: 120000,
        condition: 'New',
      },
    ]);
    console.log(`📦 Seeded ${gensets.length} gensets`);

    // Seed Customers with hashed passwords
    const salt = await bcrypt.genSalt(10);
    const customers = await Customer.insertMany([
      {
        name: 'viveak',
        email: 'admin@example.com',
        phone: '9999999999',
        password: await bcrypt.hash('admin123', salt),
        role: 'admin',
        company: 'Admin',
      },
      {
        name: 'Acme Corporation',
        email: 'acme@example.com',
        phone: '9876543210',
        password: await bcrypt.hash('password123', salt),
        company: 'Acme Corp',
      },
      {
        name: 'Tech Industries',
        email: 'tech@example.com',
        phone: '9123456789',
        password: await bcrypt.hash('password123', salt),
        company: 'Tech Industries Ltd',
      },
    ]);
    console.log(`👥 Seeded ${customers.length} customers (including 1 admin)`);

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
