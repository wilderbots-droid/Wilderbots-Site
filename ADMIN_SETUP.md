# Admin Panel Setup Guide

## Overview
The admin panel is accessible at `/admin` and provides a secure interface for managing users, orders, and viewing dashboard statistics.

## Initial Setup

### 1. Create Your First Admin User

Run the following command to create your first admin user:

```bash
node scripts/create-admin.js
```

You'll be prompted to enter:
- Admin name
- Admin email
- Admin password
- Role (admin or super_admin)

### 2. Access the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard at `/admin`

## Features

### Dashboard
- View total users, orders, and pending orders
- See recent orders and users
- View orders by status breakdown

### Users Management
- View all registered users
- Search users by name or email
- Delete users
- Pagination support

### Orders Management
- View all orders
- Filter orders by status
- Search orders by tracking number
- Update order status
- Delete orders
- Pagination support

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### Users
- `GET /api/admin/users` - Get all users (with pagination and search)
- `DELETE /api/admin/users?id={userId}` - Delete a user

### Orders
- `GET /api/admin/orders` - Get all orders (with pagination, search, and status filter)
- `PUT /api/admin/orders?id={orderId}` - Update order status
- `DELETE /api/admin/orders?id={orderId}` - Delete an order

### Admin Management
- `POST /api/admin/create-admin` - Create a new admin user

## Security

- All admin routes require authentication via JWT token
- Passwords are hashed using bcrypt
- Tokens expire after 7 days
- Admin tokens are stored in localStorage (consider using httpOnly cookies in production)

## Environment Variables

Make sure to set a secure JWT secret in your environment:

```bash
JWT_SECRET=your-secure-secret-key-here
```

The MongoDB connection string is currently hardcoded in `lib/mongodb.js`. For production, consider moving it to an environment variable.

## Database Models

### Admin
- email (unique, required)
- password (hashed)
- name (required)
- role (admin/super_admin)
- createdAt

### User
- name (required)
- email (unique, required)
- password (hashed)
- createdAt
- lastLogin

### Order
- userId (reference to User)
- trackingNumber (unique, required)
- status (pending/confirmed/processing/shipped/delivered/cancelled)
- items (array)
- totalAmount (required)
- shippingAddress (object)
- createdAt
- updatedAt

