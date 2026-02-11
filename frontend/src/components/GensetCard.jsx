import React from 'react';
import { useCart } from '../context/CartContext';

const GensetCard = ({ genset }) => {
  const { addToCart } = useCart();

  const getStockColor = (stock) => {
    if (stock > 5) return 'bg-green-100 text-green-800';
    if (stock > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Used':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refurbished':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        {genset.images?.[0] ? (
          <img
            src={genset.images[0]}
            alt={genset.model}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl">⚡</div>
            <p className="text-sm">No image</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{genset.model}</h3>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="text-gray-600">
            <strong>Brand:</strong> {genset.brand}
          </div>
          <div className="text-gray-600">
            <strong>Capacity:</strong> {genset.capacity} kVA
          </div>
          <div className="text-gray-600">
            <strong>Fuel:</strong> {genset.fuelType}
          </div>
          <div className="text-gray-600">
            <strong>Phase:</strong> {genset.phase}
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getConditionColor(genset.condition)}`}>
            {genset.condition}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStockColor(genset.stock)}`}>
            Stock: {genset.stock}
          </span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${genset.price.toLocaleString()}
          </span>
          <button
            onClick={() => addToCart(genset)}
            disabled={genset.stock === 0}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              genset.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default GensetCard;
