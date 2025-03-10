# Travel Planner

A modern web application for planning and managing travel itineraries. Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Mantine UI](https://mantine.dev/) components.

## Features

### User Authentication
- **User Registration**: Create a new account with email, username, and password
- **User Login**: Secure authentication with username and password
- **Session Management**: Automatically redirects logged-in users to dashboard

### Travel Plans Management
- **Create Travel Plans**: Create detailed travel plans with name, description, and country
- **View Travel Plans**: See a list of all your travel plans in an organized table
- **Edit Travel Plans**: Modify existing travel plans with an intuitive form interface
- **Delete Travel Plans**: Remove plans you no longer need

### User Management (Admin Only)
- **View Users**: Administrators can view all registered users
- **Delete Users**: Remove user accounts when necessary

### Role-Based Access Control
- **User Roles**: Different access levels for regular users and administrators
- **Protected Routes**: Secure routes that require authentication
- **Public Routes**: Accessible pages for non-authenticated visitors

## Technology Stack

- **Frontend**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Components**: [Mantine UI](https://mantine.dev/)
- **Form Validation**: [Zod](https://github.com/colinhacks/zod) schema validation
- **Routing**: [React Router](https://reactrouter.com/)
- **Backend**: [JSON Server](https://github.com/typicode/json-server) (for development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/casca96/travel-planner.git
cd travel-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up the JSON Server (backend):
```bash
npx json-server db.json
```

4. Start the development server:
```bash
npm run dev
```

## Backend Simulation with [JSON Server](https://github.com/typicode/json-server)

This project uses `json-server` with the included `db.json` file to simulate a RESTful API backend during development. The `db.json` file contains:

- **Users collection**: User accounts with authentication information
- **Travel plans collection**: All travel plans created by users

### API Endpoints

When running json-server with the db.json file, the following endpoints become available:

- **Users**:
  - GET `/users` - List all users
  - GET `/users?username=X&password=Y` - Used for authentication
  - GET `/users?isAdmin=false` - List non-admin users (used by admin panel)
  - POST `/users` - Create a new user (registration)
  - DELETE `/users/:id` - Delete a user

- **Travel Plans**:
  - GET `/travel-plans` - List all travel plans
  - GET `/travel-plans?username=X` - List travel plans for a specific user
  - GET `/travel-plans/:id` - Get a specific travel plan
  - POST `/travel-plans` - Create a new travel plan
  - PUT `/travel-plans/:id` - Update a travel plan
  - DELETE `/travel-plans/:id` - Delete a travel plan

The application is configured to connect to these endpoints at `http://localhost:3000/`.

### Important Note

This json-server setup is for development purposes only. In a production environment, you would need to implement a proper backend with secure authentication.


## Usage Guide

### Getting Started
- Visit the home page at `http://localhost:5173/`
- Register a new account or log in with existing credentials

### For Regular Users
1. **Dashboard**: View your account information
2. **Travel Plans**: Access your travel plans from the navigation menu
3. **Create Travel Plan**: Click "Create New Plan" to add a new itinerary
4. **Manage Plans**: Edit or delete your existing plans

### For Administrators
- Log in with admin credentials to access additional features
- User Management section allows viewing and managing user accounts
- Admins can see all travel plans created by any user

## Default Accounts

For testing purposes, you can use these pre-configured accounts:

- **Administrator**:
  - Username: admin
  - Password: 123

- **Regular User**:
  - Username: johndoe
  - Password: password123