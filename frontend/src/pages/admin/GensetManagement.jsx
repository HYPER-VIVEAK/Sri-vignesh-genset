import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const GensetManagement = () => {
  const navigate = useNavigate();
  const [gensets, setGensets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchGensets();
  }, []);

  const fetchGensets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gensets?includeInactive=true');
      setGensets(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gensets');
    } finally {
      setLoading(false);
    }
  };

  const filteredGensets = gensets.filter((genset) => {
    const matchesSearch =
      genset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genset.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !brandFilter || genset.brand === brandFilter;
    const matchesCondition = !conditionFilter || genset.condition === conditionFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = genset.stock <= 5;
    } else if (stockFilter === 'out') {
      matchesStock = genset.stock === 0;
    } else if (stockFilter === 'available') {
      matchesStock = genset.stock > 5;
    }
    
    return matchesSearch && matchesBrand && matchesCondition && matchesStock;
  });

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/gensets/${deleteModal._id}`);
      setGensets(gensets.filter((g) => g._id !== deleteModal._id));
      setDeleteModal(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete genset');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading gensets...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Genset Management</h1>
        <button
          onClick={() => navigate('/admin/gensets/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Genset
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by model or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Brands</option>
            <option value="Cummins">Cummins</option>
            <option value="Caterpillar">Caterpillar</option>
            <option value="Kohler">Kohler</option>
            <option value="Perkins">Perkins</option>
            <option value="Honda">Honda</option>
            <option value="Generac">Generac</option>
            <option value="Kirloskar">Kirloskar</option>
            <option value="Ashok Leyland">Ashok Leyland</option>
          </select>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Stock Levels</option>
            <option value="available">In Stock (&gt;5)</option>
            <option value="low">Low Stock (≤5)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Gensets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGensets.length > 0 ? (
          filteredGensets.map((genset) => (
            <div key={genset._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              {/* Genset Image */}
              <div className="relative">
                {genset.images && genset.images.length > 0 ? (
                  <img
                    src={genset.images[0]}
                    alt={genset.model}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Genset+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image Available</span>
                  </div>
                )}
                {/* Condition Badge Overlay */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      genset.condition === 'New'
                        ? 'bg-green-500 text-white'
                        : genset.condition === 'Used'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {genset.condition?.toUpperCase()}
                  </span>
                </div>
                {/* Stock Badge Overlay */}
                {genset.stock === 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-lg">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{genset.model}</h3>
                <p className="text-gray-600 mb-4">{genset.brand}</p>

                <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-semibold">{genset.capacity} kVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-semibold">{genset.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phase:</span>
                  <span className="font-semibold">{genset.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">₹{genset.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      genset.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : genset.stock <= 5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {genset.stock === 0 ? 'Out of Stock' : `${genset.stock} units`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      genset.condition === 'New'
                        ? 'bg-green-100 text-green-800'
                        : genset.condition === 'Used'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {genset.condition}
                  </span>
                </div>
                {genset.warrantyMonths > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-semibold">{genset.warrantyMonths} months</span>
                  </div>
                )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/gensets/${genset._id}`)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal(genset)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">No gensets found</div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.model}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GensetManagement;
