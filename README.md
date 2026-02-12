# Sri Vignesh Genset Management System

A comprehensive full-stack application for managing generator sets (gensets) with sales, service requests, and customer management. Built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Genset Management**: Complete CRUD operations with advanced filtering
- **Customer Management**: Track individual and business customers
- **Sales Orders**: Create, track, and manage genset orders with automatic stock management
- **Service Requests**: Handle maintenance, repairs, and warranty services
- **Analytics & Reports**: Sales reports, service metrics, and dashboard statistics
- **Stock Management**: Low stock alerts and inventory tracking
- Input validation and comprehensive error handling
- RESTful API design with consistent response format

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sri-vignesh-genset
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

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

#### Reports & Analytics

- **GET** `/api/reports/sales?startDate=2026-01-01&endDate=2026-12-31` - Sales report
  - Returns: totalOrders, totalRevenue, averageOrderValue
  
- **GET** `/api/reports/service?startDate=2026-01-01&endDate=2026-12-31` - Service metrics
  - Returns: statusBreakdown, averageRating

## 🗂️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Genset.js           # Genset schema
│   ├── Customer.js         # Customer schema
│   ├── SalesOrder.js       # Sales order schema
│   └── ServiceRequest.js   # Service request schema
├── routes/
│   ├── gensetRoutes.js     # Genset API routes
│   ├── orderRoutes.js      # Sales order routes
│   └── serviceRoutes.js    # Service request routes
├── utils/
│   ├── validation.js       # Request validation middleware
│   └── analytics.js        # Reports & analytics functions
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json
└── .env                    # Environment variables
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Other**: CORS, dotenv, nodemon

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

## 📄 License

ISC

## 👨‍💻 Author

HYPER