# Rental Property Management System

A comprehensive, secure, and scalable rental property management application that enables tenants to submit rental applications and landlords/agents to manage properties and payments.

## System Overview

This system consists of three main components:
1. **Backend API** - Node.js/Express REST API with MongoDB
2. **Mobile App** - React Native mobile application for iOS and Android  
3. **Web Dashboard** - React admin dashboard for full system control

## Features

### Public Access (No Login Required)
- **Browse Available Properties** - View all available rental properties at `/properties`
- **Advanced Property Search** - Filter by location, price, bedrooms, bathrooms
- **Apply Without Registration** - Submit rental applications via shareable link
- Beautiful, responsive interface with purple gradient design

### For Tenants (Mobile App)
- Browse available rental properties
- View detailed property information with photos
- Submit rental applications with employment info and references
- Upload required documents (ID, income proof)
- Track application status
- View and manage rental payments

### For Landlords/Agents (Mobile App)
- List and manage properties
- View incoming rental applications
- Approve or reject applications
- Create payment requests
- Track payment history

### For Administrators (Web Dashboard)
- Full system oversight and control
- User management
- Property management and monitoring
- Application oversight
- Payment tracking and reconciliation
- System analytics and reports

## Technology Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt, CORS, input validation

### Mobile Application
- React Native with Expo
- React Native Paper (Material Design)
- React Navigation
- Axios + AsyncStorage

### Web Dashboard
- React with TypeScript
- Material-UI (MUI)
- Recharts for analytics
- React Router v6

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Expo CLI (for mobile)

### Quick Start

1. **Backend**
```bash
cd backend
npm install
cp .env.example .env
npm start
```

2. **Mobile App**
```bash
cd mobile-app
npm install
cp .env.example .env
npm start
```

3. **Web Dashboard**
```bash
cd web-dashboard
npm install
cp .env.example .env
npm start
```

## Documentation

- [Backend API Documentation](backend/README.md)
- [Mobile App Documentation](mobile-app/README.md)
- [Web Dashboard Documentation](web-dashboard/README.md)
- [Architecture Details](docs/ARCHITECTURE.md)
- [Public Properties Page](docs/PUBLIC_PROPERTIES.md) - Browse properties without login
- [Public Application Form](docs/PUBLIC_APPLICATION_FORM.md) - Apply without registration
- [Security Configuration](docs/SECURITY.md) - Firewall and security setup
- [System Preview](docs/PREVIEW.md) - Visual preview of all pages
- [Quick Start Guide](docs/QUICKSTART.md) - Get running in 3 commands
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment

## Project Structure

```
Ebenco/
├── backend/              # Node.js/Express backend
├── mobile-app/           # React Native mobile app
├── web-dashboard/        # React admin dashboard
└── docs/                 # Documentation
```

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing
- Input validation
- HTTPS/TLS encryption
- PCI compliance via Stripe

## License

See LICENSE file for details.
