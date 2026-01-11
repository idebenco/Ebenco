# Rental Property Management - Admin Web Dashboard

A React TypeScript web application for admin users to manage the rental property management system.

## Features

- **Dashboard**: Overview with analytics and charts
- **User Management**: View, edit, and manage all users
- **Property Management**: Monitor all properties in the system
- **Application Management**: View and track rental applications
- **Payment Management**: Monitor all payments and transactions
- **Authentication**: Secure admin-only login

## Technology Stack

- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State Management**: React Context API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
cd web-dashboard
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build

Build for production:
```bash
npm run build
```

The optimized build will be in the `build` directory.

## Project Structure

```
web-dashboard/
├── public/               # Static files
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.tsx   # Main layout with sidebar
│   ├── context/         # React Context
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── PropertiesPage.tsx
│   │   ├── ApplicationsPage.tsx
│   │   └── PaymentsPage.tsx
│   ├── services/        # API services
│   │   ├── api.ts       # Axios configuration
│   │   └── index.ts     # Service functions
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app component
│   └── index.tsx        # Entry point
├── package.json
└── README.md
```

## Pages

### Login Page
- Admin authentication
- Email and password login
- Only allows admin users

### Dashboard
- Overview statistics (users, properties, applications, payments, revenue)
- Visual analytics with charts
- User distribution by role
- Property status breakdown
- Application status visualization

### User Management
- List all users in the system
- Edit user role and status
- Delete users
- Filter by role

### Property Management
- View all properties
- See property details (price, location, status)
- Monitor property availability

### Application Management
- View all rental applications
- See applicant information
- Track application status (pending, approved, rejected)

### Payment Management
- View all payments
- Monitor payment status
- Track revenue and due dates

## Authentication

The dashboard requires admin privileges:
1. Only users with `role: 'admin'` can access
2. JWT token stored in localStorage
3. Automatic redirect to login if unauthorized
4. Token included in all API requests

## License

This project is part of the Ebenco rental management system.
