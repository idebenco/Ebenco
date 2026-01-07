# Wholesale Business Backend API

REST API for the wholesale business website built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (Admin & Customer)
- CRUD operations for products, orders, and users
- Input validation and error handling
- Security features (helmet, CORS, rate limiting)
- MongoDB with Mongoose ODM

## Prerequisites

- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wholesale-db
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Seed Database with Sample Data
```bash
npm run seed
```

This will create:
- Admin user: `admin@wholesale.com` / `Admin123!`
- Customer user: `customer@example.com` / `Customer123!`
- 10 sample products

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get orders (all for admin, own for customer)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete/cancel order

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet for security headers
- CORS configuration
- Rate limiting on API endpoints
- Input validation with express-validator
- MongoDB injection prevention

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

## License

ISC
