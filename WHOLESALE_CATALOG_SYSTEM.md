# Wholesale Product Catalog System

## Overview

The wholesale product catalog system is designed specifically for B2B bulk purchasing, featuring wholesale pricing, minimum order quantities, category filtering, and a request-order workflow instead of traditional retail checkout. This document explains the complete system architecture and customer interaction flow.

## System Architecture

### Product Catalog Features

#### 1. **Bulk Pricing Model**

Unlike retail e-commerce, our system uses a **wholesale pricing structure**:

```typescript
Product {
  price: number;        // Base wholesale price per unit
  unit: string;         // Bulk unit (e.g., "bag (25kg)", "carton (12 x 1L)")
  minimumOrder: number; // Minimum quantity required for wholesale
}
```

**Key Characteristics:**
- Prices are per **bulk unit**, not individual items
- Example: "$45.99 per bag (25kg)" instead of "$1.84 per kg"
- Volume-based pricing (can be extended with tier system)
- No per-item retail pricing

**Implementation:**
```typescript
// backend/src/models/Product.ts
price: {
  type: Number,
  required: true,
  min: [0, 'Price cannot be negative'],
}
unit: {
  type: String,
  required: true,  // e.g., "bag (25kg)", "carton", "case"
}
```

#### 2. **Minimum Order Quantity**

Every product has a **minimum order requirement** to qualify for wholesale:

```typescript
minimumOrder: {
  type: Number,
  required: true,
  min: [1, 'Minimum order must be at least 1'],
  default: 1,
}
```

**Enforcement:**
- **Frontend Display**: Shows minimum order on product cards
- **Backend Validation**: Validates order quantity during submission

```typescript
// backend/src/controllers/orderController.ts
if (item.quantity < product.minimumOrder) {
  res.status(400).json({
    message: `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}`,
  });
  return;
}
```

**Examples:**
- Premium Rice: Min. Order = 10 bags
- Olive Oil: Min. Order = 5 cartons
- Black Beans: Min. Order = 8 bags

#### 3. **Category Filtering**

Products are organized by categories for easy navigation:

```typescript
category: {
  type: String,
  required: true,
  trim: true,
}
```

**Available Categories:**
- Grains (Rice, Wheat Flour, Pasta)
- Oils (Olive Oil, Vegetable Oil)
- Legumes (Black Beans, Green Lentils)
- Canned Goods (Tomatoes)
- Sweeteners (Sugar)
- Seasonings (Sea Salt)

**Frontend Implementation:**
```typescript
// Dynamic category extraction
const categories = Array.from(new Set(products.map(p => p.category)));

// Filter logic
const filteredProducts = products.filter(product => {
  const matchesCategory = !selectedCategory || product.category === selectedCategory;
  return matchesCategory;
});
```

**Features:**
- Dynamic category list (automatically updates as products are added)
- "All Categories" option to view all products
- Real-time filtering without page reload

#### 4. **Search Functionality**

Full-text search across product names and descriptions:

**Backend Indexing:**
```typescript
// MongoDB text indexes for fast search
ProductSchema.index({ name: 'text', description: 'text' });
```

**Frontend Search:**
```typescript
const filteredProducts = products.filter(product => {
  const matchesSearch = 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesSearch;
});
```

**Search Features:**
- Case-insensitive search
- Searches both name and description
- Real-time results as you type
- Combines with category filter

#### 5. **Inventory Management**

Track stock availability:

```typescript
stockQuantity: {
  type: Number,
  required: true,
  min: [0, 'Stock quantity cannot be negative'],
  default: 0,
}
isAvailable: {
  type: Boolean,
  default: true,
}
```

**Display:**
- Green "Available" badge for in-stock items
- Red "Out of Stock" badge for unavailable items
- Admin can manage stock levels

## Request-Order Functionality (Not Retail Checkout)

### Key Differences from Retail

| Retail Checkout | Wholesale Order Request |
|----------------|------------------------|
| Instant payment | Order submission for approval |
| Shopping cart | Order request form |
| Checkout page | Customer dashboard |
| Immediate fulfillment | Admin approval workflow |
| Single item quantities | Bulk quantities only |
| Credit card required | Business account based |

### Order Workflow

```
Customer Views Product
        ↓
Checks Minimum Order
        ↓
Goes to Dashboard
        ↓
Fills Order Form
        ↓
Submits Order Request
        ↓
Status: PENDING
        ↓
Admin Reviews Order
        ↓
Admin Approves/Rejects
        ↓
Status: APPROVED/REJECTED
        ↓
Order Fulfilled
        ↓
Status: COMPLETED
```

### Order Request Process

#### Step 1: Customer Browses Catalog
```typescript
// frontend/src/pages/Products.tsx
// Displays all products with:
- Product image
- Category
- Name and description
- Bulk price per unit
- Minimum order quantity
- Availability status
```

#### Step 2: Customer Goes to Dashboard
```typescript
// No "Add to Cart" button on product pages
// Customer must login and go to dashboard to order
```

#### Step 3: Order Form Submission
```typescript
// frontend/src/pages/CustomerDashboard.tsx
const handleSubmitOrder = async (e: React.FormEvent) => {
  await orderService.create({
    items: orderItems,      // Multiple products with quantities
    deliveryAddress,        // Shipping address
    notes,                  // Special instructions (optional)
  });
};
```

**Form Fields:**
- **Products**: Select from available products dropdown
- **Quantity**: Must meet minimum order for each product
- **Delivery Address**: Complete shipping address
- **Notes**: Optional special instructions

#### Step 4: Backend Validation
```typescript
// backend/src/controllers/orderController.ts
// Validates:
1. At least one item in order
2. Product exists and is available
3. Quantity meets minimum order requirement
4. Calculates subtotal for each item
5. Calculates total order amount
6. Creates order with "pending" status
```

#### Step 5: Order Tracking
```typescript
// Order statuses:
- pending: Awaiting admin review
- approved: Admin approved, being processed
- rejected: Admin rejected the order
- completed: Order fulfilled and delivered
- cancelled: Customer or admin cancelled
```

## Customer Interaction Flow

### Complete Journey: From Viewing to Ordering

#### Phase 1: Discovery (Public Access)

**Step 1: Land on Homepage**
```
URL: /
Actions:
- View hero section with business overview
- See featured statistics (500+ products, 1000+ customers)
- Click "Browse Products" CTA
```

**Step 2: Browse Product Catalog**
```
URL: /products
Features Available:
✓ View all products in grid layout
✓ Search by name or description
✓ Filter by category (Grains, Oils, Legumes, etc.)
✓ See bulk pricing (e.g., $45.99 per bag)
✓ Check minimum order requirements
✓ View availability status

What Customer Sees Per Product:
┌─────────────────────────┐
│   [Product Image]       │
│                         │
│ Category: Grains        │
│ Premium Rice            │
│                         │
│ High-quality long       │
│ grain rice...           │
│                         │
│ $45.99                  │
│ per bag (25kg)          │
│                         │
│ Min. Order: 10 bags     │
│ [Available]             │
└─────────────────────────┘

NO "Add to Cart" or "Buy Now" buttons
(This is intentional - wholesale model)
```

**Step 3: View Pricing Information**
```
URL: /pricing
Features:
- Understand wholesale pricing tiers
- See volume discount structure
- View example calculations
- Learn about minimum orders
- CTA: "Register for Wholesale"
```

#### Phase 2: Registration (Account Creation)

**Step 4: Register Business Account**
```
URL: /register
Required Information:
- Full Name
- Email Address (becomes username)
- Phone Number
- Business Name (optional but recommended)
- Password (min 8 characters)

Process:
1. Fill registration form
2. Submit → Backend creates user with 'customer' role
3. JWT token generated and stored
4. Auto-login and redirect to dashboard
```

#### Phase 3: Order Submission (Authenticated)

**Step 5: Access Customer Dashboard**
```
URL: /customer/dashboard
Requires: Authentication
User sees:
- Order statistics (total, pending, completed)
- "New Order" button
- Order history table

Dashboard Stats:
┌─────────────────────────┐
│  Total Orders: 15       │
│  Pending Orders: 3      │
│  Completed Orders: 12   │
└─────────────────────────┘
```

**Step 6: Create Order Request**
```
Action: Click "New Order" button
Opens: Order submission form

Form Structure:
┌─────────────────────────────────────────┐
│ Order Items                             │
│ ┌─────────────────────────────────────┐ │
│ │ Product: [Select Product ▼]         │ │
│ │ Shows: Name - $Price per Unit       │ │
│ │        (Min: X units)               │ │
│ │ Quantity: [____]                    │ │
│ │ [Remove]                            │ │
│ └─────────────────────────────────────┘ │
│ [Add Item] ← Can add multiple products  │
│                                         │
│ Delivery Address                        │
│ Street: [________________]              │
│ City: [______] State: [__] Zip: [____]  │
│                                         │
│ Notes (Optional)                        │
│ [____________________________]          │
│                                         │
│ [Submit Order]                          │
└─────────────────────────────────────────┘
```

**Step 7: Product Selection Logic**
```typescript
// When customer selects a product:
1. Dropdown shows all available products
2. Format: "Product Name - $Price per Unit (Min: X)"
3. Example: "Premium Rice - $45.99 per bag (25kg) (Min: 10)"

// Quantity validation (frontend):
- Input type: number
- Minimum value: 1
- Customer can enter any quantity
  (Backend will validate against minimumOrder)
```

**Step 8: Order Submission**
```typescript
// What happens when customer clicks "Submit Order":

Frontend:
1. Validates at least one item added
2. Checks all required fields filled
3. Sends POST request to /api/orders

Backend Processing:
1. Receives order request
2. For each item:
   - Verifies product exists
   - Checks product availability
   - Validates quantity >= minimumOrder
   - Calculates: subtotal = price × quantity
3. Calculates total order amount
4. Creates order with status: "pending"
5. Generates unique order number (ORD-TIMESTAMP-COUNT)
6. Returns success response

Response:
{
  "success": true,
  "message": "Order submitted successfully",
  "order": {
    "orderNumber": "ORD-1704657600-001",
    "status": "pending",
    "totalAmount": 459.90,
    ...
  }
}
```

**Step 9: Order Confirmation**
```
Customer sees:
✓ Success message: "Order submitted successfully!"
✓ Form closes automatically
✓ Order appears in "My Orders" table
✓ Status badge: "Pending" (yellow)

Order Table Display:
┌────────────────────────────────────────────────┐
│ Order # │ Date  │ Items │ Amount  │ Status   │
│ ORD-001 │ Jan 7 │ 3     │ $459.90 │ Pending  │
└────────────────────────────────────────────────┘
```

#### Phase 4: Order Management

**Step 10: Track Order Status**
```
Customer can:
✓ View all submitted orders
✓ See current status (pending/approved/completed)
✓ Cancel pending orders (only)
✓ View order details

Status Flow:
pending → approved → completed
   ↓
rejected/cancelled
```

**Step 11: Cancel Order (If Needed)**
```typescript
// Only available for "pending" orders
if (order.status === 'pending') {
  [Cancel] button appears
  
  Click → Confirmation dialog
  Confirm → Order status changes to "cancelled"
}
```

## Admin Workflow

### Product Management

**Admin Can:**
1. **Add Products**
   - Set bulk price
   - Define unit (bag, carton, case)
   - Set minimum order quantity
   - Assign category
   - Upload image URL
   - Set stock quantity

2. **Edit Products**
   - Update pricing
   - Change minimum order
   - Adjust stock levels
   - Modify availability

3. **Delete Products**
   - Remove from catalog
   - With confirmation

### Order Management

**Admin Reviews Orders:**

```
Admin Dashboard → View Orders
Filter by status: All/Pending/Approved/Completed

For each order, admin sees:
- Order number
- Customer name and business
- Order date
- Number of items
- Total amount
- Current status

Admin actions:
1. Review order details
2. Update status dropdown:
   - pending → approved (accept order)
   - pending → rejected (decline order)
   - approved → completed (mark as fulfilled)
```

**Order Processing:**
```typescript
// backend/src/controllers/orderController.ts
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  
  // Admin-only endpoint
  // Updates order status
  // If status = 'completed', sets completedAt timestamp
  
  return updatedOrder;
};
```

## Technical Implementation Details

### Database Schema

#### Product Schema
```typescript
{
  name: String (required),
  description: String (required),
  category: String (required),
  price: Number (required, min: 0),
  unit: String (required),           // "bag (25kg)", "carton (12x1L)"
  stockQuantity: Number (required, min: 0),
  minimumOrder: Number (required, min: 1),
  imageUrl: String (optional),
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- Text index on name, description (for search)
- Index on category (for filtering)
- Index on isAvailable (for availability queries)
```

#### Order Schema
```typescript
{
  orderNumber: String (unique, auto-generated),
  customerId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    productName: String,
    quantity: Number (min: 1),
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
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
- Index on customerId (for customer's orders)
- Index on status (for filtering)
- Index on createdAt (for sorting)
```

### API Endpoints

#### Product Endpoints
```
GET    /api/products           - List all products (public)
GET    /api/products/:id       - Get single product (public)
POST   /api/products           - Create product (admin only)
PUT    /api/products/:id       - Update product (admin only)
DELETE /api/products/:id       - Delete product (admin only)

Query Parameters:
- category: Filter by category
- search: Full-text search
- available: Filter by availability (true/false)
```

#### Order Endpoints
```
GET    /api/orders             - List orders (filtered by role)
                                 Admin: all orders
                                 Customer: own orders only
GET    /api/orders/:id         - Get single order
POST   /api/orders             - Create order (authenticated)
PUT    /api/orders/:id         - Update order status (admin only)
DELETE /api/orders/:id          - Cancel/delete order
                                 Customer: cancel pending orders
                                 Admin: delete any order
```

### Frontend Components

#### Product Display Component
```typescript
// frontend/src/pages/Products.tsx
Features:
- Product grid (responsive, auto-fit columns)
- Search input (real-time filtering)
- Category dropdown (dynamic categories)
- Product cards showing:
  * Image
  * Category
  * Name & description
  * Price per unit
  * Minimum order
  * Availability badge
```

#### Order Form Component
```typescript
// frontend/src/pages/CustomerDashboard.tsx
Features:
- Dynamic item list (add/remove items)
- Product dropdown (shows available products)
- Quantity input (per item)
- Address fields (street, city, state, zip)
- Notes textarea (optional)
- Validation before submission
- Success/error messages
```

## Business Logic

### Minimum Order Validation

**Why It Matters:**
Ensures orders meet wholesale requirements, preventing small orders that aren't profitable.

**Implementation:**
```typescript
// Backend validation (critical)
if (item.quantity < product.minimumOrder) {
  throw new Error(
    `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}`
  );
}

// Frontend display (informative)
<div>Min. Order: {product.minimumOrder} {product.unit}</div>
```

### Price Calculation

**Per-Item Calculation:**
```typescript
const subtotal = product.price * item.quantity;

Example:
Product: Premium Rice
Price: $45.99 per bag
Quantity: 10 bags
Subtotal: $45.99 × 10 = $459.90
```

**Total Order:**
```typescript
let totalAmount = 0;
for (const item of orderItems) {
  totalAmount += item.subtotal;
}

Example:
Item 1: Premium Rice → $459.90
Item 2: Olive Oil → $625.00
Total Order Amount: $1,084.90
```

### Inventory Tracking

**Current Implementation:**
- Admin sets stock quantity
- System checks availability before order
- No automatic deduction (manual process)

**Future Enhancement (Optional):**
```typescript
// Could add automatic inventory deduction
if (product.stockQuantity < item.quantity) {
  throw new Error('Insufficient stock');
}
product.stockQuantity -= item.quantity;
await product.save();
```

## User Experience Flow Summary

### Customer Journey Map

```
AWARENESS → CONSIDERATION → DECISION → ACTION → RETENTION

1. AWARENESS
   - Lands on homepage
   - Sees value proposition
   - Browses product catalog

2. CONSIDERATION
   - Searches for specific products
   - Filters by category
   - Checks pricing and minimums
   - Reviews pricing tiers

3. DECISION
   - Decides to order
   - Registers business account
   - Logs in to dashboard

4. ACTION
   - Selects products
   - Enters quantities (meeting minimums)
   - Provides delivery address
   - Submits order request

5. RETENTION
   - Tracks order status
   - Receives admin approval
   - Order fulfilled
   - Becomes repeat customer
```

### Key Success Factors

1. **Clear Wholesale Focus**
   - Bulk pricing clearly displayed
   - Minimum orders visible
   - No retail-style "Add to Cart"

2. **Transparent Process**
   - Customer understands it's a request, not instant purchase
   - Status tracking keeps customer informed
   - Admin approval workflow is clear

3. **Easy Ordering**
   - Simple form interface
   - Multi-product orders supported
   - Address auto-filled from profile

4. **Business-Appropriate**
   - Business name capture
   - Volume-based pricing
   - Request-approval model fits B2B

## Conclusion

The wholesale product catalog system is designed specifically for B2B bulk purchasing with:

✅ **Bulk Pricing**: Per-unit wholesale prices (bags, cartons, cases)
✅ **Minimum Orders**: Enforced minimums for each product
✅ **Category Filtering**: Easy navigation by product type
✅ **Search Functionality**: Find products quickly
✅ **Request-Order Model**: Not retail checkout - orders require approval
✅ **Order Tracking**: Full status workflow (pending → approved → completed)
✅ **Admin Controls**: Full product and order management
✅ **Business Focus**: Designed for B2B relationships, not retail

The system successfully replaces traditional retail checkout with a wholesale order request workflow appropriate for bulk purchasing relationships.
