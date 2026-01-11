# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
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
