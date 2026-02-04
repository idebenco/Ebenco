# Quick Start Guide - Rental Property Management System

This guide helps you get started with the Rental Property Management System in under 10 minutes.

## What You'll Need

- Node.js installed (v14 or higher)
- MongoDB installed (or use MongoDB Atlas free tier)
- A code editor (VS Code recommended)
- Terminal/Command Prompt

## Step 1: Get the Code

```bash
git clone https://github.com/idebenco/Ebenco.git
cd Ebenco
```

## Step 2: Start the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

The backend will run at `http://localhost:5000`

**Default MongoDB**: `mongodb://localhost:27017/rental-management`

## Step 3: Start the Mobile App

Open a new terminal:

```bash
# Navigate to mobile app
cd mobile-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start Expo
npm start
```

**To view the app:**
- Press `w` to open in web browser
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

## Step 4: Start the Web Dashboard

Open another terminal:

```bash
# Navigate to web dashboard
cd web-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the app
npm start
```

The dashboard will open at `http://localhost:3000`

## Testing the Application

### Create Test Users

**Via API (using curl or Postman):**

1. **Create Admin User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin",
    "profile": {
      "firstName": "Admin",
      "lastName": "User",
      "phone": "+1234567890"
    }
  }'
```

2. **Create Landlord:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "landlord@test.com",
    "password": "password123",
    "role": "landlord",
    "profile": {
      "firstName": "John",
      "lastName": "Landlord",
      "phone": "+1234567890"
    }
  }'
```

3. **Create Tenant:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tenant@test.com",
    "password": "password123",
    "role": "tenant",
    "profile": {
      "firstName": "Jane",
      "lastName": "Tenant",
      "phone": "+1234567890"
    }
  }'
```

### Test Login

**Web Dashboard (Admin):**
- Go to `http://localhost:3000`
- Email: `admin@test.com`
- Password: `password123`

**Mobile App (Tenant or Landlord):**
- Open the mobile app
- Tap "Login"
- Use tenant or landlord credentials

## Workflow Example

### As a Landlord:

1. Login to mobile app with landlord credentials
2. Navigate to Properties (if you add this screen)
3. Create a new property listing

### As a Tenant:

1. Login to mobile app with tenant credentials
2. Browse available properties
3. View property details
4. Submit an application

### As an Admin:

1. Login to web dashboard
2. View dashboard analytics
3. Manage users, properties, applications, and payments

## Project Structure

```
Ebenco/
├── backend/          # API server (Port 5000)
├── mobile-app/       # Mobile application
├── web-dashboard/    # Admin dashboard (Port 3000)
└── docs/            # Documentation
```

## Common Issues

### Backend won't start
- **Issue**: MongoDB connection failed
- **Solution**: Make sure MongoDB is running or use MongoDB Atlas

### Mobile app shows connection error
- **Issue**: Can't connect to backend
- **Solution**: 
  - For iOS Simulator/Android Emulator: Use `http://localhost:5000/api`
  - For Physical Device: Use your computer's IP (e.g., `http://192.168.1.x:5000/api`)

### Web dashboard blank page
- **Issue**: API connection failed
- **Solution**: Check that backend is running on port 5000

## Next Steps

### Learn More
- [Full Documentation](../README.md)
- [Backend API Reference](../backend/README.md)
- [Mobile App Guide](../mobile-app/README.md)
- [Web Dashboard Guide](../web-dashboard/README.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)

### Customize
- Add your own branding
- Customize colors and themes
- Add additional features
- Configure payment gateway (Stripe)
- Set up file storage (AWS S3)

### Deploy
- Follow the [Deployment Guide](DEPLOYMENT.md)
- Set up production database
- Configure domain and SSL
- Deploy to cloud platforms

## Support

For help and questions:
- Check documentation in respective folders
- Review API documentation
- Open an issue on GitHub

## Development Tips

### Hot Reloading
All three applications support hot reloading - changes you make will automatically refresh.

### Debugging
- **Backend**: Check terminal for logs
- **Mobile**: Use React Native Debugger or Chrome DevTools
- **Web**: Use browser DevTools (F12)

### Database Management
Use MongoDB Compass to visually manage your database:
- Download from mongodb.com/products/compass
- Connect to `mongodb://localhost:27017`
- View collections: users, properties, applications, payments

### API Testing
Use Postman or similar tools to test API endpoints directly:
- Import API documentation
- Test authentication flows
- Verify data responses

## Features Overview

### Mobile App Features
✅ User authentication (login/register)
✅ Browse properties with search
✅ View property details
✅ Submit rental applications
✅ Track application status
✅ View payments
✅ User profile management

### Web Dashboard Features
✅ Admin authentication
✅ Analytics dashboard with charts
✅ User management (CRUD)
✅ Property monitoring
✅ Application tracking
✅ Payment oversight
✅ Role-based access control

### Backend API Features
✅ RESTful API architecture
✅ JWT authentication
✅ Role-based authorization
✅ Input validation
✅ Error handling
✅ MongoDB integration
✅ Comprehensive endpoints

## Quick Commands Reference

```bash
# Backend
cd backend && npm start

# Mobile App
cd mobile-app && npm start

# Web Dashboard
cd web-dashboard && npm start

# Install all dependencies
npm install

# Clear cache (if issues)
npm start -- --reset-cache  # Mobile
rm -rf node_modules && npm install  # Any
```

## Default Ports

- Backend API: `5000`
- Web Dashboard: `3000`
- Mobile App: `19000` (Expo)
- MongoDB: `27017`

## Environment Files

All three components need `.env` files:

**Backend** (`.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rental-management
JWT_SECRET=your-secret-key
```

**Mobile App** (`.env`):
```
API_URL=http://localhost:5000/api
```

**Web Dashboard** (`.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

Happy coding! 🚀
