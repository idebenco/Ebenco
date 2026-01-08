# Customer Access System Design for SmallScale Wholesale Website

## Overview
This document explains the complete customer access system for SmallScale wholesale foodstuffs business, covering registration, approval, login, pricing access, and order management.

---

## 1. Customer Registration Process

### Registration Flow
1. **Customer Visits Registration Page** (login.html - "Create Account" tab)
2. **Fills Registration Form** with business details
3. **System validates information** (client-side)
4. **Application submitted** for admin approval
5. **Customer receives confirmation email** with application status
6. **Admin reviews application** in backend system
7. **Customer receives approval/rejection email**
8. **Approved customers can log in** and access wholesale features

### Registration Form Fields
**Required Information:**
- Business Name *
- Business Type (dropdown: Restaurant, Hotel, Retailer, Caterer, Institution, Other)
- Business Registration Number (CAC Number)
- Tax ID Number (optional)
- Full Name (Contact Person) *
- Email Address *
- Phone Number *
- Business Address
- City/State
- Password * (minimum 8 characters)
- Confirm Password *
- Terms & Conditions Acceptance *

**Purpose of Each Field:**
- **Business Name**: Verify legitimate business
- **Business Type**: Categorize customer for targeted pricing/offers
- **CAC Number**: Validate registered Nigerian business
- **Contact Person**: Primary account contact
- **Email/Phone**: Communication and account recovery
- **Address**: Delivery and verification purposes
- **Password**: Secure account access

---

## 2. Customer Approval System

### Approval Workflow

#### Stage 1: Automatic Validation
- Email format validation
- Phone number format validation (Nigerian format)
- Password strength check
- Business registration number format check
- Duplicate account detection (same email/phone)

#### Stage 2: Pending Review
- **Status**: "Pending Approval"
- Customer account created but **locked**
- Cannot access wholesale prices or place orders
- Can view public catalog but sees "Login to View Wholesale Prices"
- Email sent: "Your application is under review. We'll contact you within 24-48 hours."

#### Stage 3: Admin Review (Backend Process)
Admin reviews:
1. **Business Legitimacy**
   - Verify CAC registration number
   - Check business phone/address
   - Search online presence (website, social media)
   
2. **Creditworthiness Assessment**
   - Business age and size
   - Order history (for returning customers)
   - Payment terms eligibility
   
3. **Risk Assessment**
   - Fraud indicators
   - Blacklisted business check
   - Previous account issues

#### Stage 4: Approval Decision

**If Approved:**
- Account status changed to "Active"
- Customer receives approval email with:
  - Welcome message
  - Login credentials reminder
  - Assigned account manager contact
  - Wholesale pricing tier (Starter/Business/Enterprise)
  - Payment terms (if applicable)
  - Next steps (how to place first order)
- SMS notification sent
- Customer can now log in and access all features

**If Rejected:**
- Account status set to "Rejected"
- Customer receives polite rejection email with:
  - Reason for rejection (if appropriate)
  - How to appeal or reapply
  - Contact information for questions
- Account data retained for record-keeping

**If More Information Needed:**
- Status: "Information Required"
- Email sent requesting specific documents/details
- Customer can respond via email or phone
- Admin can request: business certificate, tax documents, references

---

## 3. Customer Login System

### Login Flow
1. **Customer visits login page** (login.html)
2. **Enters email and password**
3. **System validates credentials**
4. **Checks account status**:
   - Pending → Show "Account pending approval" message
   - Rejected → Show "Account not approved" with contact info
   - Suspended → Show "Account suspended" message
   - Active → Proceed to login
5. **Session created** with customer data
6. **Redirected to dashboard** or previous page

### Authentication Methods

#### Primary Method: Email & Password
- Email: Customer's registered email
- Password: Secure password (hashed with bcrypt/argon2)
- Remember Me: Optional 30-day session persistence
- Session timeout: 24 hours for security

#### Alternative Methods (Optional)
1. **Email OTP (One-Time Password)**
   - Customer enters email
   - 6-digit code sent to email
   - Valid for 10 minutes
   - For forgotten passwords or passwordless login

2. **Phone Number OTP**
   - Customer enters phone number
   - 6-digit SMS code sent
   - Valid for 10 minutes
   - For customers without email access

3. **Social Login (Future Enhancement)**
   - Google Business Account
   - LinkedIn (for B2B verification)
   - Not recommended for financial transactions

### Security Features
- **Password Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (optional but recommended)
  
- **Account Protection**:
  - Login attempt limit: 5 failed attempts
  - Account lockout: 30 minutes after 5 failures
  - Unlock via email verification
  - Admin can unlock accounts
  
- **Session Management**:
  - JWT tokens or secure session cookies
  - HTTPS required for all authentication
  - Session invalidation on password change
  - Active session list (logout all devices option)

### Forgot Password Flow
1. Click "Forgot Password?" link
2. Enter registered email address
3. Receive password reset email with secure link
4. Link valid for 1 hour
5. Click link, redirected to password reset page
6. Enter new password (twice)
7. Password updated, old sessions invalidated
8. Confirmation email sent
9. Redirect to login page

---

## 4. Customer Access Levels & Permissions

### Account Status Types

#### 1. Pending Approval
**Can access:**
- Public website pages (Home, About, Contact)
- Product catalog (without prices)
- Registration status page

**Cannot access:**
- Wholesale prices
- Add to cart
- Place orders
- Customer dashboard

#### 2. Active - Retail Customer
**Can access:**
- All public pages
- Product catalog with retail prices
- Shopping cart
- Retail checkout
- Order history (retail orders)
- Basic account settings

**Cannot access:**
- Wholesale prices
- Bulk discounts
- Credit terms
- Dedicated account manager

#### 3. Active - Wholesale Customer (Tier-based)

**Starter Tier (Up to 10% discount)**
- Minimum order: ₦50,000
- Can access:
  - Wholesale prices (Starter tier)
  - Bulk order form
  - Order history
  - Payment on delivery
  - Standard delivery
  - Email support

**Business Tier (Up to 20% discount)**
- Minimum order: ₦200,000
- Additional access:
  - Better wholesale prices
  - 7-day payment terms (after approval)
  - Priority delivery
  - Phone support
  - Quarterly pricing reviews

**Enterprise Tier (Up to 30% discount)**
- Minimum order: ₦1,000,000
- Premium access:
  - Best wholesale prices
  - 30-day payment terms
  - Dedicated account manager
  - Express delivery
  - Custom pricing negotiations
  - Annual contract options
  - Inventory management assistance

#### 4. Suspended
- Account temporarily disabled
- Cannot log in
- Reasons: Payment default, policy violation
- Can be reactivated after issue resolution

#### 5. Deactivated
- Customer requested account closure
- Cannot log in but data retained
- Can be reactivated by customer request

---

## 5. Wholesale Price Access System

### How Customers View Wholesale Prices

#### For Non-Logged In Users
- Product catalog shows: "Login to View Wholesale Prices"
- Retail price may or may not be displayed
- Call-to-action: "Sign Up for Wholesale Account"

#### For Logged-In Retail Customers
- See retail prices only
- Message: "Upgrade to Wholesale Account for Better Prices"
- Can submit wholesale application

#### For Logged-In Wholesale Customers
Products display:
```
Premium Rice (50kg bag)
Retail: ₦32,000
Your Price: ₦28,000 (12% OFF)
Bulk (10+ bags): ₦26,500 (17% OFF)
Min. Order: 1 bag
Stock: In Stock
[Add to Cart] [Request Quote]
```

### Dynamic Pricing Rules
**Pricing Calculation:**
1. Base retail price: ₦32,000
2. Customer tier discount: -12% = ₦28,000
3. Volume discount (10+ units): Additional -5% = ₦26,500
4. Total savings: 17% off retail

**Price Display Logic:**
```javascript
if (customer.status === 'active' && customer.type === 'wholesale') {
    if (customer.tier === 'starter') {
        discount = 10%; // Up to 10%
    } else if (customer.tier === 'business') {
        discount = 20%; // Up to 20%
    } else if (customer.tier === 'enterprise') {
        discount = 30%; // Up to 30%
    }
    
    wholesalePrice = retailPrice * (1 - discount/100);
    
    // Volume discounts on top
    if (quantity >= 10) {
        wholesalePrice *= 0.95; // Additional 5% off
    }
}
```

### Price Update Notifications
- Customers notified of price changes via email
- Price history available in dashboard
- Lock-in pricing for active quotes (48-hour validity)

---

## 6. Order Management System

### Order Types

#### 1. Retail Orders (Small Quantities)
**Process:**
1. Add items to shopping cart
2. Review cart and quantities
3. Click "Proceed to Checkout"
4. Fill delivery information
5. Select payment method (Pay on Delivery, Bank Transfer)
6. Review order summary
7. Place order
8. Receive order confirmation email with order ID
9. Order processed within 24 hours
10. Delivery scheduled

**Order Status Flow:**
- Pending → Processing → Packed → Out for Delivery → Delivered

#### 2. Wholesale Orders (Bulk Quantities)
**Process:**
1. Browse products with wholesale prices
2. Option A: Add to cart and checkout (for immediate orders)
3. Option B: Click "Request Quote" for custom orders
4. Fill quote request form with:
   - Products and quantities
   - Delivery date needed
   - Special requirements
   - Payment terms preference
5. Submit quote request
6. Sales team reviews (within 4 hours)
7. Customer receives detailed quote with:
   - Itemized pricing
   - Delivery schedule
   - Payment terms
   - Quote validity (48 hours)
8. Customer accepts quote
9. Order confirmed
10. Production/packing begins
11. Delivery scheduled

**Order Status Flow:**
- Quote Requested → Quote Sent → Quote Accepted → Order Confirmed → Processing → Ready → In Transit → Delivered → Invoice Sent → Payment Received

#### 3. Standing Orders (Repeat Orders)
**For regular customers:**
- Set up recurring orders (weekly, monthly)
- Auto-approval for verified customers
- Fixed pricing for contract period
- Automatic delivery scheduling
- Payment terms: Net 30 for enterprise customers

### Order Submission Methods

#### Method 1: Shopping Cart Checkout
- Best for: Small to medium orders, standard products
- Process: Add to cart → Checkout → Pay → Confirm
- Payment: Immediate (online or COD)

#### Method 2: Quote Request Form (quote.html)
- Best for: Large orders, custom requirements, credit terms
- Process: Submit form → Receive quote → Accept → Order confirmed
- Payment: Flexible (credit terms, bank transfer, installments)

#### Method 3: Phone/WhatsApp Order
- Customer calls sales team
- Sales rep creates order in system
- Quote sent via email/WhatsApp
- Customer confirms
- Order processed

#### Method 4: Account Manager (Enterprise only)
- Dedicated account manager takes orders
- Personalized service
- Custom pricing negotiations
- Contract management

### Order Dashboard Features

#### Customer Dashboard (dashboard.html - To be created)

**Overview Section:**
- Account status badge
- Current tier and discount level
- Total orders this month
- Outstanding invoices
- Account balance (if credit terms)

**Recent Orders:**
- Order ID, Date, Status, Total, Actions
- Quick reorder button
- Track shipment link
- Download invoice
- Rate/Review order

**Active Quotes:**
- Quote ID, Products, Total, Valid Until, Status
- Accept quote button
- Request modifications
- Download PDF

**Order History:**
- Filter by date range, status, product
- Export to CSV/Excel
- Detailed order view
- Reorder functionality
- Download invoices and receipts

**Saved Carts:**
- Multiple saved carts
- Name your carts
- Quick load and checkout
- Share cart with colleagues

**Order Tracking:**
- Real-time delivery status
- Estimated delivery time
- Delivery driver contact
- Proof of delivery (signature, photo)

**Payment History:**
- All payments and invoices
- Outstanding balance
- Payment due dates
- Download receipts
- Payment method management

**Account Settings:**
- Update business information
- Change password
- Manage delivery addresses
- Update payment methods
- Communication preferences
- Download account statements

---

## 7. Backend Admin System Requirements

### Admin Dashboard Modules

#### 1. Customer Management
**Features:**
- View all customer applications
- Approve/reject/request info
- Edit customer details
- View customer order history
- Assign account managers
- Set pricing tiers
- Manage credit limits
- Suspend/reactivate accounts
- Send bulk emails to customer segments

#### 2. Order Management
**Features:**
- View all orders (retail + wholesale)
- Filter by status, customer, date, amount
- Bulk status updates
- Generate picking lists
- Print packing slips
- Update tracking information
- Process refunds/cancellations
- Analytics and reporting

#### 3. Quote Management
**Features:**
- View incoming quote requests
- Assign to sales reps
- Create custom quotes
- Email quotes to customers
- Track quote acceptance rate
- Convert quotes to orders
- Quote expiration management

#### 4. Pricing Management
**Features:**
- Update retail prices
- Set tier-based discounts
- Volume discount rules
- Promotional pricing
- Price change history
- Bulk price updates
- Customer-specific pricing
- Price approval workflows

#### 5. Inventory Management
**Features:**
- Stock level monitoring
- Low stock alerts
- Reorder point settings
- Supplier management
- Purchase orders
- Stock movements tracking
- Warehouse locations

#### 6. Payment & Invoicing
**Features:**
- Generate invoices automatically
- Send invoice emails
- Track payment status
- Credit terms management
- Payment reminders
- Late payment penalties
- Payment gateway integration
- Accounting software integration

#### 7. Reporting & Analytics
**Features:**
- Sales reports (daily, weekly, monthly)
- Customer analytics
- Product performance
- Delivery performance
- Payment collection rates
- Customer lifetime value
- Profit margins by product/customer
- Forecast reports

---

## 8. Technical Implementation Guide

### Frontend (Current Implementation)

#### Login Page (login.html)
**Current features:**
- Sign In tab with email/password
- Create Account tab with registration form
- Remember me checkbox
- Forgot password link
- Alternative login options (OTP)

**Enhancement needed:**
- Account status messages
- Registration application tracking
- Email verification flow

#### Customer Dashboard (dashboard.html - To be created)
**Sections to implement:**
- Account overview
- Recent orders
- Active quotes
- Quick reorder
- Order tracking
- Profile settings

### Backend Requirements (To be implemented)

#### Technology Stack Recommendation
**For Nigerian Market:**

1. **Backend Framework:**
   - Node.js with Express.js (fast, scalable)
   - Python with Django/Flask (robust, secure)
   - PHP with Laravel (widely supported)

2. **Database:**
   - PostgreSQL (reliable, ACID compliant)
   - MySQL (popular, well-supported)
   - MongoDB (flexible schema for rapid development)

3. **Authentication:**
   - JWT (JSON Web Tokens) for stateless auth
   - bcrypt for password hashing
   - OAuth 2.0 for social logins (optional)

4. **Payment Integration:**
   - Paystack (Nigerian payment gateway)
   - Flutterwave (African payments)
   - Bank transfer verification API

5. **Email Service:**
   - SendGrid
   - Mailgun
   - Amazon SES

6. **SMS Service:**
   - Twilio
   - Africa's Talking (African-focused)
   - Termii (Nigerian service)

7. **Hosting:**
   - Whogohost (Nigerian)
   - Qservers (Nigerian)
   - Digital Ocean (international)
   - AWS (scalable)

#### API Endpoints Needed

**Authentication:**
- POST /api/auth/register - Customer registration
- POST /api/auth/login - Customer login
- POST /api/auth/logout - Logout
- POST /api/auth/forgot-password - Password reset request
- POST /api/auth/reset-password - Password reset
- POST /api/auth/verify-email - Email verification
- POST /api/auth/resend-verification - Resend verification email

**Customer Management:**
- GET /api/customer/profile - Get customer details
- PUT /api/customer/profile - Update customer details
- GET /api/customer/status - Check approval status
- POST /api/customer/upload-document - Upload verification docs

**Products & Pricing:**
- GET /api/products - Get product list (with customer-specific pricing)
- GET /api/products/:id - Get single product
- GET /api/products/search - Search products
- GET /api/pricing/tier - Get customer pricing tier

**Cart & Orders:**
- GET /api/cart - Get customer cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update - Update cart item
- DELETE /api/cart/remove - Remove cart item
- POST /api/orders - Create order
- GET /api/orders - Get order history
- GET /api/orders/:id - Get order details
- GET /api/orders/:id/track - Track order

**Quotes:**
- POST /api/quotes - Submit quote request
- GET /api/quotes - Get customer quotes
- GET /api/quotes/:id - Get quote details
- POST /api/quotes/:id/accept - Accept quote
- POST /api/quotes/:id/reject - Reject quote

**Admin (Backend only):**
- GET /api/admin/customers - List customers
- PUT /api/admin/customers/:id/approve - Approve customer
- PUT /api/admin/customers/:id/reject - Reject customer
- GET /api/admin/orders - List all orders
- PUT /api/admin/orders/:id/status - Update order status
- GET /api/admin/quotes - List all quotes
- POST /api/admin/quotes/:id/send - Send quote to customer

### Security Considerations

#### Data Protection
- SSL/HTTPS for all pages (required)
- Password hashing with bcrypt (cost factor 12)
- Secure session management
- CSRF tokens on all forms
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)

#### Payment Security
- PCI DSS compliance (if storing card data)
- Use payment gateway tokens, never store full card numbers
- Secure payment callback URLs
- Payment verification before order fulfillment

#### Nigerian Compliance
- NDPR (Nigeria Data Protection Regulation) compliance
- Data privacy policy
- Terms and conditions
- Cookie consent
- Customer data rights (access, deletion)

---

## 9. User Experience Flow Diagrams

### New Customer Registration Flow
```
Visit Website → Browse Products → See "Login for Wholesale Prices"
    → Click "Sign Up" → Fill Registration Form → Submit
    → Receive Confirmation Email → Wait for Approval (24-48h)
    → Receive Approval Email → Login → Access Wholesale Prices
    → Place First Order → Build Relationship
```

### Existing Customer Order Flow
```
Login → Dashboard → Browse Products → Add to Cart
    → Review Cart → Checkout → Select Delivery Options
    → Confirm Order → Receive Confirmation → Track Order
    → Receive Delivery → Confirm Receipt → Payment (if credit)
    → Rate Order → Reorder (next time)
```

### Quote Request Flow (Large Orders)
```
Login → Browse Products → Click "Request Quote"
    → Fill Quote Form (products, quantities, requirements)
    → Submit → Sales Team Notified → Quote Prepared (within 4h)
    → Customer Receives Quote Email → Review Quote
    → Accept Quote → Order Confirmed → Delivery Scheduled
    → Receive Order → Payment → Invoice Closed
```

---

## 10. Customer Communication Strategy

### Automated Emails

#### Registration Emails
1. **Registration Confirmation**
   - Subject: "Application Received - SmallScale Wholesale"
   - Content: Thank you, what happens next, timeline

2. **Approval Email**
   - Subject: "Welcome to SmallScale Wholesale! Your Account is Approved"
   - Content: Welcome message, account details, pricing tier, next steps

3. **Rejection Email**
   - Subject: "Update on Your Wholesale Application"
   - Content: Polite message, reason (if appropriate), reapplication process

4. **Information Request**
   - Subject: "Additional Information Needed for Your Application"
   - Content: Specific documents needed, how to submit, deadline

#### Order Emails
1. **Order Confirmation**
   - Order details, estimated delivery, payment info, tracking link

2. **Order Processing**
   - Your order is being prepared

3. **Order Shipped**
   - Order on the way, tracking number, driver contact

4. **Order Delivered**
   - Delivery confirmed, thank you, rate your order

5. **Payment Reminder** (for credit terms)
   - Invoice due in X days, payment methods, contact for issues

#### Quote Emails
1. **Quote Received**
   - We received your request, processing time

2. **Quote Ready**
   - Detailed quote, validity period, accept/reject links

3. **Quote Expiring**
   - Your quote expires in 24 hours, renew or accept

### SMS Notifications
- Order confirmed
- Order shipped (with tracking)
- Delivery today
- Payment due reminder

### WhatsApp Business
- Order status updates
- Quick quote requests
- Customer support
- Product catalogs

---

## 11. Implementation Phases

### Phase 1: Basic Authentication (2-3 weeks)
- Registration form with validation
- Login system with JWT
- Password reset functionality
- Email verification
- Basic customer profile page

### Phase 2: Approval Workflow (2 weeks)
- Admin approval system
- Status notifications
- Application tracking
- Tier assignment

### Phase 3: Wholesale Pricing (2 weeks)
- Tier-based pricing engine
- Dynamic price display
- Volume discount calculations
- Price access control

### Phase 4: Order Management (3-4 weeks)
- Shopping cart enhancement
- Checkout process
- Quote request system
- Order tracking
- Customer dashboard

### Phase 5: Admin Panel (3-4 weeks)
- Customer management
- Order management
- Quote management
- Reporting and analytics

### Phase 6: Payment Integration (2-3 weeks)
- Paystack/Flutterwave integration
- Invoice generation
- Credit terms management
- Payment tracking

### Phase 7: Advanced Features (ongoing)
- Mobile app
- API for third-party integrations
- Advanced analytics
- Loyalty program
- Referral system

---

## 12. Success Metrics

### Customer Onboarding
- Registration conversion rate: >60%
- Approval time: <24 hours
- First order within: 7 days of approval
- Onboarding completion rate: >80%

### Login & Engagement
- Daily active users: Track growth
- Average session duration: >5 minutes
- Cart abandonment rate: <30%
- Repeat purchase rate: >40%

### Order Management
- Order processing time: <24 hours
- On-time delivery rate: >95%
- Order accuracy: >98%
- Customer satisfaction: >4.5/5

### Business Growth
- New customer acquisition: Track monthly
- Customer retention rate: >70%
- Average order value growth: Monitor trends
- Revenue from wholesale: Track percentage

---

## Summary

This customer access system provides:

✅ **Secure Registration** - Business verification and approval process
✅ **Tiered Access** - Starter, Business, Enterprise pricing levels
✅ **Professional Login** - Multiple authentication methods
✅ **Wholesale Pricing** - Customer-specific pricing based on tier
✅ **Order Management** - Cart, quotes, tracking, history
✅ **Admin Control** - Full backend management system
✅ **Nigerian Market Fit** - Local payments, delivery, compliance

**The system balances:**
- Security (approval process, verified businesses)
- Convenience (easy registration, fast approval)
- Flexibility (multiple order methods, pricing tiers)
- Growth (scalable from small to enterprise customers)

**Next Steps:**
1. Review and approve this design
2. Begin Phase 1 implementation (Basic Authentication)
3. Set up backend infrastructure
4. Implement admin approval workflow
5. Launch beta with selected customers
6. Iterate based on feedback
7. Scale to full production

This comprehensive system will position SmallScale as a professional, trustworthy wholesale partner with modern e-commerce capabilities suitable for the Nigerian B2B market.
