# Quick Start Guide - Wholesale Business Website

Get the wholesale business website up and running in 5 minutes!

## Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR MongoDB Atlas account (free)
- Terminal/Command prompt

## Quick Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/idebenco/Ebenco.git
cd Ebenco

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment (1 minute)

**Backend Configuration:**
```bash
# In the backend directory
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wholesale-db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

**For MongoDB Atlas (cloud database):**
Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wholesale-db
```

**Frontend Configuration:**
```bash
# In the frontend directory
cd frontend
cp .env.example .env
```

The default `.env` should work:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Seed Database (30 seconds)

```bash
# In the backend directory
cd backend
npm run seed
```

This creates:
- ✅ Admin user: `admin@wholesale.com` / `Admin123!`
- ✅ Customer user: `customer@example.com` / `Customer123!`
- ✅ 10 sample products

### Step 4: Start the Application (30 seconds)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Wait for: `Server is running on port 5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 5: Access the Application (1 minute)

Open your browser and go to: **http://localhost:5173**

## Test the Application

### As a Customer:
1. Click "Login"
2. Email: `customer@example.com`
3. Password: `Customer123!`
4. Go to "My Orders"
5. Create a new order!

### As an Admin:
1. Click "Login"
2. Email: `admin@wholesale.com`
3. Password: `Admin123!`
4. Access "Admin Dashboard"
5. Manage products, orders, and customers!

## Common Issues

### Backend won't start?
- **Check MongoDB**: Is MongoDB running? `mongod` or check MongoDB Atlas connection
- **Port in use**: Change `PORT` in backend `.env` to 5001
- **Dependencies**: Run `npm install` in backend directory

### Frontend won't start?
- **Port in use**: Vite will automatically try another port
- **Dependencies**: Run `npm install` in frontend directory
- **Backend not running**: Start backend first

### Can't connect to database?
- **Local MongoDB**: Start MongoDB service
  ```bash
  # Windows
  net start MongoDB
  
  # Mac
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```
- **MongoDB Atlas**: 
  - Check connection string
  - Verify IP whitelist (add 0.0.0.0/0 for testing)
  - Check username/password

### Login not working?
- **Did you seed the database?** Run `npm run seed` in backend directory
- **Check browser console**: Look for error messages
- **Check backend terminal**: Look for error logs

## Project Structure

```
Ebenco/
├── backend/          # Node.js API server
│   ├── src/
│   ├── .env          # Backend config (create this)
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   ├── .env          # Frontend config (create this)
│   └── package.json
└── README.md
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Next Steps

1. ✅ **Explore the Application**: Browse products, create orders
2. ✅ **Read Documentation**: Check out README.md for full details
3. ✅ **Customize**: Modify products, add features
4. ✅ **Deploy**: See DEPLOYMENT.md for production deployment

## Key Features to Test

### Customer Features:
- ✅ Browse products with search and filter
- ✅ Register new account
- ✅ Login and logout
- ✅ Submit bulk orders
- ✅ View order history
- ✅ Track order status

### Admin Features:
- ✅ Dashboard with statistics
- ✅ Add/edit/delete products
- ✅ Manage product inventory
- ✅ View all orders
- ✅ Update order status
- ✅ View customer list

## Support

Having trouble? Check:
1. **README.md** - Full documentation
2. **ARCHITECTURE.md** - System design details
3. **DEPLOYMENT.md** - Deployment guide
4. **GitHub Issues** - Report problems

## Development Tips

### Hot Reload
Both frontend and backend have hot reload:
- **Frontend**: Changes to React components reload instantly
- **Backend**: Changes to TypeScript files restart server automatically

### Database GUI
Use MongoDB Compass to view your database:
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`

### API Testing
Use tools like:
- Postman: https://www.postman.com/
- Insomnia: https://insomnia.rest/
- Thunder Client (VS Code extension)

Test API endpoint:
```
GET http://localhost:5000/api/products
```

## Production Checklist

Before deploying to production:
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production frontend URL
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Set up automatic backups

See **DEPLOYMENT.md** for detailed instructions.

## Quick Reference

### Default Ports
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- MongoDB: `mongodb://localhost:27017`

### Demo Accounts
- **Admin**: admin@wholesale.com / Admin123!
- **Customer**: customer@example.com / Customer123!

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Auth**: JWT tokens

---

**You're all set! Happy coding! 🚀**
