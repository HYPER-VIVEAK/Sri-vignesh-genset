import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ServicePage from './pages/ServicePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import UserForm from './pages/admin/UserForm';
import GensetManagement from './pages/admin/GensetManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/service" element={<ServicePage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute component={AdminDashboard} requiredRole="admin" />} />
                <Route path="/admin/users" element={<ProtectedRoute component={UserManagement} requiredRole="admin" />} />
                <Route path="/admin/users/create" element={<ProtectedRoute component={UserForm} requiredRole="admin" />} />
                <Route path="/admin/users/:id" element={<ProtectedRoute component={UserForm} requiredRole="admin" />} />
                <Route path="/admin/gensets" element={<ProtectedRoute component={GensetManagement} requiredRole="admin" />} />
                <Route path="/admin/orders" element={<ProtectedRoute component={OrderManagement} requiredRole="admin" />} />
                <Route path="/admin/services" element={<ProtectedRoute component={ServiceManagement} requiredRole="admin" />} />
                <Route path="/admin/analytics" element={<ProtectedRoute component={AdminAnalytics} requiredRole="admin" />} />
                
                <Route path="*" element={<div className="text-center py-12">Page not found</div>} />
              </Routes>
            </main>
            <footer className="bg-gray-800 text-white text-center py-4 mt-12">
              <p>&copy; 2024 Genset Store. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
