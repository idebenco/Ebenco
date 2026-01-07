# Backend System Design & REST API Documentation

## Overview

The backend is a RESTful API server built with Node.js, Express, and TypeScript, designed specifically for a wholesale business platform. It provides secure authentication, product management, customer management, and order request functionality with role-based access control.

## Architecture

### Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: MongoDB with Mongoose ODM 8.0.3
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.ts           # Environment configuration
│   │   └── database.ts         # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.ts   # Authentication logic
│   │   ├── productController.ts # Product CRUD operations
│   │   ├── orderController.ts  # Order management logic
│   │   └── userController.ts   # User management logic
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication & authorization
│   │   └── errorHandler.ts    # Global error handling
│   ├── models/
│   │   ├── User.ts             # User schema & model
│   │   ├── Product.ts          # Product schema & model
│   │   └── Order.ts            # Order schema & model
│   ├── routes/
│   │   ├── authRoutes.ts       # Authentication endpoints
│   │   ├── productRoutes.ts    # Product endpoints
│   │   ├── orderRoutes.ts      # Order endpoints
│   │   └── userRoutes.ts       # User endpoints
│   ├── utils/
│   │   └── seed.ts             # Database seeding script
│   └── server.ts               # Express app initialization
├── package.json
├── tsconfig.json
└── .env.example
```

### Core Design Principles

1. **RESTful Architecture**: Standard HTTP methods (GET, POST, PUT, DELETE)
2. **Stateless Authentication**: JWT tokens for session management
3. **Role-Based Access Control (RBAC)**: Admin vs Customer permissions
4. **Input Validation**: All inputs validated before processing
5. **Error Handling**: Consistent error responses with proper HTTP status codes
6. **Security First**: Multiple layers of security middleware
7. **Scalability**: Stateless design allows horizontal scaling

## Authentication System

### JWT-Based Authentication

The system uses JSON Web Tokens for secure, stateless authentication:

```typescript
// Token Structure
{
  id: string,        // User ID
  email: string,     // User email
  role: string,      // 'admin' or 'customer'
  iat: number,       // Issued at timestamp
  exp: number        // Expiration timestamp (24 hours)
}
```

### Authentication Flow

```
Client Request
    ↓
Check Authorization Header
    ↓
Extract JWT Token
    ↓
Verify Token Signature
    ↓
Decode Token Payload
    ↓
Attach User to Request
    ↓
Proceed to Route Handler
```

### Password Security

- **Hashing Algorithm**: bcrypt with 10 salt rounds
- **Password Storage**: Only hashed passwords stored in database
- **Login Verification**: Compare hashed password with bcrypt.compare()

```typescript
// Password hashing on registration
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification on login
const isMatch = await bcrypt.compare(password, user.password);
```

## REST API Endpoints

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional validation errors
}
```

### 1. Authentication Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Access**: Public  
**Rate Limit**: 5 requests per 15 minutes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "businessName": "John's Restaurant",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**Required Fields**: name, email, password  
**Optional Fields**: phone, businessName, address

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1234567890",
    "businessName": "John's Restaurant",
    "isActive": true
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or validation errors
- `409 Conflict`: Email already registered

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 8 characters
- Phone: Optional, valid phone format
- Name: Required, non-empty string

---

#### POST `/api/auth/login`

Authenticate user and receive JWT token.

**Access**: Public  
**Rate Limit**: 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "businessName": "John's Restaurant",
    "isActive": true
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account is inactive

**Frontend Storage:**
```typescript
// Store token and user data
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

---

#### GET `/api/auth/me`

Get current authenticated user information.

**Access**: Protected (requires authentication)  
**Authorization**: Bearer token required

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1234567890",
    "businessName": "John's Restaurant",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

### 2. Product Management Endpoints

#### GET `/api/products`

Get all products with optional filtering.

**Access**: Public (no authentication required)  
**Rate Limit**: 100 requests per 15 minutes

**Query Parameters:**
- `category` (optional): Filter by product category
- `search` (optional): Search in name and description
- `available` (optional): Filter by availability (true/false)

**Examples:**
```
GET /api/products
GET /api/products?category=Grains
GET /api/products?search=rice
GET /api/products?available=true
GET /api/products?category=Oils&available=true
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "products": [
    {
      "_id": "65a1b2c3d4e5f6789012346",
      "name": "Premium Rice",
      "description": "High-quality long grain rice",
      "category": "Grains",
      "price": 45.99,
      "unit": "bag (25kg)",
      "stockQuantity": 500,
      "minimumOrder": 10,
      "imageUrl": "https://example.com/rice.jpg",
      "isAvailable": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Database error

---

#### GET `/api/products/:id`

Get a single product by ID.

**Access**: Public  
**URL Parameters**: `id` - Product ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "product": {
    "_id": "65a1b2c3d4e5f6789012346",
    "name": "Premium Rice",
    "description": "High-quality long grain rice",
    "category": "Grains",
    "price": 45.99,
    "unit": "bag (25kg)",
    "stockQuantity": 500,
    "minimumOrder": 10,
    "imageUrl": "https://example.com/rice.jpg",
    "isAvailable": true
  }
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database error

---

#### POST `/api/products`

Create a new product (admin only).

**Access**: Protected + Admin only  
**Authorization**: Bearer token with admin role

**Request Body:**
```json
{
  "name": "Premium Rice",
  "description": "High-quality long grain rice",
  "category": "Grains",
  "price": 45.99,
  "unit": "bag (25kg)",
  "stockQuantity": 500,
  "minimumOrder": 10,
  "imageUrl": "https://example.com/rice.jpg",
  "isAvailable": true
}
```

**Required Fields**: name, description, category, price, unit, stockQuantity, minimumOrder

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "65a1b2c3d4e5f6789012346",
    "name": "Premium Rice",
    ...
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `500 Internal Server Error`: Database error

**Validation Rules:**
- name: Required, non-empty
- price: Required, number >= 0
- minimumOrder: Required, number >= 1
- stockQuantity: Required, number >= 0

---

#### PUT `/api/products/:id`

Update an existing product (admin only).

**Access**: Protected + Admin only  
**URL Parameters**: `id` - Product ID

**Request Body** (all fields optional):
```json
{
  "name": "Premium Basmati Rice",
  "price": 49.99,
  "stockQuantity": 600,
  "isAvailable": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "65a1b2c3d4e5f6789012346",
    "name": "Premium Basmati Rice",
    "price": 49.99,
    ...
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database error

---

#### DELETE `/api/products/:id`

Delete a product (admin only).

**Access**: Protected + Admin only  
**URL Parameters**: `id` - Product ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database error

---

### 3. Order Management Endpoints

#### GET `/api/orders`

Get orders (filtered by user role).

**Access**: Protected (authenticated users)  
**Authorization**: Bearer token required

**Query Parameters:**
- `status` (optional): Filter by order status

**Role-Based Filtering:**
- **Customer**: Returns only their own orders
- **Admin**: Returns all orders

**Examples:**
```
GET /api/orders
GET /api/orders?status=pending
GET /api/orders?status=completed
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "65a1b2c3d4e5f6789012347",
      "orderNumber": "ORD-1704657600-001",
      "customerId": {
        "_id": "65a1b2c3d4e5f6789012345",
        "name": "John Doe",
        "email": "john@example.com",
        "businessName": "John's Restaurant"
      },
      "items": [
        {
          "productId": "65a1b2c3d4e5f6789012346",
          "productName": "Premium Rice",
          "quantity": 10,
          "price": 45.99,
          "subtotal": 459.90
        }
      ],
      "totalAmount": 459.90,
      "status": "pending",
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001"
      },
      "notes": "Please deliver before 5 PM",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Order Status Values:**
- `pending`: Awaiting admin review
- `approved`: Admin approved, being processed
- `rejected`: Admin rejected the order
- `completed`: Order fulfilled and delivered
- `cancelled`: Order cancelled by customer or admin

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Database error

---

#### GET `/api/orders/:id`

Get a single order by ID.

**Access**: Protected  
**URL Parameters**: `id` - Order ID

**Authorization Rules:**
- **Customer**: Can only view their own orders
- **Admin**: Can view any order

**Success Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "_id": "65a1b2c3d4e5f6789012347",
    "orderNumber": "ORD-1704657600-001",
    "customerId": { ... },
    "items": [ ... ],
    "totalAmount": 459.90,
    "status": "pending",
    "deliveryAddress": { ... },
    "notes": "Please deliver before 5 PM",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to view this order
- `404 Not Found`: Order not found
- `500 Internal Server Error`: Database error

---

#### POST `/api/orders`

Create a new order (customer).

**Access**: Protected (authenticated users)  
**Authorization**: Bearer token required

**Request Body:**
```json
{
  "items": [
    {
      "productId": "65a1b2c3d4e5f6789012346",
      "quantity": 10
    },
    {
      "productId": "65a1b2c3d4e5f6789012348",
      "quantity": 5
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "notes": "Please deliver before 5 PM"
}
```

**Required Fields**: items (array), deliveryAddress  
**Optional Fields**: notes

**Backend Processing:**
1. Validates all products exist and are available
2. Checks each item quantity meets minimum order requirement
3. Calculates subtotal for each item (price × quantity)
4. Calculates total order amount
5. Generates unique order number
6. Creates order with status "pending"

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "65a1b2c3d4e5f6789012347",
    "orderNumber": "ORD-1704657600-001",
    "customerId": "65a1b2c3d4e5f6789012345",
    "items": [
      {
        "productId": "65a1b2c3d4e5f6789012346",
        "productName": "Premium Rice",
        "quantity": 10,
        "price": 45.99,
        "subtotal": 459.90
      }
    ],
    "totalAmount": 459.90,
    "status": "pending",
    "deliveryAddress": { ... }
  }
}
```

**Error Responses:**
- `400 Bad Request`: 
  - No items in order
  - Quantity below minimum order
  - Missing required fields
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Database error

**Validation Example:**
```typescript
// If minimum order for rice is 10 bags and customer orders 5:
{
  "message": "Minimum order for Premium Rice is 10 bag (25kg)"
}
```

---

#### PUT `/api/orders/:id`

Update order status (admin only).

**Access**: Protected + Admin only  
**URL Parameters**: `id` - Order ID

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid Status Transitions:**
- `pending` → `approved`, `rejected`, `cancelled`
- `approved` → `completed`, `cancelled`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "65a1b2c3d4e5f6789012347",
    "orderNumber": "ORD-1704657600-001",
    "status": "approved",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Special Behavior:**
- When status changes to `completed`, sets `completedAt` timestamp

**Error Responses:**
- `400 Bad Request`: Invalid status value
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: Order not found
- `500 Internal Server Error`: Database error

---

#### DELETE `/api/orders/:id`

Cancel or delete an order.

**Access**: Protected  
**URL Parameters**: `id` - Order ID

**Authorization Rules:**
- **Customer**: Can only cancel their own orders with status "pending"
- **Admin**: Can delete any order

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Cannot cancel order (not pending status)
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to delete this order
- `404 Not Found`: Order not found
- `500 Internal Server Error`: Database error

---

### 4. User Management Endpoints

#### GET `/api/users`

Get all users (admin only).

**Access**: Protected + Admin only  
**Authorization**: Bearer token with admin role

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 25,
  "users": [
    {
      "_id": "65a1b2c3d4e5f6789012345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "phone": "+1234567890",
      "businessName": "John's Restaurant",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Note**: Password field is excluded from response for security

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `500 Internal Server Error`: Database error

---

#### GET `/api/users/:id`

Get a single user by ID.

**Access**: Protected  
**URL Parameters**: `id` - User ID

**Authorization Rules:**
- **Customer**: Can only view their own profile
- **Admin**: Can view any user profile

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1234567890",
    "businessName": "John's Restaurant",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to view this user
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database error

---

#### PUT `/api/users/:id`

Update user information.

**Access**: Protected  
**URL Parameters**: `id` - User ID

**Authorization Rules:**
- **Customer**: Can only update their own profile
- **Admin**: Can update any user profile

**Request Body** (all fields optional):
```json
{
  "name": "John Smith",
  "phone": "+1234567891",
  "businessName": "Smith's Bistro",
  "address": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101"
  }
}
```

**Note**: Email and role cannot be changed through this endpoint

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Smith",
    "phone": "+1234567891",
    ...
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to update this user
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database error

---

#### DELETE `/api/users/:id`

Delete a user account (admin only).

**Access**: Protected + Admin only  
**URL Parameters**: `id` - User ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: User not found
- `500 Internal Server Error`: Database error

---

## Frontend-Backend Communication

### Communication Architecture

```
Frontend (React)
    ↓
Axios HTTP Client
    ↓
API Service Layer
    ↓
REST API Endpoints
    ↓
Express Routes
    ↓
Middleware (Auth, Validation)
    ↓
Controllers (Business Logic)
    ↓
Models (Database)
    ↓
MongoDB
```

### Axios Configuration

The frontend uses Axios as the HTTP client with automatic token management:

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 errors (auto-logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Layer Pattern

The frontend organizes API calls into service modules:

```typescript
// frontend/src/services/index.ts

// Authentication Service
export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Product Service
export const productService = {
  getAll: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Order Service
export const orderService = {
  getAll: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};

// User Service
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
```

### Frontend Component Examples

#### Example 1: User Registration

```typescript
// Component: Register.tsx
import { authService } from '../services';

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await authService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      businessName: formData.businessName
    });
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Redirect to dashboard
    navigate('/customer/dashboard');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Registration failed');
  }
};
```

**Flow:**
1. User fills registration form
2. Frontend validates input
3. Calls `authService.register()`
4. Axios sends POST to `/api/auth/register`
5. Backend validates, hashes password, creates user
6. Backend generates JWT token
7. Backend returns token + user data
8. Frontend stores token in localStorage
9. Frontend redirects to dashboard

---

#### Example 2: Loading Products

```typescript
// Component: Products.tsx
import { productService } from '../services';

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        category: selectedCategory,
        search: searchTerm,
        available: true
      });
      setProducts(response.products);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, [selectedCategory, searchTerm]);
```

**Flow:**
1. Component mounts or filters change
2. Calls `productService.getAll()` with query params
3. Axios sends GET to `/api/products?category=Grains&available=true`
4. Backend queries MongoDB with filters
5. Backend returns product array
6. Frontend updates state and renders products

---

#### Example 3: Submitting an Order

```typescript
// Component: CustomerDashboard.tsx
import { orderService } from '../services';

const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const orderData = {
      items: orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      deliveryAddress: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode
      },
      notes: notes
    };
    
    const response = await orderService.create(orderData);
    
    setSuccess('Order submitted successfully!');
    setOrderItems([]);
    fetchOrders(); // Refresh order list
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to submit order');
  }
};
```

**Flow:**
1. Customer fills order form
2. Selects products and quantities
3. Provides delivery address
4. Calls `orderService.create()`
5. Axios sends POST to `/api/orders` with JWT token
6. Backend validates token, extracts user ID
7. Backend validates products and minimum orders
8. Backend calculates totals
9. Backend creates order with status "pending"
10. Backend returns created order
11. Frontend shows success message
12. Frontend refreshes order list

---

#### Example 4: Admin Updates Order Status

```typescript
// Component: AdminOrders.tsx
import { orderService } from '../services';

const handleStatusUpdate = async (orderId: string, newStatus: string) => {
  try {
    await orderService.updateStatus(orderId, newStatus);
    setSuccess('Order status updated successfully');
    fetchOrders(); // Refresh order list
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to update order');
  }
};
```

**Flow:**
1. Admin selects order
2. Changes status dropdown
3. Calls `orderService.updateStatus()`
4. Axios sends PUT to `/api/orders/:id` with JWT token
5. Backend validates token, checks admin role
6. Backend updates order status
7. Backend returns updated order
8. Frontend refreshes order list

---

### Error Handling Pattern

Both frontend and backend follow consistent error handling:

**Backend Error Response:**
```json
{
  "success": false,
  "message": "Product not found",
  "statusCode": 404
}
```

**Frontend Error Handling:**
```typescript
try {
  const response = await productService.getById(productId);
  setProduct(response.product);
} catch (err: any) {
  // Extract error message from response
  const errorMessage = err.response?.data?.message || 'An error occurred';
  setError(errorMessage);
  
  // Optionally handle specific status codes
  if (err.response?.status === 404) {
    navigate('/products');
  }
}
```

### Authentication Flow

**Complete Login Flow:**

```
1. User enters credentials
   └─> Frontend: Login.tsx

2. Call authService.login()
   └─> Frontend: services/index.ts

3. Axios POST /api/auth/login
   └─> HTTP Request with email + password

4. Backend receives request
   └─> Express: authRoutes.ts → authController.ts

5. Validate credentials
   └─> Compare hashed password
   └─> If valid: Generate JWT token
   └─> If invalid: Return 401 error

6. Return response
   └─> { token, user }

7. Frontend stores data
   └─> localStorage.setItem('token', token)
   └─> localStorage.setItem('user', JSON.stringify(user))

8. Update AuthContext
   └─> setIsAuthenticated(true)
   └─> setUser(user)

9. Redirect to dashboard
   └─> navigate('/customer/dashboard')

10. Subsequent requests automatically include token
    └─> Axios interceptor adds: Authorization: Bearer <token>
```

**Token Validation on Protected Routes:**

```
1. User visits protected page
   └─> Frontend: ProtectedRoute.tsx

2. Check localStorage for token
   └─> const token = localStorage.getItem('token')

3. If no token: Redirect to login
   └─> navigate('/login')

4. If token exists: Verify with backend
   └─> authService.getMe()
   └─> GET /api/auth/me with token

5. Backend validates token
   └─> authenticate middleware
   └─> jwt.verify(token, secret)

6. If valid: Return user data
   └─> { user: { ... } }

7. If invalid: Return 401
   └─> Axios interceptor catches
   └─> Clear localStorage
   └─> Redirect to login

8. If valid: Allow access
   └─> Render protected component
```

### Security Layers

The backend implements multiple security layers:

```
Request
  ↓
1. Rate Limiting
   - General: 100 req/15min
   - Auth: 5 req/15min
  ↓
2. Helmet (Security Headers)
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
  ↓
3. CORS
   - Allowed origins only
   - Credentials support
  ↓
4. Body Parsing
   - JSON parsing
   - URL encoding
  ↓
5. Route Handler
   - JWT Authentication (if required)
   - Role Authorization (if required)
  ↓
6. Input Validation
   - express-validator
   - Schema validation
  ↓
7. Business Logic
   - Controllers
   - Models
  ↓
8. Database
   - MongoDB
  ↓
Response
```

## Database Models

### User Model

```typescript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: Enum ['customer', 'admin'] (default: 'customer'),
  phone: String (optional),
  businessName: String (optional),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- email (unique)
- role
```

### Product Model

```typescript
{
  name: String (required),
  description: String (required),
  category: String (required),
  price: Number (required, min: 0),
  unit: String (required),
  stockQuantity: Number (required, min: 0),
  minimumOrder: Number (required, min: 1),
  imageUrl: String (optional),
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- Text index on (name, description)
- category
- isAvailable
```

### Order Model

```typescript
{
  orderNumber: String (required, unique),
  customerId: ObjectId (ref: User, required),
  items: [{
    productId: ObjectId (ref: Product, required),
    productName: String (required),
    quantity: Number (required, min: 1),
    price: Number (required, min: 0),
    subtotal: Number (required, min: 0)
  }],
  totalAmount: Number (required, min: 0),
  status: Enum ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
  notes: String (optional),
  deliveryAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String (required)
  },
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date (optional)
}

Indexes:
- orderNumber (unique)
- customerId
- status
- createdAt (descending)
```

## API Summary Table

| Endpoint | Method | Access | Purpose |
|----------|--------|--------|---------|
| `/api/auth/register` | POST | Public | Register new user |
| `/api/auth/login` | POST | Public | User login |
| `/api/auth/me` | GET | Protected | Get current user |
| `/api/products` | GET | Public | List all products |
| `/api/products/:id` | GET | Public | Get single product |
| `/api/products` | POST | Admin | Create product |
| `/api/products/:id` | PUT | Admin | Update product |
| `/api/products/:id` | DELETE | Admin | Delete product |
| `/api/orders` | GET | Protected | List orders (filtered) |
| `/api/orders/:id` | GET | Protected | Get single order |
| `/api/orders` | POST | Protected | Create order |
| `/api/orders/:id` | PUT | Admin | Update order status |
| `/api/orders/:id` | DELETE | Protected | Cancel/delete order |
| `/api/users` | GET | Admin | List all users |
| `/api/users/:id` | GET | Protected | Get user profile |
| `/api/users/:id` | PUT | Protected | Update user |
| `/api/users/:id` | DELETE | Admin | Delete user |

**Total: 17 REST API Endpoints**

## Security Best Practices Implemented

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Never store plain text passwords
   - Never return password in API responses

2. **JWT Security**
   - Short expiration (24 hours)
   - Signed with secret key
   - Validated on every protected request

3. **Rate Limiting**
   - General: 100 requests per 15 minutes
   - Auth: 5 requests per 15 minutes
   - Prevents brute force attacks

4. **Input Validation**
   - All inputs validated before processing
   - express-validator for sanitization
   - Mongoose schema validation

5. **CORS Configuration**
   - Specific origins allowed
   - Credentials support enabled
   - No wildcard (*) in production

6. **HTTP Security Headers**
   - Helmet middleware
   - XSS protection
   - Clickjacking prevention
   - MIME type sniffing prevention

7. **Error Handling**
   - Generic error messages to clients
   - Detailed logging server-side
   - No stack traces in production

8. **Role-Based Access Control**
   - Admin vs Customer permissions
   - Middleware enforced
   - Resource-level authorization

## Deployment Considerations

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=24h

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Checklist

- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB connection string
- [ ] Set FRONTEND_URL for CORS
- [ ] Enable HTTPS
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Configure rate limiting appropriately
- [ ] Enable logging and monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure backup strategy
- [ ] Test all API endpoints

## Conclusion

The backend system provides a complete, secure, and scalable REST API for a wholesale business platform. Key features include:

✅ **17 RESTful Endpoints** covering all business requirements  
✅ **JWT Authentication** for secure, stateless sessions  
✅ **Role-Based Access Control** (admin vs customer)  
✅ **Input Validation** on all endpoints  
✅ **Rate Limiting** to prevent abuse  
✅ **Security Best Practices** (Helmet, CORS, bcrypt)  
✅ **Clear Communication Layer** between frontend and backend  
✅ **Comprehensive Error Handling** with consistent responses  
✅ **MongoDB Integration** with Mongoose ODM  
✅ **Production-Ready** with proper configuration

The frontend communicates seamlessly with the backend through the Axios service layer, providing automatic token management, error handling, and a clean API interface for all components.
