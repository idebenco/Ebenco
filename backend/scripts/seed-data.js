require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../src/models/User.model');
const Property = require('../src/models/Property.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management';

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create landlord user
    console.log('👤 Creating landlord user...');
    const landlord = await User.findOne({ email: 'landlord@test.com' }) || await User.create({
      email: 'landlord@test.com',
      password: 'Test@123456',
      role: 'landlord',
      isActive: true,
      emailVerified: true,
      profile: {
        firstName: 'John',
        lastName: 'Landlord',
        phone: '+1234567890'
      }
    });
    console.log('✅ Landlord created');

    // Create sample properties
    console.log('\n🏠 Creating sample properties...');
    
    const properties = [
      {
        landlordId: landlord._id,
        title: 'Modern Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Walking distance to restaurants, shops, and public transportation.',
        propertyType: 'apartment',
        listingType: 'rent',
        address: {
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: {
            latitude: 40.7589,
            longitude: -73.9851
          }
        },
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        yearBuilt: 2018,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        videos: [],
        amenities: ['Parking', 'Gym', 'Pool', 'Laundry', 'Air Conditioning', 'Heating', 'WiFi', 'Security System', 'Balcony', 'Dishwasher'],
        status: 'available',
        availableDate: new Date(),
        showContactInfo: true,
        featured: true
      },
      {
        landlordId: landlord._id,
        title: 'Cozy Studio in Brooklyn',
        description: 'Perfect for young professionals! Cozy studio with modern finishes, close to subway and local amenities.',
        propertyType: 'studio',
        listingType: 'rent',
        address: {
          street: '456 Brooklyn Ave',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          country: 'USA',
          coordinates: {
            latitude: 40.6782,
            longitude: -73.9442
          }
        },
        price: 1800,
        bedrooms: 0,
        bathrooms: 1,
        squareFeet: 500,
        yearBuilt: 2015,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
        ],
        videos: [],
        amenities: ['Laundry', 'Air Conditioning', 'Heating', 'WiFi'],
        status: 'available',
        availableDate: new Date(),
        showContactInfo: true,
        featured: false
      },
      {
        landlordId: landlord._id,
        title: 'Spacious Family House',
        description: 'Lovely 4-bedroom house with large backyard, perfect for families. Quiet neighborhood with excellent schools nearby.',
        propertyType: 'house',
        listingType: 'rent',
        address: {
          street: '789 Oak Street',
          city: 'Queens',
          state: 'NY',
          zipCode: '11354',
          country: 'USA',
          coordinates: {
            latitude: 40.7614,
            longitude: -73.8320
          }
        },
        price: 3500,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        yearBuilt: 2010,
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
        ],
        videos: [],
        amenities: ['Parking', 'Laundry', 'Air Conditioning', 'Heating', 'Pet Friendly', 'WiFi', 'Security System', 'Dishwasher'],
        status: 'available',
        availableDate: new Date(),
        showContactInfo: true,
        featured: true
      }
    ];

    for (const propData of properties) {
      const existing = await Property.findOne({ title: propData.title });
      if (!existing) {
        await Property.create(propData);
        console.log(`✅ Created: ${propData.title}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${propData.title}`);
      }
    }

    console.log('\n✅ Sample data seeded successfully!\n');
    console.log('🌐 View properties at: http://localhost:3000/properties\n');
    console.log('📧 Landlord Login:');
    console.log('   Email: landlord@test.com');
    console.log('   Password: Test@123456\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

seedData();
