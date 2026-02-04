# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Quick Links

- [Authentication Endpoints](#authentication-endpoints) - User registration, login, OAuth, phone auth
- [User Account Features](#user-account-features) - Profile management, verification
- [Property Endpoints](#property-endpoints) - Property CRUD operations
- [Application Endpoints](#application-endpoints) - Rental application management
- [TESTING.md](TESTING.md) - Network connectivity and security testing
- [../docs/SECURITY.md](../docs/SECURITY.md) - Firewall rules and security configuration
- [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) - Production deployment guide

## Security & Testing

### Test Connectivity
```bash
npm run test:connectivity
```

This runs comprehensive tests on:
- Backend health and availability
- CORS configuration
- API endpoint accessibility
- DNS resolution
- SSL/TLS certificates
- Rate limiting
- Security headers

See [TESTING.md](TESTING.md) for details.

### Security Configuration

For production deployment, review:
- **Firewall Rules**: [SECURITY.md](../docs/SECURITY.md#firewall-rules)
- **CORS Configuration**: [SECURITY.md](../docs/SECURITY.md#cors-configuration)
- **SSL/TLS Setup**: [SECURITY.md](../docs/SECURITY.md#ssltls-configuration)

## User Account Features

The system supports multiple authentication methods and comprehensive user management:

### Authentication Methods

1. **Email/Password** ✅ Fully Implemented
   - Traditional registration and login
   - Password hashing with bcrypt
   - JWT tokens with 7-day expiration

2. **Google OAuth** ✅ Integration Ready
   - One-click Google Sign-In
   - Automatic account creation
   - Profile picture from Google
   - Email pre-verified

3. **Phone Authentication** ✅ Setup Ready
   - SMS OTP verification
   - Twilio/Firebase integration ready
   - Phone number validation

### User Roles

- **Tenant**: Browse properties, submit applications, track payments
- **Landlord**: Manage properties, review applications, create payments
- **Agent**: All landlord features + manage multiple properties
- **Admin**: Full system access, user management, analytics

### Profile Management

Users can manage their profiles including:
- Personal information (name, phone, bio)
- Address details
- Profile picture/avatar
- Email and phone verification status
- Account preferences (notifications, language)
- Password change
- Last login tracking

### Google OAuth Setup

To enable Google OAuth:

1. **Create Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Environment Variables** (add to `.env`):
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

3. **Frontend Integration**:
```javascript
// Install Google OAuth library
npm install @react-oauth/google

// Use Google Login button
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={(response) => {
    // Send response.credential to /api/auth/google
  }}
  onError={() => console.log('Login Failed')}
/>
```

### Phone Authentication Setup (Twilio)

1. **Sign up for Twilio**: https://www.twilio.com/
2. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone Number

3. **Environment Variables** (add to `.env`):
```bash
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

4. **Install Twilio SDK** (when implementing):
```bash
npm install twilio
```

### Firebase Alternative for Phone Auth

1. **Create Firebase project**: https://console.firebase.google.com/
2. **Enable Phone Authentication**
3. **Environment Variables**:
```bash
FIREBASE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-auth-domain
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User (Email)
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "tenant",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "tenant",
    "profile": { ... }
  }
}
```

### Login
**POST** `/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "tenant",
    "profile": { ... }
  }
}
```

### Update Profile
**PUT** `/auth/profile`

Update the current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "profile": {
    "firstName": "Jane",
    "phone": "+9876543210"
  }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### Google OAuth Authentication
**POST** `/auth/google`

Authenticate using Google OAuth credentials.

**Request Body:**
```json
{
  "googleId": "google_user_id",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://lh3.googleusercontent.com/..."
}
```

**Response:**
```json
{
  "message": "Google authentication successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "email": "user@gmail.com",
    "googleId": "google_user_id",
    "emailVerified": true,
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://lh3.googleusercontent.com/..."
    }
  }
}
```

### Send Phone OTP
**POST** `/auth/phone/send-otp`

Send OTP to phone number for verification.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "phoneNumber": "+1234567890"
}
```

### Verify Phone OTP
**POST** `/auth/phone/verify-otp`

Verify phone number using OTP code.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Phone verified successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "phoneNumber": "+1234567890",
    "phoneVerified": true,
    ...
  }
}
```

---

## Property Endpoints

### List Properties
**GET** `/properties`

Get a list of properties with optional filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)
- `city` (string): Filter by city
- `state` (string): Filter by state
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `bedrooms` (number): Minimum bedrooms
- `bathrooms` (number): Minimum bathrooms
- `status` (string): available | rented | maintenance (default: available)
- `search` (string): Text search

**Response:**
```json
{
  "properties": [
    {
      "_id": "property_id",
      "title": "Beautiful 2BR Apartment",
      "description": "...",
      "address": { ... },
      "price": 1500,
      "bedrooms": 2,
      "bathrooms": 1,
      "images": [...],
      "status": "available"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Property
**GET** `/properties/:id`

Get details of a specific property.

**Response:**
```json
{
  "property": {
    "_id": "property_id",
    "landlordId": { ... },
    "title": "Beautiful 2BR Apartment",
    "description": "...",
    "address": { ... },
    "price": 1500,
    ...
  }
}
```

### Create Property
**POST** `/properties`

Create a new property listing (landlord/agent only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Beautiful 2BR Apartment",
  "description": "Spacious apartment in downtown",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "price": 1500,
  "bedrooms": 2,
  "bathrooms": 1,
  "squareFeet": 850,
  "images": ["url1", "url2"],
  "amenities": ["parking", "gym", "pool"]
}
```

### Update Property
**PUT** `/properties/:id`

Update a property (landlord/agent/admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create, partial updates allowed

### Delete Property
**DELETE** `/properties/:id`

Delete a property (landlord/agent/admin only).

**Headers:** `Authorization: Bearer <token>`

---

## Application Endpoints

### Submit Public Application (No Auth Required) ✨
**POST** `/applications/public`

Submit a rental application without authentication. Perfect for sharing a direct link with potential tenants.

**No Authentication Required** - This endpoint is public

**Request Body:**
```json
{
  "propertyId": "property_id",
  "applicantInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "employmentInfo": {
    "employer": "Company Inc",
    "position": "Software Engineer",
    "income": 75000,
    "startDate": "2020-01-01"
  },
  "references": [
    {
      "name": "Jane Manager",
      "phone": "+0987654321",
      "email": "jane@company.com",
      "relationship": "employer"
    }
  ],
  "moveInDate": "2024-02-01",
  "additionalNotes": "I have a well-behaved pet cat"
}
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "application_id",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Access via Web:** `https://yourdomain.com/apply/{propertyId}`

### List Applications
**GET** `/applications`

Get applications filtered by user role:
- Tenants: see their own applications
- Landlords/Agents: see applications for their properties
- Admin: see all applications

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string): pending | approved | rejected

**Response:**
```json
{
  "applications": [
    {
      "_id": "application_id",
      "propertyId": { ... },
      "tenantId": { ... },
      "status": "pending",
      "employmentInfo": { ... },
      "moveInDate": "2024-01-01"
    }
  ],
  "pagination": { ... }
}
```

### Get Application
**GET** `/applications/:id`

Get details of a specific application.

**Headers:** `Authorization: Bearer <token>`

### Submit Application
**POST** `/applications`

Submit a rental application (tenant only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "propertyId": "property_id",
  "employmentInfo": {
    "employer": "Company Inc",
    "position": "Software Engineer",
    "income": 75000,
    "startDate": "2020-01-01"
  },
  "references": [
    {
      "name": "Reference Name",
      "phone": "+1234567890",
      "relationship": "Previous Landlord",
      "email": "ref@example.com"
    }
  ],
  "moveInDate": "2024-02-01",
  "documents": [
    {
      "type": "id",
      "url": "document_url",
      "fileName": "drivers_license.pdf"
    }
  ]
}
```

### Update Application Status
**PUT** `/applications/:id/status`

Approve or reject an application (landlord/admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "approved",
  "rejectionReason": "Optional reason if rejected"
}
```

---

## Payment Endpoints

### List Payments
**GET** `/payments`

Get payments filtered by user role:
- Tenants: see their own payments
- Landlords: see payments for their properties
- Admin: see all payments

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string): pending | completed | failed | refunded

### Get Payment
**GET** `/payments/:id`

Get details of a specific payment.

**Headers:** `Authorization: Bearer <token>`

### Create Payment
**POST** `/payments`

Create a payment request (landlord/agent only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "propertyId": "property_id",
  "tenantId": "tenant_id",
  "amount": 1500,
  "type": "rent",
  "dueDate": "2024-01-01",
  "description": "Monthly rent for January"
}
```

### Process Payment
**POST** `/payments/:id/process`

Process a payment (tenant only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "stripePaymentId": "stripe_payment_intent_id"
}
```

---

## Admin Endpoints

All admin endpoints require admin role.

### List Users
**GET** `/admin/users`

Get all users with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `role` (string): tenant | landlord | agent | admin

### Update User
**PUT** `/admin/users/:id`

Update any user's information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "landlord",
  "isActive": true,
  "profile": { ... }
}
```

### Delete User
**DELETE** `/admin/users/:id`

Delete a user.

**Headers:** `Authorization: Bearer <token>`

### Get Analytics
**GET** `/admin/analytics`

Get system-wide analytics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "analytics": {
    "overview": {
      "totalUsers": 150,
      "totalProperties": 45,
      "totalApplications": 89,
      "totalPayments": 234,
      "totalRevenue": 125000
    },
    "usersByRole": {
      "tenant": 100,
      "landlord": 40,
      "agent": 8,
      "admin": 2
    },
    "propertiesByStatus": {
      "available": 20,
      "rented": 23,
      "maintenance": 2
    },
    "applicationsByStatus": {
      "pending": 15,
      "approved": 50,
      "rejected": 24
    },
    "paymentsByStatus": {
      "pending": 10,
      "completed": 200,
      "failed": 24
    }
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error


## Payment Integration (Stripe)

### Stripe Setup

1. **Get Stripe API Keys**:
   - Sign up at https://stripe.com
   - Navigate to Developers > API keys
   - Copy your Secret key and Publishable key

2. **Configure Environment Variables**:
   ```bash
   # Backend (.env)
   STRIPE_SECRET_KEY=sk_test_your_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # Frontend (web-dashboard/.env)
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

3. **Install Stripe Package**:
   ```bash
   npm install stripe
   ```

4. **Uncomment Stripe Code**:
   - In `backend/src/controllers/payment.controller.js`
   - Uncomment the `stripe.paymentIntents` calls
   - Enable production mode

### Payment Types

- **Application Fee**: 0 one-time fee for rental applications
- **Rent**: Monthly recurring payments
- **Security Deposit**: First + last month deposit
- **Late Fees**: Automatic calculation for overdue payments
- **Maintenance**: One-time maintenance charges

### Payment Endpoints

```javascript
POST /api/payments/create-intent
  - Create Stripe payment intent
  - Body: { paymentId }
  - Returns: { clientSecret, paymentIntentId }

POST /api/payments/:id/confirm
  - Confirm payment
  - Body: { paymentIntentId, paymentMethodDetails }
  - Returns: { payment, receiptUrl }

POST /api/payments/:id/refund
  - Refund payment
  - Body: { amount, reason }
  - Returns: { payment }

GET /api/payments/:id/receipt
  - Download receipt
  - Returns: PDF receipt

GET /api/payments/statistics
  - Get payment analytics
  - Returns: { totalRevenue, paymentsByType, paymentsByStatus }
```

### Testing Payments

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

See https://stripe.com/docs/testing for more test cards.

### Webhook Setup

1. **Configure Webhook**:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: https://yourdomain.com/api/webhooks/stripe
   - Select events: payment_intent.succeeded, payment_intent.payment_failed

2. **Handle Webhooks**:
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   app.post('/api/webhooks/stripe', async (req, res) => {
     const sig = req.headers['stripe-signature'];
     const event = stripe.webhooks.constructEvent(
       req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
     );
     
     // Handle the event
     if (event.type === 'payment_intent.succeeded') {
       // Update payment status
     }
     
     res.json({ received: true });
   });
   ```


