import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Gensets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-md">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center p-4 border-b last:border-b-0">
            <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0">
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.model}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>

            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-lg">{item.model}</h3>
              <p className="text-sm text-gray-600">
                {item.brand} - {item.capacity} kVA
              </p>
              <p className="text-sm text-gray-600">
                {item.fuelType} | {item.phase}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-1 border-x">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-semibold text-lg">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">${item.price.toLocaleString()} each</p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-3xl font-bold text-blue-600">
            ${getCartTotal().toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
