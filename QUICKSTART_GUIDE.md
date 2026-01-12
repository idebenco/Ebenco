# Quick Start Guide - Get Running in Minutes

## Prerequisites
- Node.js v14+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone https://github.com/idebenco/Ebenco.git
cd Ebenco

# Install dependencies for all components
cd backend && npm install && cd ..
cd web-dashboard && npm install && cd ..
cd mobile-app && npm install && cd ..
```

## Step 2: Configure Environment Variables (3 minutes)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env file with your MongoDB URI and JWT secret
```

Minimum required variables:
```env
MONGODB_URI=mongodb://localhost:27017/rental-management
JWT_SECRET=your-super-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

### Web Dashboard
```bash
cd web-dashboard
cp .env.example .env
# Edit .env file
```

Required:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Mobile App
```bash
cd mobile-app
cp .env.example .env
```

Required:
```env
API_URL=http://localhost:5000
```

## Step 3: Start All Services (1 minute)

Open 3 terminal windows:

### Terminal 1 - Backend
```bash
cd backend
npm start
# Backend will run on http://localhost:5000
```

### Terminal 2 - Web Dashboard
```bash
cd web-dashboard
npm start
# Dashboard will run on http://localhost:3000
```

### Terminal 3 - Mobile App
```bash
cd mobile-app
npm start
# Expo will start and show QR code
```

## Step 4: Access the Application

### Web Dashboard
- Open browser: `http://localhost:3000`
- Public Properties: `http://localhost:3000/properties`
- Apply Form: `http://localhost:3000/apply`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`

### Mobile App
- Scan QR code with Expo Go app (iOS/Android)
- OR press 'w' to open in web browser

### API Health Check
- Open: `http://localhost:5000/health`
- Should return: `{"status":"OK","timestamp":"..."}`

## First Time Setup

### Create Admin Account
```bash
# In a new terminal, from the backend directory
node scripts/create-admin.js
# OR use the registration page and manually change role in database
```

### Add Test Data (Optional)
```bash
cd backend
node scripts/seed-data.js
```

## Testing the System

### 1. Test Public Property Browsing
- Go to: `http://localhost:3000/properties`
- You should see the properties list (no login required)

### 2. Test Application Flow
- Click "APPLY" on any property
- Fill out the application form
- Upload documents
- Submit (you'll be redirected to payment)

### 3. Test Tour Scheduling
- Click "SCHEDULE TOUR" on any property
- Fill out the form (no login required)
- Submit tour request

### 4. Test Registration & Login
- Go to `/register`
- Create a new account (choose role: Tenant/Landlord/Agent)
- Login at `/login`

### 5. Test Admin Dashboard
- Login with admin credentials
- Access admin pages:
  - Users: `/users`
  - Properties: `/properties`
  - Applications: `/applications`
  - Payments: `/payments`
  - Tours: `/tours`
  - Withdrawals: `/withdrawals`

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: MongooseServerSelectionError
Solution: Make sure MongoDB is running
- Start MongoDB: `mongod` (or use MongoDB Compass)
- Or use MongoDB Atlas and update MONGODB_URI in .env
```

### CORS Error in Browser Console
```
Error: CORS policy blocked
Solution: Update CORS_ORIGIN in backend/.env
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::5000
Solution: Kill the process using that port
- macOS/Linux: `lsof -ti:5000 | xargs kill -9`
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
```

### Module Not Found Error
```
Error: Cannot find module 'express'
Solution: Install dependencies
cd backend && npm install
```

### React App Won't Start
```
Solution: Clear cache and reinstall
cd web-dashboard
rm -rf node_modules package-lock.json
npm install
npm start
```

## Quick Commands Reference

```bash
# Start backend
cd backend && npm start

# Start backend in development mode (auto-reload)
cd backend && npm run dev

# Start web dashboard
cd web-dashboard && npm start

# Build web dashboard for production
cd web-dashboard && npm run build

# Start mobile app
cd mobile-app && npm start

# Run connectivity tests
cd backend && npm run test:connectivity

# Check backend health
curl http://localhost:5000/health
```

## Next Steps

1. **Configure Stripe** - Add Stripe API keys for payments
2. **Configure Email** - Add SendGrid credentials for email notifications
3. **Add Sample Data** - Create properties and test applications
4. **Configure Deployment** - See DEPLOYMENT.md for production setup
5. **Read Documentation** - Check docs/ folder for detailed guides

## Support

- Documentation: `/docs` folder
- Issues: GitHub Issues
- Architecture: `docs/ARCHITECTURE.md`
- Security: `docs/SECURITY.md`
- Production Checklist: `PRODUCTION_CHECKLIST.md`

## Success! 🎉

If all services started successfully, you now have:
- ✅ Backend API running on port 5000
- ✅ Web Dashboard running on port 3000
- ✅ Mobile App ready in Expo
- ✅ MongoDB connected
- ✅ Full rental management system ready to use!

Go to `http://localhost:3000/properties` to see your first page!
