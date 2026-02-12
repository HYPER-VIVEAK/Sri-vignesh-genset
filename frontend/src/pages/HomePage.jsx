import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg my-8 px-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to Genset Store 🔧</h1>
        <p className="text-xl mb-6">Your trusted source for high-quality generator sets</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Shop Now
        </button>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">High Quality</h3>
            <p className="text-gray-600">Premium generator sets from trusted brands</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Quick and reliable shipping to your location</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-600">Professional service and technical assistance</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 rounded-lg px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Browse Our Collections</h2>
        <p className="text-lg text-gray-600 mb-6">Explore wide range of generator sets for residential and commercial use</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          View All Products
        </button>
      </section>
    </div>
  );
};

export default HomePage;
