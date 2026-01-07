# Customer Dashboard System

## Complete Customer Dashboard Documentation for Wholesale Buyers

This document provides comprehensive documentation for the customer dashboard system, explaining how wholesale buyers interact with the platform from viewing approved prices to tracking order history.

---

## Table of Contents

1. [Overview](#overview)
2. [Dashboard Features](#dashboard-features)
3. [View Approved Wholesale Prices](#view-approved-wholesale-prices)
4. [Submit Bulk Order Requests](#submit-bulk-order-requests)
5. [Track Order Status](#track-order-status)
6. [View Order History](#view-order-history)
7. [Full Customer Journey](#full-customer-journey)
8. [Technical Implementation](#technical-implementation)
9. [UI/UX Design](#uiux-design)
10. [API Integration](#api-integration)
11. [Security & Access Control](#security--access-control)
12. [Best Practices](#best-practices)

---

## Overview

The Customer Dashboard is the central hub for wholesale buyers to manage their business operations on the platform. It provides a comprehensive interface for viewing products, submitting bulk orders, tracking order status, and managing order history.

### Key Characteristics

- **Role-Based Access**: Only accessible to authenticated customers
- **Real-Time Data**: Live updates on product availability and order status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **User-Friendly**: Intuitive interface designed for business users
- **Comprehensive**: All customer operations in one place

### Dashboard URL

```
/customer/dashboard
```

**Access Level**: Protected route - requires customer authentication

---

## Dashboard Features

### 1. View Approved Wholesale Prices

**Description**: Customers can browse and view all approved wholesale prices for available products directly from the dashboard.

**Implementation**:

The dashboard integrates with the product catalog to display current wholesale pricing:

```typescript
// Fetch products with wholesale pricing
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  const fetchProducts = async () => {
    const response = await productService.getAll({ available: true });
    setProducts(response.products);
  };
  fetchProducts();
}, []);
```

**Displayed Information**:

- **Product Name**: Full product name (e.g., "Premium Basmati Rice")
- **Wholesale Price**: Price per unit (e.g., "$45.99 per bag")
- **Unit of Measure**: Bulk unit (e.g., "25kg bag", "5L carton")
- **Minimum Order Quantity**: Required minimum (e.g., "Min: 10 bags")
- **Category**: Product category (Grains, Oils, etc.)
- **Availability Status**: In stock or out of stock
- **Product Description**: Detailed product information

**Example Display**:

```
Premium Basmati Rice
$45.99 per bag (25kg)
Min. Order: 10 bags
Category: Grains
Status: Available
Description: High-quality long-grain basmati rice...
```

**Where Prices Are Displayed**:

1. **Products Catalog Page** (`/products`)
   - Public page showing all products
   - Real-time availability
   - Search and filter functionality

2. **Dashboard Order Form** (within Customer Dashboard)
   - Product dropdown with inline pricing
   - Shows price and minimum order in selection
   - Format: `"Product Name - $price per unit (Min: X)"`

3. **Wholesale Pricing Page** (`/pricing`)
   - General pricing tier information
   - Volume discount structure
   - Example calculations

**Key Features**:

✅ **Real-Time Pricing**: Always shows current approved prices
✅ **Transparency**: No hidden costs or surprise fees
✅ **Bulk-Focused**: Prices reflect wholesale quantities
✅ **Clear Minimums**: Minimum order requirements clearly displayed
✅ **Availability Status**: Real-time stock information

---

### 2. Submit Bulk Order Requests

**Description**: Customers can create and submit bulk order requests with multiple products directly from the dashboard.

**Order Submission Flow**:

```
Dashboard → Click "New Order" → Add Products → Enter Quantities → 
Provide Delivery Address → Add Notes (Optional) → Submit Order
```

**Order Form Components**:

#### A. Order Items Section

Customers can add multiple products to a single order:

```typescript
// Order item structure
interface OrderItem {
  productId: string;
  quantity: number;
}

// Add item to order
const handleAddItem = () => {
  setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
};
```

**Features**:
- Dynamic item addition (unlimited products per order)
- Product selection from dropdown (shows available products only)
- Inline pricing display (price + unit + minimum order)
- Quantity input with validation
- Remove item button for each line

**Example Order Form**:

```
Order Items:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Product: Premium Basmati Rice - $45.99 per bag (Min: 10)] [Qty: 50] [Remove]
[Product: Olive Oil - $89.99 per carton (Min: 5)]          [Qty: 20] [Remove]
[+ Add Item]
```

#### B. Delivery Address Section

Pre-filled with user's saved address, editable for each order:

```typescript
// Delivery address fields
interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
```

**Fields**:
- Street Address (required)
- City (required)
- State (required)
- Zip Code (required)

**Default Behavior**:
- Auto-populates from user profile
- Can be modified for specific delivery
- Validation before submission

#### C. Additional Information

**Optional Notes Field**:
- Delivery instructions
- Special handling requirements
- Preferred delivery time
- Contact preferences

```typescript
const [notes, setNotes] = useState('');
```

**Example Notes**:
- "Please deliver to rear loading dock"
- "Call 30 minutes before delivery"
- "Requires refrigerated truck"
- "Split delivery: 50% now, 50% next week"

#### D. Order Submission

**Submit Button**: Triggers order creation

```typescript
const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (orderItems.length === 0) {
    setError('Please add at least one item');
    return;
  }
  
  // Submit order
  await orderService.create({
    items: orderItems,
    deliveryAddress,
    notes,
  });
  
  setSuccess('Order submitted successfully!');
};
```

**Backend Processing**:

1. **Validation**: 
   - Check minimum order quantities
   - Verify product availability
   - Validate delivery address
   - Check stock levels

2. **Price Calculation**:
   - Fetch current product prices
   - Calculate item subtotals
   - Compute total amount
   - Apply any applicable discounts

3. **Order Creation**:
   - Generate unique order number
   - Set status to "pending"
   - Store customer reference
   - Save delivery address
   - Record timestamp

4. **Response**:
   - Success confirmation
   - Order number
   - Estimated approval time

**Validation Rules**:

✅ At least one product must be selected
✅ Quantities must meet minimum order requirements
✅ All address fields are required
✅ Products must be available in stock
✅ Quantities must be positive integers

**Error Handling**:

```typescript
try {
  await orderService.create(orderData);
  setSuccess('Order submitted successfully!');
} catch (err: any) {
  setError(err.response?.data?.message || 'Failed to submit order');
}
```

**Common Error Messages**:
- "Quantity is below minimum order requirement"
- "Product is currently out of stock"
- "Please provide a valid delivery address"
- "Failed to submit order. Please try again"

---

### 3. Track Order Status

**Description**: Real-time tracking of order status from submission to completion.

**Order Status Workflow**:

```
pending → approved → completed
        ↘ rejected
        ↘ cancelled (by customer)
```

**Status Definitions**:

1. **Pending** (Yellow Badge)
   - Order submitted, awaiting admin review
   - Can be cancelled by customer
   - Typical duration: 1-2 business days

2. **Approved** (Blue Badge)
   - Admin reviewed and approved order
   - Processing for fulfillment
   - Payment may be required at this stage
   - Cannot be cancelled (contact admin)

3. **Completed** (Green Badge)
   - Order fulfilled and delivered
   - Final status
   - Becomes part of order history

4. **Rejected** (Red Badge)
   - Admin rejected the order
   - Reason provided by admin
   - Can submit new order

5. **Cancelled** (Gray Badge)
   - Customer cancelled before approval
   - No charges applied

**Status Display**:

```typescript
const getStatusBadge = (status: string) => {
  const badges: { [key: string]: string } = {
    pending: 'badge-warning',    // Yellow
    approved: 'badge-info',      // Blue
    completed: 'badge-success',  // Green
    rejected: 'badge-danger',    // Red
    cancelled: 'badge-secondary' // Gray
  };
  return `badge ${badges[status] || 'badge-secondary'}`;
};
```

**Status Tracking Features**:

✅ **Visual Indicators**: Color-coded status badges
✅ **Status History**: View status changes over time
✅ **Timestamp**: When order was created/updated
✅ **Actions**: Context-sensitive actions based on status
✅ **Auto-Refresh**: Dashboard updates on page refresh

**Customer Actions by Status**:

| Status    | Available Actions                          |
|-----------|--------------------------------------------|
| Pending   | Cancel Order, View Details                 |
| Approved  | View Details, Contact Admin                |
| Completed | View Details, Reorder                      |
| Rejected  | View Reason, Submit New Order              |
| Cancelled | View Details, Submit New Order             |

**Cancel Order Flow**:

```typescript
// Cancel pending order
const handleCancelOrder = async (orderId: string) => {
  if (confirm('Are you sure you want to cancel this order?')) {
    try {
      await orderService.delete(orderId);
      setSuccess('Order cancelled successfully');
      fetchOrders(); // Refresh order list
    } catch (err) {
      setError('Failed to cancel order');
    }
  }
};
```

**Status Update Notifications**:

While the current implementation shows status on dashboard refresh, future enhancements could include:
- Email notifications on status changes
- In-app notifications
- SMS alerts
- Webhook integrations

---

### 4. View Order History

**Description**: Complete order history with invoice-like details for all past orders.

**Order History Table**:

The dashboard displays all customer orders in a comprehensive table:

```typescript
// Order history display
<table className="table">
  <thead>
    <tr>
      <th>Order #</th>
      <th>Date</th>
      <th>Items</th>
      <th>Total Amount</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {orders.map(order => (
      <tr key={order._id}>
        <td>{order.orderNumber}</td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td>{order.items.length} items</td>
        <td>${order.totalAmount.toFixed(2)}</td>
        <td><span className={getStatusBadge(order.status)}>{order.status}</span></td>
        <td>{/* Action buttons */}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**Displayed Information**:

1. **Order Number**: Unique identifier (e.g., "ORD-1704672000000-ABCD")
2. **Order Date**: When order was submitted
3. **Number of Items**: Total product types in order
4. **Total Amount**: Complete order value in dollars
5. **Current Status**: Real-time status badge
6. **Available Actions**: Context-sensitive buttons

**Order Details** (expandable/click-through):

While not fully implemented in the current basic version, order details would typically include:

```typescript
interface OrderDetails {
  orderNumber: string;
  createdAt: Date;
  status: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    unit: string;
    subtotal: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  totalAmount: number;
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
}
```

**Invoice-Like Display**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order Number: ORD-1704672000000-ABCD
Date: January 7, 2024
Status: Completed

ITEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Premium Basmati Rice (25kg bag)
  Quantity: 50 bags
  Price: $45.99 per bag
  Subtotal: $2,299.50

Extra Virgin Olive Oil (5L carton)
  Quantity: 20 cartons
  Price: $89.99 per carton
  Subtotal: $1,799.80

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT: $4,099.30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DELIVERY ADDRESS
123 Business St
Springfield, IL 62701

NOTES
Please deliver to rear loading dock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**History Features**:

✅ **Complete History**: All orders from account creation
✅ **Chronological Order**: Most recent orders first
✅ **Quick Filters**: Filter by status (pending, completed, etc.)
✅ **Search**: Search by order number or product
✅ **Export**: Download order history (future enhancement)
✅ **Pagination**: Handle large order histories efficiently

**Dashboard Statistics**:

The dashboard header shows key metrics:

```typescript
<div className="dashboard-stats">
  <div className="stat-card">
    <div className="stat-value">{orders.length}</div>
    <div className="stat-label">Total Orders</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">
      {orders.filter(o => o.status === 'pending').length}
    </div>
    <div className="stat-label">Pending Orders</div>
  </div>
  <div className="stat-card">
    <div className="stat-value">
      {orders.filter(o => o.status === 'completed').length}
    </div>
    <div className="stat-label">Completed Orders</div>
  </div>
</div>
```

**Statistics Displayed**:
- Total Orders: Lifetime order count
- Pending Orders: Orders awaiting approval
- Completed Orders: Successfully fulfilled orders

**Responsive Table**:

```css
/* Mobile-friendly table */
.table {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .table {
    display: block;
    overflow-x: scroll;
  }
}
```

---

## Full Customer Journey

### Complete End-to-End Flow

This section details the complete customer journey from discovery to repeat purchases.

#### Stage 1: Discovery & Registration

**Step 1.1: Browse Public Product Catalog**

- Visit homepage (`/`)
- Navigate to Products page (`/products`)
- View wholesale prices (public access)
- Use search and category filters
- Understand minimum order requirements
- Review wholesale pricing page (`/pricing`)

**Actions Available (Public)**:
- View all products and prices
- Search products
- Filter by category
- Read product descriptions
- See minimum order quantities
- Review pricing tiers

**Key Information Displayed**:
- Product names and descriptions
- Wholesale prices (per bulk unit)
- Minimum order quantities
- Stock availability
- Categories

**Example Products View**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GRAINS

[Premium Basmati Rice]
$45.99 per bag (25kg)
Min. Order: 10 bags
Status: Available
Description: High-quality long-grain...

[Organic Quinoa]
$78.99 per bag (20kg)
Min. Order: 5 bags
Status: Available
Description: Premium organic quinoa...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 1.2: Decide to Order**

Once customer identifies needed products:
- Note minimum order requirements
- Calculate approximate costs
- Prepare business information
- Proceed to registration

**Step 1.3: Register Business Account**

Navigate to Register page (`/register`):

```typescript
// Registration form
interface RegistrationData {
  name: string;           // Contact name
  email: string;          // Business email
  password: string;       // Secure password
  businessName: string;   // Company name
  phone?: string;         // Contact number
  address?: {            // Business address
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
```

**Registration Flow**:

```
Fill Registration Form
  ↓
Validate Information
  ↓
Create Customer Account (role: 'customer')
  ↓
Hash Password (bcrypt)
  ↓
Generate JWT Token
  ↓
Auto-Login
  ↓
Redirect to Customer Dashboard
```

**Required Information**:
- ✅ Contact Name
- ✅ Email Address
- ✅ Password (min 8 chars, letter + number)
- ✅ Business Name
- ✅ Phone Number
- ✅ Business Address (all fields)

**Validation Rules**:
- Email must be valid format and unique
- Password must meet strength requirements
- Business name is required
- Address fields are required

#### Stage 2: First Order Submission

**Step 2.1: Login to Dashboard**

After registration or subsequent visits:
- Navigate to Login page (`/login`)
- Enter email and password
- Submit credentials
- Receive JWT token
- Redirect to Dashboard (`/customer/dashboard`)

**Step 2.2: View Dashboard Overview**

Upon landing on dashboard:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MY DASHBOARD
Welcome back, John Smith!

[Statistics Cards]
Total Orders: 0    Pending: 0    Completed: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Available Sections**:
1. Dashboard Statistics
2. Submit New Order (form)
3. My Orders (table)
4. Profile Information (future)

**Step 2.3: Initiate Order**

Click "New Order" button:
- Order form expands
- Empty order items section
- Pre-filled delivery address
- Optional notes field

**Step 2.4: Add Products to Order**

```
1. Click "Add Item"
2. Select Product from dropdown
   → See: "Premium Basmati Rice - $45.99 per bag (25kg) (Min: 10)"
3. Enter Quantity: 50 bags
4. System validates against minimum
5. Repeat for additional products
```

**Example Order Build**:

```
Order Items:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Item 1:
  Product: Premium Basmati Rice - $45.99 per bag (25kg) (Min: 10)
  Quantity: 50 bags
  [Remove]

Item 2:
  Product: Extra Virgin Olive Oil - $89.99 per carton (5L) (Min: 5)
  Quantity: 20 cartons
  [Remove]

[+ Add Item]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 2.5: Review and Confirm Delivery Address**

Address pre-filled from profile:

```
Delivery Address:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Street: 123 Business St
City: Springfield
State: IL
Zip Code: 62701
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Customer can:
- Keep default address
- Modify for specific delivery
- Add delivery instructions in notes

**Step 2.6: Add Optional Notes**

```
Notes (Optional):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please deliver to rear loading dock.
Call 555-0123 30 minutes before arrival.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 2.7: Submit Order**

Click "Submit Order" button:

**Frontend Validation**:
1. Check at least one item added
2. Verify all required fields filled
3. Validate quantities meet minimums

**API Request**:

```typescript
POST /api/orders
Headers: {
  Authorization: "Bearer <jwt_token>"
}
Body: {
  items: [
    { productId: "65a1b2c3d4e5f6", quantity: 50 },
    { productId: "65a1b2c3d4e5f7", quantity: 20 }
  ],
  deliveryAddress: {
    street: "123 Business St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701"
  },
  notes: "Please deliver to rear loading dock. Call 30 mins before."
}
```

**Backend Processing**:

```
1. Authenticate user (JWT verification)
2. Validate order items
   → Check products exist
   → Verify available in stock
   → Validate quantities >= minimums
3. Fetch current product prices
4. Calculate subtotals and total
5. Create order document
   → Generate order number: ORD-[timestamp]-[random]
   → Set status: "pending"
   → Link customer ID
   → Store delivery address
   → Record timestamp
6. Return order confirmation
```

**Success Response**:

```json
{
  "success": true,
  "message": "Order submitted successfully!",
  "order": {
    "orderNumber": "ORD-1704672000000-ABCD",
    "status": "pending",
    "totalAmount": 4099.30,
    "items": [...]
  }
}
```

**Step 2.8: Receive Confirmation**

Dashboard shows:
- Success message: "Order submitted successfully!"
- Order form collapses
- Order appears in "My Orders" table
- Status shows "pending"

```
✓ Order submitted successfully!

My Orders:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order #              Date        Items  Total    Status
ORD-1704...ABCD     01/07/2024   2     $4,099   [pending]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Stage 3: Order Tracking

**Step 3.1: Monitor Order Status**

Customer can check status anytime:
- Login to dashboard
- View "My Orders" table
- Check status badge color and text
- Take available actions

**Status Updates**:

```
Timeline:
  ↓
[Pending] - Order submitted (Day 0)
  Customer Action: Can cancel
  ↓
[Approved] - Admin approved (Day 1-2)
  Customer Action: Wait for fulfillment
  ↓
[Completed] - Order delivered (Day 3-7)
  Customer Action: Reorder if needed
```

**Step 3.2: Cancel Order (If Needed)**

While status is "pending":

```typescript
// Cancel order
if (order.status === 'pending') {
  // Show cancel button
  <button onClick={handleCancelOrder}>Cancel</button>
}

// Cancel flow
1. Click "Cancel" button
2. Confirm: "Are you sure you want to cancel this order?"
3. Send DELETE request to API
4. Order status changes to "cancelled"
5. Success message displayed
6. Order list refreshes
```

**Step 3.3: Wait for Approval**

**Pending Status**:
- Admin reviews order
- Checks inventory availability
- Verifies business information
- Approves or rejects

**Email Notification** (future enhancement):
- Subject: "Your Order ORD-XXXXX Has Been Approved"
- Body: "Your order has been approved and is being processed..."

**Step 3.4: Order Fulfillment**

**Approved Status**:
- Order enters fulfillment process
- Warehouse prepares shipment
- Delivery scheduled
- Customer may be contacted for payment

**Completed Status**:
- Order successfully delivered
- Final status reached
- Becomes permanent record

#### Stage 4: Review Order History

**Step 4.1: Access Order History**

Dashboard "My Orders" section:
- Shows all historical orders
- Sortable by date (newest first)
- Filterable by status
- Searchable by order number

**Step 4.2: View Order Details**

Click on order to see full details:

```
Order Details: ORD-1704672000000-ABCD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: Completed
Date: January 7, 2024
Total: $4,099.30

Items:
  • Premium Basmati Rice (50 bags) - $2,299.50
  • Extra Virgin Olive Oil (20 cartons) - $1,799.80

Delivery Address:
  123 Business St
  Springfield, IL 62701

Notes:
  Please deliver to rear loading dock.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Step 4.3: Download Invoice** (future)

```
[Download Invoice] button
  ↓
Generate PDF
  ↓
Download: invoice-ORD-XXXXX.pdf
```

#### Stage 5: Repeat Orders

**Step 5.1: Review Past Orders**

- Browse order history
- Identify successful orders
- Note products and quantities

**Step 5.2: Create New Order**

**Option A: Manual Reorder**
- Click "New Order"
- Add same products
- Adjust quantities if needed
- Submit new order

**Option B: Reorder Feature** (future)
- Click "Reorder" on past order
- System pre-fills order form
- Customer reviews and adjusts
- Submit with one click

**Step 5.3: Continue Business**

Repeat cycle:
```
Browse Products → Submit Order → Track Status → 
Receive Delivery → Review History → Reorder
```

---

### Customer Journey Diagram

```
                    CUSTOMER JOURNEY FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PUBLIC ACCESS (Unauthenticated)
  ↓
[1. Discover Products]
  • Visit homepage
  • Browse product catalog (/products)
  • View wholesale prices
  • Search and filter products
  • Review pricing page (/pricing)
  • Check minimum orders
  ↓
[2. Register Business Account]
  • Navigate to /register
  • Fill registration form
    - Contact name
    - Email
    - Password
    - Business name
    - Phone
    - Address
  • Submit form
  • Account created (role: customer)
  • Auto-login with JWT token
  ↓
AUTHENTICATED ACCESS (Customer Dashboard)
  ↓
[3. First Login / Access Dashboard]
  • Redirect to /customer/dashboard
  • View dashboard overview
  • See statistics (0 orders)
  • Access order form
  • View empty order history
  ↓
[4. Submit First Order]
  • Click "New Order" button
  • Order form expands
  • Add products:
    a. Click "Add Item"
    b. Select product from dropdown
    c. Enter quantity (≥ minimum)
    d. Repeat for all products
  • Review/edit delivery address
  • Add optional notes
  • Click "Submit Order"
  • Backend validation
  • Order created (status: pending)
  • Success message displayed
  ↓
[5. Track Order Status]
  • View in "My Orders" table
  • Check status badge:
    - [Pending] → Can cancel
    - [Approved] → Being processed
    - [Completed] → Delivered
  • Take actions:
    - Cancel (if pending)
    - View details
    - Contact support
  ↓
[6. Order Approval Process]
  (Admin Side - Customer Waits)
  • Admin reviews order
  • Admin approves/rejects
  • Status updates to "approved"
  • Customer sees updated status
  ↓
[7. Order Fulfillment]
  (Warehouse/Logistics - Customer Waits)
  • Order prepared for shipment
  • Delivery scheduled
  • Customer may receive tracking
  • Order delivered
  • Status updates to "completed"
  ↓
[8. View Order History]
  • Access "My Orders" section
  • See all past orders
  • Filter by status
  • Search by order number
  • View order details:
    - Order number
    - Date
    - Items and quantities
    - Prices and totals
    - Delivery address
    - Status history
    - Notes
  ↓
[9. Repeat Orders]
  • Browse products again
  • Reference past orders
  • Create new order
  • Use same or different products
  • Adjust quantities as needed
  • Submit new order
  ↓
[CONTINUOUS CYCLE]
  Order → Track → History → Reorder → Repeat

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TOUCHPOINTS:
1. Product Discovery (Public)
2. Registration (One-time)
3. Dashboard Access (Protected)
4. Order Submission (Core Feature)
5. Status Tracking (Real-time)
6. Order History (Records)
7. Repeat Business (Loyalty)
```

---

## Technical Implementation

### Frontend Components

#### CustomerDashboard Component

**File**: `frontend/src/pages/CustomerDashboard.tsx`

**Key Features**:
- React functional component with hooks
- State management for orders, products, forms
- Async data fetching
- Form handling and validation
- Real-time updates

**State Variables**:

```typescript
const [orders, setOrders] = useState<Order[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [showOrderForm, setShowOrderForm] = useState(false);
const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
const [deliveryAddress, setDeliveryAddress] = useState<Address>({});
const [notes, setNotes] = useState('');
```

**Lifecycle Hooks**:

```typescript
// Fetch data on component mount
useEffect(() => {
  fetchData();
}, []);

// Fetch orders and products
const fetchData = async () => {
  try {
    setLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      orderService.getAll(),
      productService.getAll({ available: true }),
    ]);
    setOrders(ordersRes.orders);
    setProducts(productsRes.products);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

**Order Form Handlers**:

```typescript
// Add new order item row
const handleAddItem = () => {
  setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
};

// Remove order item
const handleRemoveItem = (index: number) => {
  setOrderItems(orderItems.filter((_, i) => i !== index));
};

// Update order item field
const handleItemChange = (index: number, field: string, value: any) => {
  const newItems = [...orderItems];
  newItems[index] = { ...newItems[index], [field]: value };
  setOrderItems(newItems);
};
```

**Order Submission Handler**:

```typescript
const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Validation
  if (orderItems.length === 0) {
    setError('Please add at least one item to your order');
    return;
  }

  try {
    // Submit order
    await orderService.create({
      items: orderItems,
      deliveryAddress,
      notes,
    });
    
    // Success feedback
    setSuccess('Order submitted successfully!');
    setShowOrderForm(false);
    setOrderItems([]);
    setNotes('');
    
    // Refresh data
    fetchData();
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to submit order');
  }
};
```

**Status Badge Helper**:

```typescript
const getStatusBadge = (status: string) => {
  const badges: { [key: string]: string } = {
    pending: 'badge-warning',
    approved: 'badge-info',
    completed: 'badge-success',
    rejected: 'badge-danger',
    cancelled: 'badge-secondary',
  };
  return `badge ${badges[status] || 'badge-secondary'}`;
};
```

#### Component Structure

```
CustomerDashboard
├── Dashboard Header
│   ├── Welcome message
│   └── User name display
├── Alert Messages
│   ├── Error alerts
│   └── Success alerts
├── Dashboard Statistics
│   ├── Total Orders card
│   ├── Pending Orders card
│   └── Completed Orders card
├── Submit New Order Section
│   ├── Section header with toggle button
│   └── Order Form (conditional)
│       ├── Order Items
│       │   ├── Product dropdown
│       │   ├── Quantity input
│       │   ├── Remove button
│       │   └── Add Item button
│       ├── Delivery Address
│       │   ├── Street input
│       │   ├── City input
│       │   ├── State input
│       │   └── Zip Code input
│       ├── Notes textarea
│       └── Submit button
└── My Orders Section
    ├── Section header
    └── Orders Table
        ├── Order Number
        ├── Date
        ├── Items count
        ├── Total Amount
        ├── Status badge
        └── Action buttons
```

---

## API Integration

### Order Service

**File**: `frontend/src/services/index.ts`

#### Get All Orders

```typescript
// Fetch customer's orders
orderService.getAll()
```

**API Endpoint**: `GET /api/orders`

**Authorization**: Required (JWT token)

**Response**:
```json
{
  "orders": [
    {
      "_id": "65a1b2c3d4e5f6",
      "orderNumber": "ORD-1704672000000-ABCD",
      "customerId": "65a1b2c3d4e5f5",
      "items": [
        {
          "productId": "65a1b2c3d4e5f6",
          "productName": "Premium Basmati Rice",
          "quantity": 50,
          "price": 45.99,
          "unit": "bag (25kg)",
          "subtotal": 2299.50
        }
      ],
      "totalAmount": 4099.30,
      "status": "pending",
      "deliveryAddress": {
        "street": "123 Business St",
        "city": "Springfield",
        "state": "IL",
        "zipCode": "62701"
      },
      "notes": "Please deliver to rear loading dock",
      "createdAt": "2024-01-07T12:00:00.000Z",
      "updatedAt": "2024-01-07T12:00:00.000Z"
    }
  ]
}
```

**Role-Based Filtering**:
- Customers see only their own orders
- Admins see all orders

#### Create Order

```typescript
// Submit new order
orderService.create({
  items: [
    { productId: "65a1b2c3d4e5f6", quantity: 50 },
    { productId: "65a1b2c3d4e5f7", quantity: 20 }
  ],
  deliveryAddress: {
    street: "123 Business St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701"
  },
  notes: "Please deliver to rear loading dock"
})
```

**API Endpoint**: `POST /api/orders`

**Authorization**: Required (JWT token)

**Request Body**:
```json
{
  "items": [
    {
      "productId": "65a1b2c3d4e5f6",
      "quantity": 50
    },
    {
      "productId": "65a1b2c3d4e5f7",
      "quantity": 20
    }
  ],
  "deliveryAddress": {
    "street": "123 Business St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701"
  },
  "notes": "Please deliver to rear loading dock"
}
```

**Backend Validation**:
1. Authenticate user (JWT)
2. Validate products exist
3. Check stock availability
4. Verify minimum order quantities
5. Calculate prices and totals
6. Create order document
7. Return order confirmation

**Success Response**:
```json
{
  "order": {
    "_id": "65a1b2c3d4e5f8",
    "orderNumber": "ORD-1704672000000-WXYZ",
    "status": "pending",
    "totalAmount": 4099.30,
    "items": [...],
    "createdAt": "2024-01-07T12:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

**Error Responses**:
```json
// Quantity below minimum
{
  "error": "Quantity for Premium Basmati Rice is below minimum order of 10"
}

// Product out of stock
{
  "error": "Premium Basmati Rice is currently out of stock"
}

// Invalid product
{
  "error": "Product not found"
}
```

#### Delete Order (Cancel)

```typescript
// Cancel pending order
orderService.delete(orderId)
```

**API Endpoint**: `DELETE /api/orders/:id`

**Authorization**: Required (JWT token)

**Constraints**:
- Only order owner can cancel
- Only "pending" orders can be cancelled
- Returns 403 if order already approved/completed

**Success Response**:
```json
{
  "message": "Order cancelled successfully"
}
```

### Product Service

**File**: `frontend/src/services/index.ts`

#### Get All Products

```typescript
// Fetch available products
productService.getAll({ available: true })
```

**API Endpoint**: `GET /api/products?available=true`

**Authorization**: Not required (public endpoint)

**Response**:
```json
{
  "products": [
    {
      "_id": "65a1b2c3d4e5f6",
      "name": "Premium Basmati Rice",
      "description": "High-quality long-grain basmati rice...",
      "category": "Grains",
      "price": 45.99,
      "unit": "bag (25kg)",
      "stockQuantity": 500,
      "minimumOrder": 10,
      "imageUrl": "https://example.com/rice.jpg",
      "isAvailable": true
    }
  ]
}
```

---

## Security & Access Control

### Authentication

**JWT Token Management**:

```typescript
// AuthContext provides authentication
const { user, token } = useAuth();

// Token automatically included in API requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

**Protected Route**:

```typescript
// ProtectedRoute component
<Route
  path="/customer/dashboard"
  element={
    <ProtectedRoute>
      <CustomerDashboard />
    </ProtectedRoute>
  }
/>
```

**Token Verification**:
- Frontend stores token in localStorage
- Token sent with every API request
- Backend verifies token on protected endpoints
- Expired tokens trigger auto-logout

### Authorization

**Role-Based Access**:

| Feature                  | Public | Customer | Admin |
|--------------------------|--------|----------|-------|
| View product catalog     | ✅     | ✅       | ✅    |
| View wholesale prices    | ✅     | ✅       | ✅    |
| Register account         | ✅     | -        | -     |
| Access dashboard         | ❌     | ✅       | ✅    |
| Submit orders            | ❌     | ✅       | ✅    |
| View own orders          | ❌     | ✅       | ✅    |
| View all orders          | ❌     | ❌       | ✅    |
| Approve/reject orders    | ❌     | ❌       | ✅    |
| Manage products          | ❌     | ❌       | ✅    |

**Backend Middleware**:

```typescript
// Protect customer routes
router.post('/orders', auth, createOrder);

// Protect admin routes
router.put('/orders/:id', auth, adminAuth, updateOrderStatus);
```

### Data Privacy

**Customer Data Isolation**:
- Customers can only see their own orders
- Customer IDs filtered on backend
- No cross-customer data access

```typescript
// Backend: Filter by customer ID
const orders = await Order.find({ customerId: req.user.id });
```

**Sensitive Information**:
- Passwords never returned in responses
- JWT tokens stored securely
- HTTPS enforced in production
- CORS configured for frontend domain

---

## UI/UX Design

### Dashboard Layout

**Desktop View** (1280px+):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Navbar]                                    [User] [Logout]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                                           
    MY DASHBOARD                                           
    Welcome back, John Smith!                              
                                                           
    ┌───────────┐  ┌───────────┐  ┌───────────┐          
    │     5     │  │     2     │  │     3     │          
    │   Total   │  │  Pending  │  │Completed  │          
    │  Orders   │  │  Orders   │  │  Orders   │          
    └───────────┘  └───────────┘  └───────────┘          
                                                           
    ┌─────────────────────────────────────────────┐       
    │ Submit New Order         [New Order] button │       
    │                                              │       
    │ (Order Form when expanded)                   │       
    │  Order Items                                 │       
    │  [Product dropdown] [Qty input] [Remove]     │       
    │  [+ Add Item]                                │       
    │                                              │       
    │  Delivery Address                            │       
    │  [Street] [City] [State] [Zip]              │       
    │                                              │       
    │  Notes (Optional)                            │       
    │  [Textarea]                                  │       
    │                                              │       
    │  [Submit Order] button                       │       
    └─────────────────────────────────────────────┘       
                                                           
    ┌─────────────────────────────────────────────┐       
    │ My Orders                                    │       
    │                                              │       
    │ [Table]                                      │       
    │ Order#  Date   Items  Total   Status Actions│       
    │ ORD-... 01/07   2     $4,099 [pending] [x] │       
    │ ORD-... 01/05   3     $2,500 [completed]    │       
    └─────────────────────────────────────────────┘       
                                                           
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Footer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Tablet View** (768px - 1279px):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Navbar] [☰ Menu]          [User] [Logout]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                           
  MY DASHBOARD                             
  Welcome back, John!                      
                                           
  ┌─────────┐  ┌─────────┐  ┌─────────┐  
  │    5    │  │    2    │  │    3    │  
  │  Total  │  │ Pending │  │Complete │  
  └─────────┘  └─────────┘  └─────────┘  
                                           
  ┌────────────────────────────────────┐  
  │ Submit New Order  [New Order] btn  │  
  │                                    │  
  │ (Order form stack vertically)      │  
  └────────────────────────────────────┘  
                                           
  ┌────────────────────────────────────┐  
  │ My Orders                          │  
  │ (Horizontally scrollable table)    │  
  └────────────────────────────────────┘  
                                           
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Mobile View** (320px - 767px):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━
[☰]  Wholesale  [User ▼]
━━━━━━━━━━━━━━━━━━━━━━━━━━
                          
  MY DASHBOARD            
  Welcome, John!          
                          
  ┌──────────┐            
  │    5     │            
  │  Total   │            
  └──────────┘            
  ┌──────────┐            
  │    2     │            
  │ Pending  │            
  └──────────┘            
  ┌──────────┐            
  │    3     │            
  │Completed │            
  └──────────┘            
                          
  ┌─────────────────────┐ 
  │ Submit New Order    │ 
  │  [New Order] btn    │ 
  │                     │ 
  │ (Form full width)   │ 
  └─────────────────────┘ 
                          
  ┌─────────────────────┐ 
  │ My Orders           │ 
  │                     │ 
  │ (Card-based list)   │ 
  │ ┌─────────────────┐ │ 
  │ │ ORD-...         │ │ 
  │ │ 01/07/2024      │ │ 
  │ │ $4,099.30       │ │ 
  │ │ [pending]       │ │ 
  │ └─────────────────┘ │ 
  └─────────────────────┘ 
                          
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Color Scheme

**Status Colors**:
- **Pending**: Yellow (#f0ad4e) - Warning
- **Approved**: Blue (#5bc0de) - Info
- **Completed**: Green (#5cb85c) - Success
- **Rejected**: Red (#d9534f) - Danger
- **Cancelled**: Gray (#6c757d) - Secondary

**Primary Colors**:
- **Brand Green**: #2d6a4f
- **Light Green**: #52b788
- **Background**: #f8f9fa
- **Text**: #333333
- **Border**: #dee2e6

### Typography

```css
/* Headers */
h1 { font-size: 2rem; font-weight: 700; }
h2 { font-size: 1.5rem; font-weight: 600; }
h3 { font-size: 1.25rem; font-weight: 600; }

/* Body */
p { font-size: 1rem; line-height: 1.6; }

/* Small text */
.small { font-size: 0.875rem; }
```

### Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1280px) {
  /* Desktop */
}
```

### Loading States

**Spinner**:
```html
<div className="loading">
  <div className="spinner"></div>
</div>
```

**Skeleton Screens** (future):
- Placeholder cards while loading
- Shimmer effect
- Maintains layout

---

## Best Practices

### User Experience

1. **Clear Visual Hierarchy**
   - Important information prominent
   - Secondary details subtle
   - Action buttons clear

2. **Immediate Feedback**
   - Success messages on actions
   - Error messages with solutions
   - Loading indicators during waits

3. **Intuitive Navigation**
   - Dashboard accessible from navbar
   - Logout button visible
   - Breadcrumbs for context

4. **Form Usability**
   - Pre-filled default values
   - Clear labels and placeholders
   - Validation messages
   - Required fields marked

5. **Mobile Optimization**
   - Touch-friendly button sizes (44px min)
   - Scrollable tables on small screens
   - Collapsible sections
   - Optimized form layouts

### Performance

1. **Efficient Data Loading**
   - Fetch only necessary data
   - Use Promise.all for parallel requests
   - Cache product list

2. **Optimistic UI Updates**
   - Show success before confirmation
   - Update UI immediately
   - Rollback on error

3. **Lazy Loading** (future)
   - Load order details on demand
   - Infinite scroll for long histories
   - Image lazy loading

### Security

1. **Input Validation**
   - Frontend validation for UX
   - Backend validation for security
   - Sanitize all inputs

2. **Authorization Checks**
   - Verify user identity
   - Check permissions
   - Filter data by user

3. **Secure Communication**
   - HTTPS only in production
   - Secure token storage
   - Auto-logout on expiration

### Accessibility

1. **Semantic HTML**
   - Proper heading hierarchy
   - Form labels associated
   - Alt text for images

2. **Keyboard Navigation**
   - Tab order logical
   - Focus indicators visible
   - Skip links for navigation

3. **Screen Reader Support**
   - ARIA labels where needed
   - Status announcements
   - Error descriptions

### Code Quality

1. **TypeScript Types**
   - Strong typing throughout
   - Interface definitions
   - Type safety

2. **Component Organization**
   - Single responsibility
   - Reusable components
   - Clear file structure

3. **Error Handling**
   - Try-catch blocks
   - User-friendly messages
   - Logging for debugging

---

## Future Enhancements

### Phase 1: Enhanced Features

1. **Order Details Modal**
   - Click order to view full details
   - Expandable items list
   - Status history timeline
   - Download invoice button

2. **Reorder Functionality**
   - "Reorder" button on past orders
   - Pre-fill order form
   - One-click reordering

3. **Advanced Filtering**
   - Filter orders by date range
   - Filter by status
   - Search by product name
   - Sort by various fields

4. **Profile Management**
   - Edit business information
   - Update delivery address
   - Change password
   - Email preferences

### Phase 2: Advanced Features

1. **Real-Time Notifications**
   - WebSocket integration
   - Push notifications
   - Email alerts
   - SMS updates

2. **Order Tracking**
   - Shipment tracking integration
   - Delivery ETA
   - GPS tracking
   - Driver contact

3. **Payment Integration**
   - Credit card payments
   - Invoice generation
   - Payment history
   - Automatic billing

4. **Analytics Dashboard**
   - Spending analytics
   - Order frequency
   - Popular products
   - Cost trends

### Phase 3: Enterprise Features

1. **Multi-User Accounts**
   - Team member invitations
   - Role-based permissions
   - Approval workflows
   - Activity logs

2. **API Access**
   - RESTful API for integrations
   - Webhook notifications
   - Bulk upload via CSV
   - Export capabilities

3. **Advanced Reporting**
   - Custom reports
   - Scheduled reports
   - Export to Excel/PDF
   - Business intelligence

4. **Mobile App**
   - Native iOS/Android apps
   - Offline capability
   - Push notifications
   - Barcode scanning

---

## Conclusion

The Customer Dashboard provides a comprehensive solution for wholesale buyers to:

✅ **View Approved Wholesale Prices**: Real-time pricing on product catalog and order forms
✅ **Submit Bulk Order Requests**: Multi-item orders with quantity validation
✅ **Track Order Status**: Real-time status updates with color-coded badges
✅ **View Order History**: Complete order records with details and invoice data

The implementation follows modern web development best practices with:
- React + TypeScript for type safety
- Responsive design for all devices
- Role-based access control
- RESTful API integration
- User-friendly interface
- Security-first approach

The full customer journey is streamlined from product discovery to repeat orders, providing an efficient wholesale ordering experience.

---

## Quick Reference

### Dashboard Access
```
URL: /customer/dashboard
Auth: Required (JWT token)
Role: Customer
```

### Key Actions
```typescript
// View products with prices
productService.getAll({ available: true })

// Submit order
orderService.create({ items, deliveryAddress, notes })

// Get customer orders
orderService.getAll()

// Cancel pending order
orderService.delete(orderId)
```

### Status Flow
```
pending → approved → completed
        ↘ rejected
        ↘ cancelled
```

### Support
For issues or questions:
- Contact: admin@wholesale.com
- Phone: (555) 123-4567
- Hours: Mon-Fri 9am-5pm EST

---

**Document Version**: 1.0  
**Last Updated**: January 7, 2024  
**Author**: Development Team  
**Related Documentation**: 
- FRONTEND_DESIGN.md
- BACKEND_API_DOCUMENTATION.md
- WHOLESALE_CATALOG_SYSTEM.md
- AUTHENTICATION_AUTHORIZATION.md
