import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const GensetForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    model: '',
    brand: '',
    capacity: '',
    fuelType: '',
    phase: '',
    price: '',
    condition: 'New',
    stock: '',
    warrantyMonths: '12',
    specifications: {
      voltage: '',
      frequency: '',
      engineModel: '',
      runningHours: '',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      }
    },
    images: [],
    isActive: true
  });

  useEffect(() => {
    if (isEditMode) {
      fetchGenset();
    }
  }, [id]);

  const fetchGenset = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gensets/${id}`);
      const genset = response.data.data;

      setFormData({
        model: genset.model || '',
        brand: genset.brand || '',
        capacity: genset.capacity || '',
        fuelType: genset.fuelType || '',
        phase: genset.phase || '',
        price: genset.price || '',
        condition: genset.condition || 'New',
        stock: genset.stock || '',
        warrantyMonths: genset.warrantyMonths || '12',
        specifications: {
          voltage: genset.specifications?.voltage || '',
          frequency: genset.specifications?.frequency || '',
          engineModel: genset.specifications?.engineModel || '',
          runningHours: genset.specifications?.runningHours || '',
          weight: genset.specifications?.weight || '',
          dimensions: {
            length: genset.specifications?.dimensions?.length || '',
            width: genset.specifications?.dimensions?.width || '',
            height: genset.specifications?.dimensions?.height || ''
          }
        },
        images: genset.images || [],
        isActive: genset.isActive !== undefined ? genset.isActive : true
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load genset');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          ...(subchild ? {
            [child]: {
              ...prev[parent][child],
              [subchild]: value
            }
          } : {
            [child]: value
          })
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      // Clean up and convert numeric fields properly
      const cleanedData = {
        ...formData,
        capacity: Number(formData.capacity),
        price: Number(formData.price),
        stock: Number(formData.stock),
        warrantyMonths: Number(formData.warrantyMonths),
        images: formData.images.filter(url => url.trim() !== ''),
        specifications: {
          voltage: formData.specifications.voltage || undefined,
          frequency: formData.specifications.frequency || undefined,
          engineModel: formData.specifications.engineModel || undefined,
          runningHours: formData.specifications.runningHours ? Number(formData.specifications.runningHours) : undefined,
          weight: formData.specifications.weight ? Number(formData.specifications.weight) : undefined,
          dimensions: {
            length: formData.specifications.dimensions.length ? Number(formData.specifications.dimensions.length) : undefined,
            width: formData.specifications.dimensions.width ? Number(formData.specifications.dimensions.width) : undefined,
            height: formData.specifications.dimensions.height ? Number(formData.specifications.dimensions.height) : undefined
          }
        }
      };

      if (isEditMode) {
        await api.put(`/gensets/${id}`, cleanedData);
        setSuccess('Genset updated successfully!');
      } else {
        await api.post('/gensets', cleanedData);
        setSuccess('Genset created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/gensets');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save genset');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading genset...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/gensets')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Gensets
          </button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Genset' : 'Add New Genset'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., C250D5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select Brand</option>
                  <option value="Cummins">Cummins</option>
                  <option value="Caterpillar">Caterpillar</option>
                  <option value="Kohler">Kohler</option>
                  <option value="Perkins">Perkins</option>
                  <option value="Honda">Honda</option>
                  <option value="Generac">Generac</option>
                  <option value="Kirloskar">Kirloskar</option>
                  <option value="Ashok Leyland">Ashok Leyland</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacity (kVA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Natural Gas">Natural Gas</option>
                  <option value="Propane">Propane</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Gas">Gas</option>
                  <option value="CNG">CNG</option>
                  <option value="LPG">LPG</option>
                  <option value="Bi-Fuel">Bi-Fuel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phase <span className="text-red-500">*</span>
                </label>
                <select
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select Phase</option>
                  <option value="Single Phase">Single Phase</option>
                  <option value="Three Phase">Three Phase</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Warranty (Months)
                </label>
                <input
                  type="number"
                  name="warrantyMonths"
                  value={formData.warrantyMonths}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 12"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Voltage</label>
                <input
                  type="text"
                  name="specifications.voltage"
                  value={formData.specifications.voltage}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 415V"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <input
                  type="text"
                  name="specifications.frequency"
                  value={formData.specifications.frequency}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 50Hz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Engine Model</label>
                <input
                  type="text"
                  name="specifications.engineModel"
                  value={formData.specifications.engineModel}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., QSB7-G5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Running Hours</label>
                <input
                  type="number"
                  name="specifications.runningHours"
                  value={formData.specifications.runningHours}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="specifications.weight"
                  value={formData.specifications.weight}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 2500"
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Dimensions (mm)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Length</label>
                <input
                  type="number"
                  name="specifications.dimensions.length"
                  value={formData.specifications.dimensions.length}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <input
                  type="number"
                  name="specifications.dimensions.width"
                  value={formData.specifications.dimensions.width}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 1200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input
                  type="number"
                  name="specifications.dimensions.height"
                  value={formData.specifications.dimensions.height}
                  onChange={handleChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., 1800"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Product Images</h2>
            <div className="space-y-3">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Invalid';
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Add Image URL
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Add image URLs from online sources. The first image will be used as the primary display image.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/gensets')}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Genset' : 'Create Genset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GensetForm;
