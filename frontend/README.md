# Genset Store Frontend

A React-based web application for browsing and purchasing generator sets, managing shopping carts, and requesting service.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── GensetCard.jsx        # Product card component
│   │   ├── FilterSidebar.jsx     # Product filtering UI
│   │   └── Navbar.jsx            # Navigation header
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── CartContext.jsx       # Shopping cart state
│   ├── hooks/
│   │   ├── useGensets.js         # Fetch gensets with filtering
│   │   └── useServiceRequests.js # Fetch service requests
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── ProductsPage.jsx      # Product browsing
│   │   ├── CartPage.jsx          # Shopping cart view
│   │   ├── CheckoutPage.jsx      # Order creation
│   │   ├── ServicePage.jsx       # Service requests
│   │   └── LoginPage.jsx         # User authentication
│   ├── services/
│   │   └── api.js                # Axios configuration and API calls
│   ├── App.jsx                   # Main app component with routing
│   ├── index.jsx                 # React entry point
│   └── index.css                 # Tailwind imports
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── .env.local                    # Environment variables
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── postcss.config.js             # PostCSS configuration
```

## 🔧 Key Features

### Authentication
- User login/register with mock implementation
- Persistent authentication using localStorage
- Protected routes (checkout, service requests)

### Shopping
- Browse generator sets with advanced filtering
- Filter by brand, fuel type, condition, capacity, and phase
- Shopping cart with quantity management
- Checkout with delivery address and payment method selection
- 18% automatic tax calculation

### Service Requests
- Submit service requests for gensets
- Filter requests by status
- Track service request status and ticket numbers
- Assign technicians and view service history

### Components

**GensetCard.jsx**
- Displays individual product cards
- Shows stock status and condition badges
- Add to cart functionality with stock validation
- Image display with fallback

**FilterSidebar.jsx**
- Brand filtering (Cummins, Caterpillar, Kohler, Perkins, Honda, Generac, Kirloskar, Ashok Leyland)
- Fuel type filtering (Diesel, Petrol, Natural Gas, LPG, Hybrid)
- Condition filtering (New, Used, Refurbished)
- Capacity range filtering
- Phase filtering (Single, Three Phase)
- Clear filters button

**Navbar.jsx**
- Navigation links to products, services, and cart
- Cart item counter badge
- Conditional auth display (user greeting or login link)
- Responsive design

## 🎨 Styling

The application uses **Tailwind CSS** for styling. All components use utility classes for a consistent, modern design.

## 🔗 API Integration

All API calls are centralized in `src/services/api.js`. The service connects to the Express backend running on `http://localhost:5000/api`

### Available API Methods:

#### Gensets
- `gensetAPI.getAll(filters)` - Get all gensets with optional filters
- `gensetAPI.getById(id)` - Get single genset

#### Orders
- `orderAPI.create(data)` - Create new order
- `orderAPI.getCustomerOrders(customerId)` - Get user's orders

#### Service Requests
- `serviceAPI.create(data)` - Create service request
- `serviceAPI.getAll(filters)` - Get service requests with filters
- `serviceAPI.getCustomerRequests(customerId)` - Get user's requests

#### Dashboard
- `dashboardAPI.getStats()` - Get dashboard statistics

## 📦 Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **tailwindcss**: Utility-first CSS framework

## 🔐 Authentication

Currently uses mock authentication. To implement real authentication:

1. Backend should provide `/auth/login` and `/auth/register` endpoints
2. Endpoints should return JWT tokens
3. Update `AuthContext.jsx` to call real API instead of mock implementation
4. Tokens are automatically included in all requests via axios interceptor

## 📋 Environment Variables

Create a `.env.local` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🛠️ Development Tips

### Adding New Pages
1. Create a new file in `src/pages/`
2. Add the route in `App.jsx`
3. Add navigation link in `Navbar.jsx` if needed

### Using Data from Backend
1. Import the relevant API methods from `src/services/api.js`
2. Use custom hooks (`useGensets`, `useServiceRequests`) or call API directly
3. Handle loading and error states

### Accessing Auth and Cart State
```jsx
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  const { cartItems, addToCart } = useCart();
}
```

## 🚀 Deployment

Build the application for production:

```bash
npm run build
```

The build output will be in the `dist/` directory. Deploy these files to your hosting platform.

## 📝 Notes

- The backend server must be running on `http://localhost:5000` for the frontend to connect
- All API responses are in the format: `{ success: boolean, message: string, data: object }`
- Cart and authentication data persist across page refreshes using localStorage

## 🐛 Troubleshooting

**API Connection Issues**
- Ensure backend server is running on port 5000
- Check that `REACT_APP_API_URL` in `.env.local` is correct
- Check browser console for CORS errors

**Cart Not Persisting**
- Clear browser localStorage and refresh
- Check browser's storage permissions

**Components Not Rendering**
- Verify all imports are correct
- Check React Router setup in `App.jsx`
- Ensure providers wrap the app in correct order (AuthProvider → CartProvider → Router)
