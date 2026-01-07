# Wholesale Business Website

A complete full-stack wholesale business website for selling foodstuffs online. Built with modern technologies including React, TypeScript, Node.js, Express, and MongoDB.

## 🌟 Features

### Public Features
- **Product Catalog**: Browse quality foodstuffs with search and filter functionality
- **Wholesale Pricing**: Comprehensive pricing information with tier breakdowns and examples
- **User Registration**: Easy sign-up process for new customers
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **About & Contact Pages**: Learn about the business and get in touch

### Customer Features
- **Secure Authentication**: JWT-based login system
- **Order Management**: Submit bulk order requests with multiple items
- **Order Tracking**: View order history and track order status
- **Profile Management**: Update delivery address and contact information

### Admin Features
- **Dashboard Analytics**: Overview of business metrics
- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View all orders and update order status
- **Customer Management**: View registered customers and their information
- **Secure Access**: Role-based access control

## 🏗️ Architecture

This project follows a modern three-tier architecture:

```
┌─────────────────────────────────────┐
│   Frontend (React + TypeScript)     │
│   - Public pages                    │
│   - Customer dashboard              │
│   - Admin dashboard                 │
└─────────────────────────────────────┘
              ↕ REST API
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)       │
│   - Authentication (JWT)            │
│   - Business logic                  │
│   - API endpoints                   │
└─────────────────────────────────────┘
              ↕ Mongoose ODM
┌─────────────────────────────────────┐
│   Database (MongoDB)                │
│   - Users, Products, Orders         │
└─────────────────────────────────────┘
```

## 🚀 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling with custom responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### Security
- Password hashing with bcrypt (10+ salt rounds)
- JWT token authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting on sensitive endpoints
- Environment variable protection

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/idebenco/Ebenco.git
cd Ebenco
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# Edit .env file:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/wholesale-db
# JWT_SECRET=your-super-secret-jwt-key
# NODE_ENV=development

# Start backend server
npm run dev
```

The backend will be running at `http://localhost:5000`

### 3. Seed Database (Optional but Recommended)
```bash
# In the backend directory
npm run seed
```

This creates:
- Admin account: `admin@wholesale.com` / `Admin123!`
- Customer account: `customer@example.com` / `Customer123!`
- 10 sample products

### 4. Frontend Setup
```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with backend API URL
# Edit .env file:
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🎯 Usage

### Access the Application
Open your browser and navigate to `http://localhost:5173`

### Demo Accounts (After Seeding)

**Admin Account:**
- Email: `admin@wholesale.com`
- Password: `Admin123!`
- Access: Full admin dashboard with product, order, and customer management

**Customer Account:**
- Email: `customer@example.com`
- Password: `Customer123!`
- Access: Customer dashboard for placing and tracking orders

### Key Workflows

**For Customers:**
1. Register a new account or login
2. Browse products on the Products page
3. Go to Customer Dashboard
4. Click "New Order" to submit a bulk order
5. Add products and quantities
6. Fill in delivery address
7. Submit order
8. Track order status in the dashboard

**For Admins:**
1. Login with admin credentials
2. Access Admin Dashboard
3. Manage Products:
   - Add new products with details
   - Edit existing products
   - Delete products
   - Update inventory
4. Manage Orders:
   - View all orders
   - Filter by status
   - Update order status (pending → approved → completed)
5. View Customers:
   - See registered customers
   - View customer information

## 📁 Project Structure

```
Ebenco/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware (auth, errors)
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions (seed script)
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── index.html
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── ARCHITECTURE.md      # Detailed system architecture
├── DEPLOYMENT.md        # Deployment guide
├── .gitignore
├── LICENSE
└── README.md
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed system architecture, data models, and API documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for production
- **[FRONTEND_DESIGN.md](./FRONTEND_DESIGN.md)** - Frontend design, component structure, and user flow ⭐ NEW
- **[Backend README](./backend/README.md)** - Backend-specific documentation
- **[Frontend README](./frontend/README.md)** - Frontend-specific documentation

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Products (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get orders (all for admin, own for customer)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive deployment instructions.

### Quick Deployment Options

**Backend:**
- Render (Recommended)
- Railway
- Heroku
- DigitalOcean

**Frontend:**
- Netlify (Recommended)
- Vercel
- GitHub Pages

**Database:**
- MongoDB Atlas (Cloud-hosted, free tier available)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication with secure tokens
- ✅ Role-based access control
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Input validation and sanitization
- ✅ Environment variable protection
- ✅ MongoDB injection prevention

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern best practices for full-stack development
- Designed for scalability and maintainability
- Implements industry-standard security measures

## 📧 Contact

For questions or support, please contact:
- Email: info@wholesale.com
- GitHub: [@idebenco](https://github.com/idebenco)

## 🎓 Learning Resources

This project demonstrates:
- Full-stack TypeScript development
- RESTful API design
- JWT authentication
- Role-based authorization
- MongoDB database design
- React context and hooks
- Responsive web design
- Production deployment practices

Perfect for learning modern web development or as a template for similar projects!

---

**Built with ❤️ for the wholesale business community**
