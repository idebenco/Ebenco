# System Architecture - Wholesale Business Website

## Overview
This is a full-stack wholesale business website for selling foodstuffs online. The system enables customers to browse products, register, and submit bulk order requests, while admins can manage products, customers, and orders through a secure dashboard.

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (SPA)                                 │   │
│  │  - Public Pages (Home, Products, About, Contact)     │   │
│  │  - Auth Pages (Login, Register)                      │   │
│  │  - Customer Dashboard                                │   │
│  │  - Admin Dashboard                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                      SERVER LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Node.js + Express Backend (TypeScript)              │   │
│  │  - REST API Endpoints                                │   │
│  │  - JWT Authentication                                │   │
│  │  - Role-Based Access Control (RBAC)                  │   │
│  │  - Business Logic Layer                              │   │
│  │  - Input Validation & Error Handling                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MongoDB (NoSQL Database)                            │   │
│  │  - Users Collection                                  │   │
│  │  - Products Collection                               │   │
│  │  - Orders Collection                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API / React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv

### Database
- **Database**: MongoDB (NoSQL)
- **ODM**: Mongoose
- **Features**: Schema validation, indexing, middleware

### Hosting & Deployment
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Heroku, Railway, Render, or DigitalOcean
- **Database**: MongoDB Atlas (cloud-hosted)
- **Version Control**: Git + GitHub

## User Roles

### 1. Customer (Public User)
**Permissions:**
- View products and prices
- Register for an account
- Log in/Log out
- View own profile
- Submit bulk order requests
- View own order history
- Update own profile information

### 2. Admin (Administrator)
**Permissions:**
- All customer permissions
- Add new products
- Edit existing products
- Delete products
- Manage product inventory and pricing
- View all customers
- View all orders
- Update order status (pending, approved, rejected, completed)
- Access admin dashboard
- View business analytics

## Website Pages and Features

### Public Pages
1. **Home Page** (`/`)
   - Hero section with business overview
   - Featured products
   - Call-to-action buttons
   - Company information

2. **Products Page** (`/products`)
   - Product listing with images
   - Product details (name, description, price, unit)
   - Search and filter functionality
   - Product categories

3. **About Page** (`/about`)
   - Company background
   - Mission and vision
   - Team information

4. **Contact Page** (`/contact`)
   - Contact form
   - Business contact information
   - Location map (optional)

### Authentication Pages
5. **Login Page** (`/login`)
   - Email/password login form
   - "Remember me" option
   - Link to registration page
   - Forgot password (optional)

6. **Register Page** (`/register`)
   - Registration form (name, email, phone, business name, password)
   - Terms and conditions checkbox
   - Link to login page

### Customer Pages
7. **Customer Dashboard** (`/customer/dashboard`)
   - Order submission form
   - Order history table
   - Profile information
   - Order status tracking

8. **Customer Profile** (`/customer/profile`)
   - View and edit profile information
   - Change password

### Admin Pages
9. **Admin Dashboard** (`/admin/dashboard`)
   - Overview statistics (total products, customers, orders)
   - Recent orders
   - Quick actions

10. **Admin Products** (`/admin/products`)
    - Product list table
    - Add new product form
    - Edit product modal
    - Delete product confirmation
    - Product search and filter

11. **Admin Customers** (`/admin/customers`)
    - Customer list table
    - View customer details
    - Customer search and filter

12. **Admin Orders** (`/admin/orders`)
    - Orders list table
    - View order details
    - Update order status
    - Order search and filter
    - Export orders (optional)

## Data Models

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique, required),
  password: string (hashed, required),
  phone: string,
  businessName?: string,
  address?: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  },
  role: "customer" | "admin",
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```typescript
{
  _id: ObjectId,
  name: string (required),
  description: string,
  category: string,
  price: number (required),
  unit: string (e.g., "kg", "bag", "carton"),
  stockQuantity: number,
  minimumOrder: number,
  imageUrl?: string,
  isAvailable: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  _id: ObjectId,
  orderNumber: string (unique, auto-generated),
  customerId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId (ref: Product),
      productName: string,
      quantity: number,
      price: number,
      subtotal: number
    }
  ],
  totalAmount: number,
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled",
  notes?: string,
  deliveryAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  },
  createdAt: Date,
  updatedAt: Date,
  completedAt?: Date
}
```

## Security Requirements

### Authentication & Authorization
1. **Password Security**
   - Passwords hashed using bcryptjs (10 salt rounds minimum)
   - Minimum password requirements (8 characters, mixed case, numbers)
   - Secure password reset mechanism

2. **JWT Token Management**
   - Tokens signed with secure secret key
   - Token expiration (24 hours recommended)
   - Refresh token mechanism (optional)
   - Token stored in httpOnly cookies or localStorage

3. **Role-Based Access Control (RBAC)**
   - Middleware to verify user role
   - Admin-only routes protected
   - Customer can only access own data

### API Security
1. **CORS (Cross-Origin Resource Sharing)**
   - Configured to allow only frontend domain
   - Credentials enabled for cookie-based auth

2. **Rate Limiting**
   - Limit API requests per IP (e.g., 100 requests/15 minutes)
   - Stricter limits on auth endpoints (5 attempts/15 minutes)

3. **Input Validation**
   - Server-side validation for all inputs
   - Sanitization to prevent XSS attacks
   - MongoDB injection prevention

4. **Security Headers**
   - Helmet.js for security headers
   - Content Security Policy (CSP)
   - X-Frame-Options, X-Content-Type-Options

5. **HTTPS**
   - SSL/TLS certificate for production
   - Redirect HTTP to HTTPS

### Data Protection
1. **Environment Variables**
   - Sensitive data in .env file
   - Never commit .env to version control
   - Separate configs for dev/prod

2. **Database Security**
   - MongoDB authentication enabled
   - Database user with limited privileges
   - Connection string secured
   - Regular backups

3. **Error Handling**
   - Generic error messages to clients
   - Detailed errors logged server-side
   - No sensitive data in error responses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin) / own orders (customer)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order (customer)
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Cancel order

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## Deployment Steps

### Prerequisites
1. Node.js (v18+) installed
2. MongoDB Atlas account or local MongoDB
3. Git installed
4. GitHub account
5. Hosting accounts (Netlify/Vercel for frontend, Heroku/Railway for backend)

### Database Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access (allow from anywhere for dev: 0.0.0.0/0)
4. Create database user
5. Get connection string
6. Add connection string to .env file

### Backend Deployment
1. Set up environment variables on hosting platform
2. Connect GitHub repository
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Deploy backend
6. Note backend URL for frontend configuration

### Frontend Deployment
1. Update API base URL to backend URL
2. Build frontend: `npm run build`
3. Deploy to Netlify/Vercel
4. Configure environment variables
5. Note frontend URL for CORS configuration

### Post-Deployment
1. Update CORS settings with frontend URL
2. Create admin user (via seed script or API)
3. Test all functionality
4. Monitor logs for errors
5. Set up SSL certificates (usually automatic)

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install` (in both frontend and backend)
3. Set up .env files
4. Run backend: `npm run dev` (port 5000)
5. Run frontend: `npm run dev` (port 5173)
6. Access app at http://localhost:5173

### Environment Variables
**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wholesale-db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## Scalability Considerations

### Future Enhancements
1. Payment gateway integration (Stripe, PayPal)
2. Email notifications (order confirmations, status updates)
3. SMS notifications
4. Advanced analytics dashboard
5. Product image upload to cloud storage (AWS S3, Cloudinary)
6. PDF invoice generation
7. Multi-language support
8. Advanced search with Elasticsearch
9. Real-time order tracking with WebSockets
10. Mobile app (React Native)

### Performance Optimization
1. Database indexing on frequently queried fields
2. API response caching
3. Image optimization and lazy loading
4. Code splitting in frontend
5. CDN for static assets
6. Load balancing for high traffic

## Conclusion
This architecture provides a solid foundation for a wholesale business website with clear separation of concerns, security best practices, and room for growth. The modular design allows for easy maintenance and feature additions.
