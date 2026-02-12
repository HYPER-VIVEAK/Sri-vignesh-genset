# Sri Vignesh Genset Management System

A comprehensive full-stack application for managing generator sets (gensets) with sales, service requests, and customer management. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 Features

- **Genset Management**: Complete CRUD operations with advanced filtering by brand, fuel type, capacity, phase, and condition
- **Customer Management**: Track individual and business customers with complete profiles
- **Sales Orders**: Create, track, and manage genset orders with automatic stock management
- **Service Requests**: Handle maintenance, repairs, and warranty services with status tracking
- **User Authentication**: Secure JWT-based authentication with role-based access control (Admin/User)
- **Admin Dashboard**: Comprehensive analytics and statistics for sales, service, and inventory
- **Analytics & Reports**: Sales reports, service metrics, and dashboard statistics
- **Stock Management**: Low stock alerts and real-time inventory tracking
- **Input Validation**: Comprehensive validation and error handling
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Vite as build tool

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

**DevOps:**
- Docker & Docker Compose for containerization
- MongoDB 6 database service

## 📋 Prerequisites

- Docker & Docker Compose (recommended) OR
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm package manager

## ⚙️ Installation & Setup

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sri-vignesh-genset
   ```

2. **Create backend environment file**
   ```bash
   cd backend
   touch .env
   ```
   
   Add the following to `.env`:
   ```env
   MONGODB_URI=mongodb://admin:password123@mongodb:27017/genset?authSource=admin
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   
   Services will be available at:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

### Option 2: Manual Installation

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://your_connection_string
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

3. **Start the backend server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Access the application at http://localhost:5173

## 📁 Project Structure

```
Sri-vignesh-genset/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication and other middleware
│   ├── models/          # Mongoose schemas (Customer, Genset, SalesOrder, ServiceRequest)
│   ├── routes/          # API endpoints
│   ├── utils/           # Helpers, validation, seeding
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components (HomePage, LoginPage, AdminDashboard, etc.)
│   │   ├── context/     # React Context (AuthContext, CartContext)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Helper utilities
│   │   ├── App.jsx      # Main App component
│   │   └── index.jsx    # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yaml  # Docker services orchestration
└── README.md

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Core Endpoints

#### Health & Dashboard

- **GET** `/health` - Server health check
- **GET** `/api/dashboard` - Dashboard statistics (total gensets, pending orders, open service requests, low stock count)
- **GET** `/api/low-stock?threshold=5` - Get gensets with low stock

#### Genset Management

- **GET** `/api/gensets` - Get all active gensets
  - Query params: `brand`, `fuelType`, `minCapacity`, `maxCapacity`, `condition`, `phase`
- **GET** `/api/gensets/:id` - Get single genset by ID
- **POST** `/api/gensets` - Create new genset (requires validation)
- **PUT** `/api/gensets/:id` - Update genset
- **PATCH** `/api/gensets/:id/deactivate` - Soft delete (deactivate)
- **DELETE** `/api/gensets/:id` - Permanently delete

**Genset Schema:**
```json
{
  "model": "DG-500",
  "brand": "Kirloskar",
  "capacity": 500,
  "fuelType": "Diesel",
  "phase": "Three Phase",
  "price": 450000,
  "condition": "New",
  "stock": 5,
  "specifications": {
    "voltage": "415V",
    "frequency": "50Hz",
    "engineModel": "TA-2020",
    "weight": 2500,
    "dimensions": {
      "length": 3000,
      "width": 1200,
      "height": 1800
    }
  },
  "images": ["url1", "url2"],
  "warrantyMonths": 12
}
```

**Valid Enums:**
- **brands**: Cummins, Caterpillar, Kohler, Perkins, Honda, Generac, Kirloskar, Ashok Leyland, Other
- **fuelType**: Diesel, Natural Gas, Propane, Gasoline, Petrol, Gas, CNG, LPG, Bi-Fuel
- **phase**: Single Phase, Three Phase
- **condition**: New, Used, Refurbished

#### Sales Orders

- **POST** `/api/orders` - Create new sales order (auto-reduces stock)
- **GET** `/api/orders?customerId=&status=` - Get all orders with filters
- **GET** `/api/orders/customer/:customerId` - Get customer's orders
- **GET** `/api/orders/:id` - Get single order details
- **PATCH** `/api/orders/:id/status` - Update order status
- **PATCH** `/api/orders/:id/payment` - Update payment status
- **PATCH** `/api/orders/:id/cancel` - Cancel order (restores stock)

**Create Order Example:**
```json
{
  "customerId": "customer_id_here",
  "items": [
    {
      "gensetId": "genset_id_here",
      "quantity": 2,
      "discount": 5000
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "Bank Transfer",
  "shippingCost": 10000,
  "deliveryDate": "2026-03-15",
  "notes": "Urgent delivery required"
}
```

**Order Status**: Quotation, Confirmed, In Production, Ready for Delivery, Delivered, Cancelled  
**Payment Status**: Pending, Partial, Completed, Refunded

#### Service Requests

- **POST** `/api/service-requests` - Create new service request
- **GET** `/api/service-requests?status=&serviceType=&priority=&customerId=` - Get all with filters
- **GET** `/api/service-requests/:id` - Get single service request
- **PATCH** `/api/service-requests/:id/assign` - Assign technician
- **PATCH** `/api/service-requests/:id/status` - Update status
- **PATCH** `/api/service-requests/:id/complete` - Mark as completed
- **PATCH** `/api/service-requests/:id/feedback` - Add customer feedback

**Create Service Request Example:**
```json
{
  "customerId": "customer_id_here",
  "gensetId": "genset_id_here",
  "serviceType": "Maintenance",
  "priority": "High",
  "description": "Annual maintenance checkup required",
  "serviceLocation": {
    "street": "456 Industrial Ave",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "zipCode": "600001"
  },
  "estimatedCost": 15000
}
```

**Service Types**: Installation, Repair, Maintenance, Inspection, Emergency, Warranty  
**Priority**: Low, Medium, High, Critical  
**Status**: Open, Assigned, In Progress, On Hold, Completed, Cancelled

#### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login and receive JWT token
- **GET** `/api/auth/profile` - Get logged-in user profile (requires authentication)

#### Users

- **GET** `/api/users` - Get all users (admin only)
- **GET** `/api/users/:id` - Get user by ID (admin only)
- **PUT** `/api/users/:id` - Update user (admin only)
- **DELETE** `/api/users/:id` - Delete user (admin only)

#### Reports & Analytics

- **GET** `/api/reports/sales?startDate=2026-01-01&endDate=2026-12-31` - Sales report
  - Returns: totalOrders, totalRevenue, averageOrderValue
  
- **GET** `/api/reports/service?startDate=2026-01-01&endDate=2026-12-31` - Service metrics
  - Returns: statusBreakdown, averageRating

## 🌍 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://admin:password123@mongodb:27017/genset?authSource=admin

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Settings (if needed)
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Running the Application

### Development Mode

**With Docker:**
```bash
docker-compose up --build
```

**Without Docker:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Production Mode

```bash
cd backend
npm start
```

### Verify Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📝 Response Format

All API responses follow this consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "errors": ["validation error 1", "validation error 2"]
}
```

## 🧪 Testing

Use the included `api-tests.http` file with REST Client extension in VS Code, or import into Postman/Insomnia.

## � Database Seeding

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

### Security & Vulnerability Fixes

We take security seriously! If you discover a vulnerability:

1. **Do not** open a public GitHub issue
2. Report security vulnerabilities privately by emailing the maintainers
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)
4. Allow reasonable time for the team to address the issue before public disclosure

Accepted security fixes will be:
- Merged with high priority
- Acknowledged in release notes
- Credited to the contributor


## 📄 License

ISC

## 👨‍💻 Author

HYPER-VIVEAK