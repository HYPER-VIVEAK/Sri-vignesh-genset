/**
 * Utility to create admin user from command line
 * Usage: node utils/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

const createAdmin = async (name, email, password, phone) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Customer.findOne({ email });
    if (existingAdmin) {
      console.log('Admin with this email already exists');
      process.exit(1);
    }

    // Create admin user
    const admin = new Customer({
      name,
      email,
      password,
      phone,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✓ Admin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Role: admin`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

// Get arguments from command line
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('Usage: node utils/createAdmin.js <name> <email> <password> <phone>');
  console.log('Example: node utils/createAdmin.js "John Admin" admin@genset.com password@123 9876543210');
  process.exit(1);
}

const [name, email, password, phone] = args;
createAdmin(name, email, password, phone);
