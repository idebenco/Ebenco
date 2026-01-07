# Wholesale Business Frontend

React-based frontend application for the wholesale business website built with TypeScript, Vite, and React Router.

## Features

- Responsive design for all devices
- Public pages (Home, Products, About, Contact)
- User authentication (Login, Register)
- Customer dashboard for order management
- Admin dashboard for business management
- Product browsing and filtering
- Real-time order tracking
- Role-based access control

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminOrders.tsx
│   │   └── AdminCustomers.tsx
│   ├── services/         # API services
│   │   ├── api.ts
│   │   └── index.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── App.css           # Global styles
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Available Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/about` - About us
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration

### Customer Routes (Protected)
- `/customer/dashboard` - Customer dashboard and order management

### Admin Routes (Protected, Admin Only)
- `/admin/dashboard` - Admin overview
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/customers` - View customers

## Technologies

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API

## Environment Variables

- `VITE_API_URL` - Backend API URL

## Demo Credentials

After seeding the backend database:

**Admin:**
- Email: `admin@wholesale.com`
- Password: `Admin123!`

**Customer:**
- Email: `customer@example.com`
- Password: `Customer123!`

## Features by User Role

### Customer Features
- Browse products
- Register and login
- Submit bulk orders
- View order history
- Track order status
- Update profile

### Admin Features
- All customer features
- Add/edit/delete products
- View all orders
- Update order status
- View customer list
- Dashboard analytics

## License

ISC
