import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { config } from '../config/config';

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@wholesale.com',
      password: 'Admin123!',
      role: 'admin',
      phone: '+1234567890',
      businessName: 'Wholesale Admin',
    });
    console.log('Admin user created:', admin.email);

    // Create sample customer
    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'Customer123!',
      role: 'customer',
      phone: '+1234567891',
      businessName: 'Doe Enterprises',
      address: {
        street: '123 Business St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
    });
    console.log('Sample customer created:', customer.email);

    // Create sample products
    const products = [
      {
        name: 'Premium Rice',
        description: 'High-quality long grain rice, perfect for wholesale distribution',
        category: 'Grains',
        price: 45.99,
        unit: 'bag (25kg)',
        stockQuantity: 500,
        minimumOrder: 10,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
        isAvailable: true,
      },
      {
        name: 'Organic Wheat Flour',
        description: 'Stone-ground organic wheat flour for bakeries and restaurants',
        category: 'Grains',
        price: 38.50,
        unit: 'bag (20kg)',
        stockQuantity: 300,
        minimumOrder: 15,
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
        isAvailable: true,
      },
      {
        name: 'Olive Oil',
        description: 'Extra virgin olive oil in bulk, ideal for food service',
        category: 'Oils',
        price: 125.00,
        unit: 'carton (12 x 1L)',
        stockQuantity: 200,
        minimumOrder: 5,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
        isAvailable: true,
      },
      {
        name: 'Canned Tomatoes',
        description: 'Premium quality peeled tomatoes in bulk packaging',
        category: 'Canned Goods',
        price: 65.00,
        unit: 'case (24 cans)',
        stockQuantity: 400,
        minimumOrder: 10,
        imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b',
        isAvailable: true,
      },
      {
        name: 'Black Beans',
        description: 'Dried black beans, restaurant grade quality',
        category: 'Legumes',
        price: 42.00,
        unit: 'bag (25kg)',
        stockQuantity: 350,
        minimumOrder: 8,
        imageUrl: 'https://images.unsplash.com/photo-1589621316382-008455b857cd',
        isAvailable: true,
      },
      {
        name: 'White Sugar',
        description: 'Refined white sugar for commercial use',
        category: 'Sweeteners',
        price: 35.00,
        unit: 'bag (50kg)',
        stockQuantity: 600,
        minimumOrder: 20,
        imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f',
        isAvailable: true,
      },
      {
        name: 'Sea Salt',
        description: 'Coarse sea salt in bulk for food service industry',
        category: 'Seasonings',
        price: 28.00,
        unit: 'bag (10kg)',
        stockQuantity: 250,
        minimumOrder: 12,
        imageUrl: 'https://images.unsplash.com/photo-1528822258023-d7d5a1eafb9d',
        isAvailable: true,
      },
      {
        name: 'Pasta - Spaghetti',
        description: 'Durum wheat spaghetti pasta in bulk',
        category: 'Pasta',
        price: 52.00,
        unit: 'case (20 x 1kg)',
        stockQuantity: 450,
        minimumOrder: 10,
        imageUrl: 'https://images.unsplash.com/photo-1551462147-37764e5ebc33',
        isAvailable: true,
      },
      {
        name: 'Green Lentils',
        description: 'Premium green lentils, ideal for soups and side dishes',
        category: 'Legumes',
        price: 48.00,
        unit: 'bag (25kg)',
        stockQuantity: 280,
        minimumOrder: 8,
        imageUrl: 'https://images.unsplash.com/photo-1587735243475-46d2161d068a',
        isAvailable: true,
      },
      {
        name: 'Vegetable Oil',
        description: 'Refined vegetable cooking oil for commercial kitchens',
        category: 'Oils',
        price: 95.00,
        unit: 'carton (12 x 1L)',
        stockQuantity: 320,
        minimumOrder: 6,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
        isAvailable: true,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Admin Email: admin@wholesale.com');
    console.log('Admin Password: Admin123!');
    console.log('Customer Email: customer@example.com');
    console.log('Customer Password: Customer123!');
    console.log(`Total Products: ${createdProducts.length}`);
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
