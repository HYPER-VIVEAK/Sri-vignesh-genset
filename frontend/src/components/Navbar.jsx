import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-1 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="Sri Vignesh Genset Service" className="h-16" />
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-100 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-100 transition">
            Products
          </Link>
          <Link to="/service" className="hover:text-blue-100 transition">
            Service
          </Link>
          <Link to="/cart" className="hover:text-blue-100 transition flex items-center">
            🛒 Cart {getItemCount() > 0 && <span className="ml-1 bg-red-500 px-2 py-1 rounded-full text-sm">{getItemCount()}</span>}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">👤 {user.name || user.email}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold transition">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-semibold transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
