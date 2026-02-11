import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center">
          ⚡ Genset Store
        </Link>

        <div className="flex items-center space-x-6">
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
              <button
                onClick={logout}
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
