require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../src/models/User.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management';

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('👤 Creating admin account...');
    
    const adminData = {
      email: 'admin@ebenco.com',
      password: 'Admin@123456',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      profile: {
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+1234567890'
      }
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`   Email: ${adminData.email}`);
      console.log('   Use this account to login to the dashboard.\n');
      process.exit(0);
    }

    // Create new admin
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin account created successfully!\n');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('\n⚠️  Please change the password after first login!\n');
    console.log('🌐 Login at: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

createAdmin();
