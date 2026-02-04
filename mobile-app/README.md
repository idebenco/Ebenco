# Rental Property Management - Mobile App

A React Native mobile application for managing rental properties, built with Expo.

## Features

### For Tenants
- Browse available properties
- View detailed property information
- Submit rental applications
- Track application status
- View and manage payments

### For Landlords/Agents
- View applications for their properties
- Approve or reject applications
- Create payment requests
- Track payment history

### Common Features
- User authentication (login/register)
- Profile management
- Real-time updates
- Clean, intuitive UI with Material Design

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)
- Expo Go app on your mobile device (for testing)

## Installation

1. Install dependencies:
```bash
cd mobile-app
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
API_URL=http://your-backend-url:5000/api
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open the Expo Developer Tools in your browser. From there, you can:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

### Run on Specific Platform

iOS (requires macOS):
```bash
npm run ios
```

Android:
```bash
npm run android
```

Web:
```bash
npm run web
```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/       # Reusable components
│   ├── context/          # React Context (Auth, etc.)
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── services/         # API service layer
│   └── utils/            # Utility functions
├── App.js               # Main app component
├── package.json
└── README.md
```

## Screens

### Authentication
- **LoginScreen**: User login
- **RegisterScreen**: New user registration

### Properties
- **PropertiesScreen**: Browse and search properties
- **PropertyDetailScreen**: View detailed property information

### Applications
- **ApplicationsScreen**: View application list
- **ApplicationDetailScreen**: View application details

### Payments
- **PaymentsScreen**: View payment history
- **PaymentDetailScreen**: View payment details

### Profile
- **ProfileScreen**: View and edit user profile

## API Integration

The app connects to the backend API using Axios. All API calls are centralized in the `src/services` directory:

- `api.js`: Axios configuration with interceptors
- `index.js`: Service functions for auth, properties, applications, and payments

### Authentication Flow

1. User logs in or registers
2. JWT token is stored in AsyncStorage
3. Token is automatically added to all API requests
4. Token is removed on logout or 401 responses

## State Management

The app uses React Context API for global state management:

- **AuthContext**: Manages user authentication state
  - User data
  - JWT token
  - Login/logout functions
  - Registration

## UI Components

Built with React Native Paper for consistent Material Design:
- Buttons, Cards, Chips
- Text inputs with validation
- Lists and icons
- Bottom navigation
- Activity indicators

## Development Tips

### Hot Reloading
Changes to the code will automatically reload in the app. Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open the developer menu.

### Debugging
- Use React Native Debugger
- Open Chrome DevTools with `Cmd+D` → "Debug JS Remotely"
- View console logs in terminal or Metro bundler

### Testing on Real Device
1. Install Expo Go from App Store or Play Store
2. Run `npm start`
3. Scan QR code with camera (iOS) or Expo Go (Android)

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

Note: Building requires an Expo account. Follow the prompts to configure app identifiers and certificates.

## Environment Variables

- `API_URL`: Backend API base URL (default: http://localhost:5000/api)

For local development with a device, use your computer's IP address instead of localhost:
```
API_URL=http://192.168.1.x:5000/api
```

## Troubleshooting

### Metro Bundler Issues
```bash
expo start -c  # Clear cache
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### iOS Simulator Not Opening
Make sure Xcode is installed and iOS Simulator is available.

### Android Emulator Issues
Ensure Android Studio is installed with an AVD (Android Virtual Device) configured.

## Future Enhancements

- [ ] Document upload for applications
- [ ] In-app messaging between tenants and landlords
- [ ] Push notifications
- [ ] Property image gallery
- [ ] Map integration for property locations
- [ ] Stripe payment integration
- [ ] Offline mode support
- [ ] Dark mode theme

## License

This project is part of the Ebenco rental management system.
