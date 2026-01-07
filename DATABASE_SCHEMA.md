# Database Schema Documentation - Wholesale Business Website

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Collections Structure](#collections-structure)
4. [Detailed Schema Definitions](#detailed-schema-definitions)
5. [Relationships & References](#relationships--references)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Indexes & Performance](#indexes--performance)
8. [Data Validation](#data-validation)
9. [Sample Data](#sample-data)
10. [Scalability Considerations](#scalability-considerations)

---

## Overview

This wholesale business website uses **MongoDB** as its NoSQL database, providing flexibility and scalability for e-commerce operations. The database is designed to support:

- User authentication and authorization (customers and admins)
- Product catalog management with categories
- Bulk order processing with approval workflow
- Inventory tracking
- Business analytics

### Database Design Principles

1. **Document-Oriented Design**: Leverage MongoDB's document model for flexible schema
2. **Embedded Documents**: Use for tightly coupled data (order items, addresses)
3. **References**: Use for loosely coupled data (orders → users, orders → products)
4. **Indexing**: Strategic indexes for query performance
5. **Validation**: Schema-level validation for data integrity
6. **Scalability**: Designed for horizontal scaling and sharding

---

## Technology Stack

- **Database**: MongoDB 5.0+
- **ODM**: Mongoose 7.0+
- **Language**: TypeScript
- **Validation**: Mongoose schema validators + custom validators
- **Authentication**: JWT tokens (not stored in database)

---

## Collections Structure

The database consists of **3 main collections**:

### Collections Overview

| Collection | Purpose | Document Count (typical) | Relationships |
|------------|---------|---------------------------|---------------|
| `users` | Store customer and admin accounts | 100 - 10,000+ | Referenced by orders |
| `products` | Store product catalog and inventory | 50 - 5,000+ | Referenced by orders |
| `orders` | Store bulk order requests | 500 - 100,000+ | References users and products |

**Note**: In MongoDB, there's no separate "admins" collection. Admins are users with `role: 'admin'`.

---

## Detailed Schema Definitions

### 1. Users Collection

Stores both customer and admin accounts with role-based differentiation.

#### Schema Structure

```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  name: String,                     // User's full name
  email: String,                    // Unique email (login identifier)
  password: String,                 // Bcrypt hashed password
  phone?: String,                   // Optional phone number
  businessName?: String,            // Business name (for customers)
  address?: {                       // Embedded address document
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: String,                     // 'customer' | 'admin'
  isActive: Boolean,                // Account status
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-generated timestamp
}
```

#### Field Specifications

| Field | Type | Required | Default | Validation | Index |
|-------|------|----------|---------|------------|-------|
| `_id` | ObjectId | Yes (auto) | Auto | - | Primary |
| `name` | String | Yes | - | Trimmed, non-empty | No |
| `email` | String | Yes | - | Unique, valid email format, lowercase | Unique |
| `password` | String | Yes | - | Min 8 chars, bcrypt hashed | No |
| `phone` | String | No | - | Trimmed | No |
| `businessName` | String | No | - | Trimmed | No |
| `address` | Object | No | - | Embedded document | No |
| `role` | String | Yes | 'customer' | Enum: customer, admin | Yes |
| `isActive` | Boolean | Yes | true | Boolean | Yes |
| `createdAt` | Date | Yes (auto) | Now | ISO Date | Yes |
| `updatedAt` | Date | Yes (auto) | Now | ISO Date | No |

#### Business Rules

1. **Email Uniqueness**: Each email can only be registered once
2. **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds before storage
3. **Role Assignment**: 
   - Default role is 'customer'
   - Admin role must be assigned manually or through seed script
4. **Address Optional**: Customers can complete profile later
5. **Soft Delete**: Use `isActive: false` instead of physical deletion

#### Mongoose Schema Implementation

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  role: 'customer' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password in queries by default
    },
    phone: {
      type: String,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook: Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method: Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
```

---

### 2. Products Collection

Stores the product catalog with pricing, inventory, and wholesale-specific fields.

#### Schema Structure

```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  name: String,                     // Product name
  description: String,              // Product description
  category: String,                 // Product category (not normalized)
  price: Number,                    // Wholesale price per unit
  unit: String,                     // Unit of measurement
  stockQuantity: Number,            // Current inventory level
  minimumOrder: Number,             // Minimum order quantity
  imageUrl?: String,                // Optional product image URL
  isAvailable: Boolean,             // Product availability status
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-generated timestamp
}
```

#### Field Specifications

| Field | Type | Required | Default | Validation | Index |
|-------|------|----------|---------|------------|-------|
| `_id` | ObjectId | Yes (auto) | Auto | - | Primary |
| `name` | String | Yes | - | Trimmed, non-empty | Text |
| `description` | String | Yes | - | Trimmed, non-empty | Text |
| `category` | String | Yes | - | Trimmed | Yes |
| `price` | Number | Yes | - | >= 0 | No |
| `unit` | String | Yes | - | Trimmed (e.g., "bag", "carton") | No |
| `stockQuantity` | Number | Yes | 0 | >= 0 | No |
| `minimumOrder` | Number | Yes | 1 | >= 1 | No |
| `imageUrl` | String | No | - | Trimmed URL | No |
| `isAvailable` | Boolean | Yes | true | Boolean | Yes |
| `createdAt` | Date | Yes (auto) | Now | ISO Date | No |
| `updatedAt` | Date | Yes (auto) | Now | ISO Date | No |

#### Categories

Currently supported categories (not enforced at schema level for flexibility):

1. Grains (e.g., Rice, Wheat Flour)
2. Oils (e.g., Olive Oil, Vegetable Oil)
3. Legumes (e.g., Lentils, Chickpeas)
4. Canned Goods (e.g., Tomato Paste, Canned Beans)
5. Sweeteners (e.g., Sugar, Honey)
6. Seasonings (e.g., Salt, Black Pepper)

**Design Decision**: Categories are stored as strings (not references) for flexibility. If categories grow complex, consider creating a separate `categories` collection.

#### Business Rules

1. **Wholesale Pricing**: Price is per unit (e.g., per bag, per carton), not per item
2. **Minimum Order**: Enforces bulk purchasing (e.g., minimum 10 bags of rice)
3. **Inventory Tracking**: `stockQuantity` decrements when orders are completed
4. **Availability**: Products can be marked unavailable without deletion
5. **Search Optimization**: Text indexes on name and description for full-text search

#### Mongoose Schema Implementation

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stockQuantity: number;
  minimumOrder: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Product unit is required'],
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    minimumOrder: {
      type: Number,
      required: [true, 'Minimum order is required'],
      min: [1, 'Minimum order must be at least 1'],
      default: 1,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' }); // Full-text search
ProductSchema.index({ category: 1 });                        // Category filtering
ProductSchema.index({ isAvailable: 1 });                     // Availability filtering

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
```

---

### 3. Orders Collection

Stores bulk order requests with approval workflow and embedded order items.

#### Schema Structure

```typescript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  orderNumber: String,              // Unique order identifier
  customerId: ObjectId,             // Reference to User collection
  items: [                          // Embedded array of order items
    {
      productId: ObjectId,          // Reference to Product collection
      productName: String,          // Denormalized product name
      quantity: Number,             // Quantity ordered
      price: Number,                // Price at time of order
      subtotal: Number              // quantity * price
    }
  ],
  totalAmount: Number,              // Sum of all subtotals
  status: String,                   // Order status
  notes?: String,                   // Optional customer notes
  deliveryAddress: {                // Embedded delivery address
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  completedAt?: Date,               // When order was completed
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-generated timestamp
}
```

#### Field Specifications

| Field | Type | Required | Default | Validation | Index |
|-------|------|----------|---------|------------|-------|
| `_id` | ObjectId | Yes (auto) | Auto | - | Primary |
| `orderNumber` | String | Yes (auto) | Generated | Unique, format: ORD-{timestamp}-{count} | Unique |
| `customerId` | ObjectId | Yes | - | Valid User ObjectId | Yes |
| `items` | Array | Yes | - | Min 1 item, embedded documents | No |
| `items[].productId` | ObjectId | Yes | - | Valid Product ObjectId | No |
| `items[].productName` | String | Yes | - | Non-empty (denormalized) | No |
| `items[].quantity` | Number | Yes | - | >= 1 | No |
| `items[].price` | Number | Yes | - | >= 0 | No |
| `items[].subtotal` | Number | Yes | - | >= 0 | No |
| `totalAmount` | Number | Yes | - | >= 0 | No |
| `status` | String | Yes | 'pending' | Enum: pending, approved, rejected, completed, cancelled | Yes |
| `notes` | String | No | - | Trimmed | No |
| `deliveryAddress` | Object | Yes | - | Embedded document | No |
| `completedAt` | Date | No | - | ISO Date | No |
| `createdAt` | Date | Yes (auto) | Now | ISO Date | Yes (desc) |
| `updatedAt` | Date | Yes (auto) | Now | ISO Date | No |

#### Order Status Workflow

```
pending → approved → completed
   ↓         ↓
rejected  cancelled
```

- **pending**: Order submitted by customer, awaiting admin review
- **approved**: Admin approved order, ready for processing
- **rejected**: Admin rejected order (insufficient stock, invalid request, etc.)
- **completed**: Order fulfilled and delivered
- **cancelled**: Customer or admin cancelled order

#### Business Rules

1. **Order Number Generation**: Auto-generated format `ORD-{timestamp}-{count}`
2. **Embedded Items**: Order items are embedded (not referenced) for immutability
3. **Price Snapshot**: Product price is captured at order time (denormalized)
4. **Minimum Quantity**: Backend validates against product's `minimumOrder`
5. **Inventory Deduction**: Stock decreases when order status changes to 'completed'
6. **Total Calculation**: `totalAmount = sum(items[].subtotal)`

#### Mongoose Schema Implementation

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  notes?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false } // Don't create _id for subdocuments
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Generate order number
OrderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Create indexes for better query performance
OrderSchema.index({ customerId: 1 });      // Find orders by customer
OrderSchema.index({ status: 1 });          // Filter by status
OrderSchema.index({ createdAt: -1 });      // Sort by date (most recent first)

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
```

---

## Relationships & References

MongoDB uses **references** (ObjectId) to establish relationships between collections, similar to foreign keys in SQL.

### Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
│  _id (PK)       │◄─────────────┐
│  email (UK)     │              │
│  role           │              │
│  ...            │              │
└─────────────────┘              │
                                 │ customerId (FK)
                                 │
                          ┌──────┴──────────┐
                          │     ORDERS      │
                          │  _id (PK)       │
                          │  orderNumber(UK)│
                          │  customerId     │───┐
                          │  items[]        │   │
                          │  status         │   │
                          │  ...            │   │
                          └─────────────────┘   │
                                 │              │
                                 │ items[].productId (FK)
                                 │              │
                          ┌──────▼──────────┐   │
                          │    PRODUCTS     │◄──┘
                          │  _id (PK)       │
                          │  name           │
                          │  category       │
                          │  ...            │
                          └─────────────────┘
```

### Relationship Types

#### 1. Users → Orders (One-to-Many)

- **Type**: One user can have many orders
- **Implementation**: `Order.customerId` references `User._id`
- **Cardinality**: 1:N
- **Query Pattern**: Find all orders for a user

```javascript
// Find all orders for a customer
const orders = await Order.find({ customerId: userId });

// With population (join)
const orders = await Order.find({ customerId: userId })
  .populate('customerId', 'name email businessName');
```

#### 2. Products → Orders (Many-to-Many)

- **Type**: One product can be in many orders, one order can have many products
- **Implementation**: Embedded `items` array with `productId` references
- **Cardinality**: M:N
- **Query Pattern**: Find all orders containing a product

```javascript
// Find all orders containing a specific product
const orders = await Order.find({ 'items.productId': productId });

// With population
const order = await Order.findById(orderId)
  .populate('items.productId', 'name category price');
```

### Reference vs Embedding Strategy

| Data Type | Strategy | Reason |
|-----------|----------|--------|
| User → Order | Reference | Loose coupling, users updated independently |
| Product → Order | Reference + Denormalization | Need current product info + historical snapshot |
| Order Items | Embedding | Tightly coupled, immutable after creation |
| Addresses | Embedding | Specific to user/order, no sharing |

---

## Data Flow Diagrams

### 1. Customer Registration Flow

```
┌─────────┐
│ Frontend│
│ (React) │
└────┬────┘
     │ POST /api/auth/register
     │ { name, email, password, businessName, address }
     ▼
┌─────────────────┐
│  Auth Controller│
│  - Validate     │
│  - Check email  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  User Model     │
│  Pre-save hook: │
│  - Hash password│
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  MongoDB        │
│  Insert into    │
│  users          │
│  collection     │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  JWT Token      │
│  Generated      │
│  Returned       │
└─────────────────┘
```

### 2. Product Catalog Flow

```
┌─────────┐
│ Frontend│
│ (React) │
└────┬────┘
     │ GET /api/products?category=Grains&search=rice
     ▼
┌─────────────────┐
│Product Controller│
│  - Parse query  │
│  - Build filter │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  MongoDB        │
│  Query with:    │
│  - Text index   │
│  - Category idx │
│  - isAvailable  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Product List   │
│  - Array of docs│
│  - Sorted       │
│  - Filtered     │
└─────────────────┘
```

### 3. Order Submission Flow

```
┌─────────┐
│Customer │
│Dashboard│
└────┬────┘
     │ POST /api/orders
     │ { items: [{productId, quantity}], deliveryAddress, notes }
     ▼
┌─────────────────┐
│Order Controller │
│  1. Verify JWT  │
│  2. Validate    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Fetch Products │
│  - Get prices   │
│  - Check stock  │
│  - Verify mins  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Calculate      │
│  - Subtotals    │
│  - Total amount │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  MongoDB        │
│  Insert order   │
│  status:pending │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Order Number   │
│  Auto-generated │
│  ORD-xxx-xxx    │
└─────────────────┘
```

### 4. Admin Order Approval Flow

```
┌─────────┐
│ Admin   │
│Dashboard│
└────┬────┘
     │ PUT /api/orders/:id
     │ { status: 'approved' }
     ▼
┌─────────────────┐
│Order Controller │
│  1. Verify admin│
│  2. Validate    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Update Order   │
│  status=approved│
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  If 'completed' │
│  Deduct stock   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  MongoDB        │
│  Update order   │
│  Update products│
└─────────────────┘
```

### 5. Complete Data Flow (End-to-End)

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│                                                             │
│  Public Pages        Customer Dashboard      Admin Dashboard│
│  - Home             - View Orders           - Manage Products│
│  - Products         - Submit Orders         - Approve Orders│
│  - Pricing          - Track Status          - View Customers│
│  - Register/Login                                           │
└───────┬───────────────────┬───────────────────┬────────────┘
        │                   │                   │
        │ REST API Calls    │                   │
        ▼                   ▼                   ▼
┌────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
│                                                             │
│  Auth Routes      Product Routes      Order Routes         │
│  - /auth/register - /products GET     - /orders POST       │
│  - /auth/login    - /products POST    - /orders GET        │
│                   - /products/:id     - /orders/:id PUT    │
│                                                             │
│  Middleware: JWT Auth, Admin Auth, Rate Limiting           │
└───────┬───────────────────┬───────────────────┬────────────┘
        │                   │                   │
        │ Mongoose ODM      │                   │
        ▼                   ▼                   ▼
┌────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
│                                                             │
│  ┌───────────┐      ┌────────────┐      ┌──────────┐     │
│  │   users   │      │  products  │      │  orders  │     │
│  │           │      │            │      │          │     │
│  │ _id       │◄─────│            │◄─────│ items[]  │     │
│  │ email     │      │ _id        │      │          │     │
│  │ password  │      │ name       │      │ customerId│     │
│  │ role      │      │ category   │      │ status   │     │
│  │ ...       │      │ price      │      │ ...      │     │
│  └───────────┘      │ stock      │      └──────────┘     │
│                     │ ...        │                        │
│                     └────────────┘                        │
└────────────────────────────────────────────────────────────┘
```

---

## Indexes & Performance

Indexes are crucial for query performance in MongoDB. Strategic indexing can dramatically improve response times.

### Index Strategy

| Collection | Index Type | Fields | Purpose |
|------------|-----------|--------|---------|
| users | Unique | email | Login lookup, prevent duplicates |
| users | Single | role | Filter admins/customers |
| users | Single | isActive | Filter active accounts |
| users | Single | createdAt | Sort by registration date |
| products | Text | name, description | Full-text search |
| products | Single | category | Category filtering |
| products | Single | isAvailable | Filter available products |
| orders | Single | customerId | Find customer's orders |
| orders | Single | status | Filter by order status |
| orders | Single (desc) | createdAt | Sort by date (newest first) |
| orders | Unique | orderNumber | Lookup by order number |

### Index Implementation

#### Users Collection

```javascript
// Automatically created by Mongoose
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ createdAt: 1 });
```

#### Products Collection

```javascript
// Text index for search
db.products.createIndex(
  { name: "text", description: "text" },
  { weights: { name: 2, description: 1 } } // Name is more important
);

// Single field indexes
db.products.createIndex({ category: 1 });
db.products.createIndex({ isAvailable: 1 });
```

#### Orders Collection

```javascript
// Single field indexes
db.orders.createIndex({ customerId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 }); // Descending
db.orders.createIndex({ orderNumber: 1 }, { unique: true });

// Compound index for common query pattern
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 });
```

### Query Performance Examples

#### 1. Find Customer's Pending Orders

```javascript
// Without index: Full collection scan O(n)
// With indexes: Index scan O(log n)
db.orders.find({
  customerId: ObjectId("..."),
  status: "pending"
}).sort({ createdAt: -1 });

// Uses compound index: { customerId: 1, status: 1, createdAt: -1 }
```

#### 2. Search Products

```javascript
// Text search with category filter
db.products.find({
  $text: { $search: "rice" },
  category: "Grains",
  isAvailable: true
});

// Uses:
// 1. Text index on name+description
// 2. Single index on category
// 3. Single index on isAvailable
```

#### 3. Admin Dashboard Stats

```javascript
// Count orders by status (uses status index)
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Count users by role (uses role index)
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);
```

### Performance Metrics

| Query Type | Expected Time | Index Used |
|------------|---------------|------------|
| Find user by email | <5ms | Unique index |
| Search products | <50ms | Text index |
| List customer orders | <20ms | Compound index |
| Filter by category | <30ms | Single index |
| Admin order list | <100ms | Status + createdAt |

---

## Data Validation

MongoDB and Mongoose provide multiple layers of validation to ensure data integrity.

### Validation Layers

1. **Schema-level validation** (Mongoose)
2. **Pre-save hooks** (Mongoose middleware)
3. **Custom validators** (Business logic)
4. **MongoDB validators** (Server-side)

### Validation Rules by Collection

#### Users Collection

```typescript
// Email validation
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
}

// Password validation
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [8, 'Password must be at least 8 characters'],
  select: false,
}

// Role validation
role: {
  type: String,
  enum: {
    values: ['customer', 'admin'],
    message: 'Role must be either customer or admin'
  },
  default: 'customer',
}
```

#### Products Collection

```typescript
// Price validation
price: {
  type: Number,
  required: [true, 'Product price is required'],
  min: [0, 'Price cannot be negative'],
  validate: {
    validator: function(value) {
      return value >= 0 && Number.isFinite(value);
    },
    message: 'Price must be a valid positive number'
  }
}

// Stock validation
stockQuantity: {
  type: Number,
  required: [true, 'Stock quantity is required'],
  min: [0, 'Stock quantity cannot be negative'],
  validate: {
    validator: Number.isInteger,
    message: 'Stock quantity must be an integer'
  }
}

// Minimum order validation
minimumOrder: {
  type: Number,
  required: [true, 'Minimum order is required'],
  min: [1, 'Minimum order must be at least 1'],
  validate: {
    validator: Number.isInteger,
    message: 'Minimum order must be an integer'
  }
}
```

#### Orders Collection

```typescript
// Items array validation
items: {
  type: [OrderItemSchema],
  required: true,
  validate: {
    validator: (items: IOrderItem[]) => items.length > 0,
    message: 'Order must have at least one item'
  }
}

// Status validation
status: {
  type: String,
  enum: {
    values: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    message: 'Invalid order status'
  },
  default: 'pending'
}

// Total amount validation
totalAmount: {
  type: Number,
  required: [true, 'Total amount is required'],
  min: [0, 'Total amount cannot be negative'],
}
```

### Business Logic Validation

Some validations happen in controllers (application layer):

```typescript
// Example: Order submission validation
async createOrder(req, res) {
  // 1. Validate minimum order quantities
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (item.quantity < product.minimumOrder) {
      return res.status(400).json({
        error: `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}s`
      });
    }
  }

  // 2. Validate stock availability
  if (item.quantity > product.stockQuantity) {
    return res.status(400).json({
      error: `Insufficient stock for ${product.name}`
    });
  }

  // 3. Create order...
}
```

---

## Sample Data

### Sample User Documents

```json
// Admin User
{
  "_id": ObjectId("65a1b2c3d4e5f6789a0b1c2d"),
  "name": "Admin User",
  "email": "admin@wholesale.com",
  "password": "$2a$10$...", // bcrypt hash
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}

// Customer User
{
  "_id": ObjectId("65a1b2c3d4e5f6789a0b1c2e"),
  "name": "John Smith",
  "email": "customer@example.com",
  "password": "$2a$10$...", // bcrypt hash
  "phone": "+1234567890",
  "businessName": "Smith's Restaurant Supply",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "role": "customer",
  "isActive": true,
  "createdAt": ISODate("2024-01-02T00:00:00Z"),
  "updatedAt": ISODate("2024-01-02T00:00:00Z")
}
```

### Sample Product Documents

```json
// Grain Product
{
  "_id": ObjectId("65a1b2c3d4e5f6789a0b1c3d"),
  "name": "Premium Basmati Rice",
  "description": "Long grain aromatic rice perfect for wholesale distribution",
  "category": "Grains",
  "price": 45.99,
  "unit": "bag",
  "stockQuantity": 500,
  "minimumOrder": 10,
  "imageUrl": "https://example.com/images/rice.jpg",
  "isAvailable": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}

// Oil Product
{
  "_id": ObjectId("65a1b2c3d4e5f6789a0b1c3e"),
  "name": "Extra Virgin Olive Oil",
  "description": "Cold-pressed olive oil in bulk cartons",
  "category": "Oils",
  "price": 89.99,
  "unit": "carton",
  "stockQuantity": 200,
  "minimumOrder": 5,
  "imageUrl": "https://example.com/images/olive-oil.jpg",
  "isAvailable": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

### Sample Order Document

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6789a0b1c4d"),
  "orderNumber": "ORD-1704067200000-1",
  "customerId": ObjectId("65a1b2c3d4e5f6789a0b1c2e"),
  "items": [
    {
      "productId": ObjectId("65a1b2c3d4e5f6789a0b1c3d"),
      "productName": "Premium Basmati Rice",
      "quantity": 20,
      "price": 45.99,
      "subtotal": 919.80
    },
    {
      "productId": ObjectId("65a1b2c3d4e5f6789a0b1c3e"),
      "productName": "Extra Virgin Olive Oil",
      "quantity": 10,
      "price": 89.99,
      "subtotal": 899.90
    }
  ],
  "totalAmount": 1819.70,
  "status": "pending",
  "notes": "Please deliver between 9 AM - 12 PM",
  "deliveryAddress": {
    "street": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  },
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## Scalability Considerations

### Current Architecture (Small to Medium Scale)

- **Collections**: 3 (users, products, orders)
- **Expected Load**: 1,000-10,000 users, 10,000-100,000 orders/year
- **Deployment**: Single MongoDB instance or replica set
- **Performance**: Adequate for most wholesale businesses

### Scaling Strategies

#### 1. Vertical Scaling (Short-term)

- Upgrade MongoDB server resources (CPU, RAM, SSD)
- Optimize queries and indexes
- Implement caching (Redis) for frequently accessed data

#### 2. Horizontal Scaling (Long-term)

**Sharding Strategy:**

```
Shard Key Selection:
- Users: shard by email hash or _id
- Products: shard by category or _id
- Orders: shard by customerId or date range
```

**Replica Sets:**

```
Primary-Secondary-Arbiter configuration
- Primary: Read/Write operations
- Secondary: Read-only (with eventual consistency)
- Arbiter: Voting member for elections
```

#### 3. Read/Write Optimization

```javascript
// Read from secondaries for non-critical queries
const orders = await Order.find({ status: 'completed' })
  .read('secondaryPreferred');

// Write to primary (default)
await Order.create(newOrder);
```

#### 4. Archiving Strategy

For very large order collections:

```javascript
// Archive old orders (>2 years) to separate collection
db.orders.aggregate([
  {
    $match: {
      createdAt: { $lt: ISODate("2022-01-01T00:00:00Z") }
    }
  },
  { $out: "orders_archive" }
]);

// Remove from main collection
db.orders.deleteMany({
  createdAt: { $lt: ISODate("2022-01-01T00:00:00Z") }
});
```

### Future Enhancements

#### 1. Separate Categories Collection

If categories grow complex:

```json
{
  "_id": ObjectId("..."),
  "name": "Grains",
  "slug": "grains",
  "description": "...",
  "parentCategory": null,
  "isActive": true
}
```

Then reference in products:

```javascript
{
  categoryId: ObjectId("..."), // Reference to categories collection
}
```

#### 2. Add Inventory Tracking Collection

For detailed inventory history:

```json
{
  "_id": ObjectId("..."),
  "productId": ObjectId("..."),
  "type": "addition" | "deduction",
  "quantity": 50,
  "reason": "Order completed",
  "orderId": ObjectId("..."),
  "timestamp": ISODate("...")
}
```

#### 3. Add Analytics Collection

Pre-aggregated data for dashboards:

```json
{
  "_id": ObjectId("..."),
  "date": ISODate("2024-01-15"),
  "totalOrders": 125,
  "totalRevenue": 45678.90,
  "topProducts": [...],
  "topCustomers": [...]
}
```

#### 4. Add Audit Log Collection

Track all administrative actions:

```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "action": "order_approved",
  "entityType": "Order",
  "entityId": ObjectId("..."),
  "changes": {...},
  "timestamp": ISODate("...")
}
```

---

## Database Operations Examples

### Common Queries

#### 1. User Operations

```javascript
// Find user by email
const user = await User.findOne({ email: 'customer@example.com' });

// Create new customer
const customer = await User.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'hashedPassword',
  role: 'customer'
});

// Update user profile
await User.findByIdAndUpdate(userId, {
  $set: {
    phone: '+1234567890',
    address: { street: '...', city: '...', state: '...', zipCode: '...' }
  }
}, { new: true });

// Count users by role
const customerCount = await User.countDocuments({ role: 'customer' });
const adminCount = await User.countDocuments({ role: 'admin' });
```

#### 2. Product Operations

```javascript
// Search products (full-text)
const products = await Product.find({
  $text: { $search: 'rice' },
  isAvailable: true
});

// Filter by category
const grains = await Product.find({
  category: 'Grains',
  isAvailable: true
});

// Update stock after order completion
await Product.findByIdAndUpdate(productId, {
  $inc: { stockQuantity: -quantity }
});

// Get low stock products
const lowStock = await Product.find({
  stockQuantity: { $lt: 50 },
  isAvailable: true
});
```

#### 3. Order Operations

```javascript
// Create new order
const order = await Order.create({
  customerId: userId,
  items: [
    {
      productId: '...',
      productName: 'Rice',
      quantity: 20,
      price: 45.99,
      subtotal: 919.80
    }
  ],
  totalAmount: 919.80,
  deliveryAddress: { ... },
  notes: 'Urgent delivery'
});

// Find customer's orders
const customerOrders = await Order.find({ customerId: userId })
  .sort({ createdAt: -1 })
  .populate('customerId', 'name email businessName');

// Update order status
await Order.findByIdAndUpdate(orderId, {
  $set: {
    status: 'approved',
    updatedAt: new Date()
  }
});

// Get orders by status
const pendingOrders = await Order.find({ status: 'pending' })
  .populate('customerId', 'name email')
  .sort({ createdAt: -1 });

// Calculate total revenue
const revenue = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: null, total: { $sum: '$totalAmount' } } }
]);
```

#### 4. Aggregation Queries

```javascript
// Top customers by order value
const topCustomers = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
      _id: '$customerId',
      totalSpent: { $sum: '$totalAmount' },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 },
  { $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'customer'
  }}
]);

// Orders by status count
const statusStats = await Order.aggregate([
  { $group: {
      _id: '$status',
      count: { $sum: 1 },
      totalValue: { $sum: '$totalAmount' }
  }},
  { $sort: { count: -1 } }
]);

// Popular products
const popularProducts = await Order.aggregate([
  { $unwind: '$items' },
  { $group: {
      _id: '$items.productId',
      totalQuantity: { $sum: '$items.quantity' },
      totalRevenue: { $sum: '$items.subtotal' },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalQuantity: -1 } },
  { $limit: 10 }
]);
```

---

## Summary

This database schema provides a **scalable, secure, and efficient** foundation for a wholesale business website:

### Key Features

✅ **3 Main Collections**: Users (with admin support), Products, Orders  
✅ **Role-Based Access**: Customer and admin roles in single users collection  
✅ **Embedded Documents**: Order items, addresses for performance  
✅ **References**: Loose coupling between users, products, and orders  
✅ **Comprehensive Indexes**: Text search, category filtering, status queries  
✅ **Data Validation**: Schema-level, pre-hooks, and business logic  
✅ **Security**: Password hashing, no sensitive data exposure  
✅ **Scalability**: Sharding-ready, archive strategies, caching support  

### Production Readiness

✅ **Automatic timestamps** (createdAt, updatedAt)  
✅ **Auto-generated order numbers**  
✅ **Price snapshots** (historical data integrity)  
✅ **Stock management** with validation  
✅ **Status workflow** enforcement  
✅ **Query optimization** with strategic indexes  

### Next Steps

For production deployment:

1. Set up MongoDB Atlas or replica set
2. Configure environment variables for connection string
3. Run seed script to populate initial data
4. Monitor index performance with `explain()` queries
5. Implement backup strategy (daily automated backups)
6. Set up monitoring and alerts (MongoDB Atlas or Grafana)
7. Plan for archiving old orders (>2 years)

---

**Database Schema Version**: 1.0  
**Last Updated**: January 2024  
**MongoDB Version**: 5.0+  
**Mongoose Version**: 7.0+
