# Authentication System Documentation

## Overview
This document outlines the authentication system implemented for the Genset management application, supporting three user roles: **admin**, **employee**, and **customer**.

---

## User Roles

### 1. **Admin**
- Full access to the system
- Can manage all users (create, read, update, delete)
- Can view all orders and service requests
- Can access all analytics and reports
- Can change user roles and deactivate/activate users

### 2. **Employee**
- Can manage gensets and inventory
- Can view and process service requests
- Can create sales orders
- Can view customer information
- Cannot access user management or admin features

### 3. **Customer**
- Can view available gensets
- Can place orders
- Can request service
- Can view their own orders and service requests
- Can update their profile

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This installs the required packages:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT token generation

### 2. Configure Environment Variables
Create a `.env` file in the backend folder:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

### 3. Create Admin User
Run the admin creation utility:

```bash
node utils/createAdmin.js "Admin Name" "admin@email.com" "password123" "9876543210"
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Customer",
  "email": "customer@example.com",
  "password": "securepassword123",
  "phone": "9876543210",
  "company": "ABC Corp"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Customer",
    "email": "customer@example.com",
    "role": "customer"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "Admin Name",
    "email": "admin@email.com",
    "role": "admin",
    "phone": "9876543210",
    "company": "Company Name"
  }
}
```

#### 3. Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "customer",
    "isActive": true,
    "lastLogin": "2024-02-12T10:30:00Z",
    "createdAt": "2024-02-10T10:30:00Z",
    "updatedAt": "2024-02-12T10:30:00Z"
  }
}
```

#### 4. Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "company": "New Company",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### 5. Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

### User Management Routes (`/api/users`) - Admin Only

#### 1. Get All Users
```
GET /api/users
Authorization: Bearer <admin_token>

Query Parameters:
- role: admin | employee | customer | technician
- status: active | inactive
- search: search by name or email

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "9876543210",
      "role": "employee",
      "isActive": true,
      "lastLogin": "2024-02-12T10:30:00Z"
    }
  ]
}
```

#### 2. Get Specific User
```
GET /api/users/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "employee",
    "isActive": true
  }
}
```

#### 3. Update User
```
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "company": "Company Name"
}

Admin can also update:
{
  "role": "admin | employee | customer | technician",
  "isActive": true | false
}
```

#### 4. Delete User
```
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

#### 5. Deactivate User
```
PATCH /api/users/:id/deactivate
Authorization: Bearer <admin_token>
```

#### 6. Activate User
```
PATCH /api/users/:id/activate
Authorization: Bearer <admin_token>
```

#### 7. Change User Role
```
PATCH /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin | employee | customer | technician"
}
```

---

## Frontend Integration

### 1. Update AuthContext to use Real API
Replace the mock implementation in `src/context/AuthContext.jsx`:

```javascript
import { gensetAPI } from '../services/api';

const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    const { token, user } = response.data;
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};
```

### 2. Add Protected Routes
Create a `ProtectedRoute` component:

```javascript
function ProtectedRoute({ component: Component, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return <Component />;
}
```

### 3. Use in Routes
```javascript
<Route path="/admin" element={<ProtectedRoute component={AdminPage} requiredRole="admin" />} />
<Route path="/employee" element={<ProtectedRoute component={EmployeePage} requiredRole="employee" />} />
```

---

## Security Best Practices

1. **JWT Secret**: Change the default JWT_SECRET in production
2. **HTTPS**: Always use HTTPS in production
3. **Password Requirements**: Implement password strength validation
4. **Token Expiration**: Set appropriate JWT expiration time
5. **CORS**: Configure CORS properly for production domains
6. **Rate Limiting**: Implement rate limiting on auth endpoints
7. **Secure Cookies**: Consider using secure HTTP-only cookies for tokens

---

## Error Handling

### Common Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 403 - Forbidden
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing API Endpoints

You can test the endpoints using:
- **Postman**: Import the API collection
- **cURL**: Use command line
- **VS Code REST Client**: Use the `api-tests.http` file

Example cURL command:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@email.com",
    "password": "password123"
  }'
```

---

## Troubleshooting

### Issue: "Invalid or expired token"
- Check if JWT_SECRET matches between backend and token generation
- Verify token hasn't expired (check JWT_EXPIRE setting)
- Ensure token is correctly passed in Authorization header

### Issue: "bcryptjs module not found"
- Run `npm install` to install dependencies
- Check package.json includes bcryptjs

### Issue: "MongoDB connection failed"
- Verify MONGODB_URI is correct in .env file
- Check MongoDB cluster is accessible
- Verify IP whitelist on MongoDB Atlas (if using cloud)

---

## Next Steps

1. Test all authentication endpoints
2. Implement registration page in frontend
3. Create admin dashboard with user management
4. Add role-based navigation
5. Implement password reset functionality
6. Add email verification
7. Set up two-factor authentication (2FA)
