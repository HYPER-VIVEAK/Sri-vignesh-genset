import React, { useEffect, useState } from 'react';
import { useServiceRequests } from '../hooks/useServiceRequests';
import { useAuth } from '../context/AuthContext';
import { serviceAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ServicePage = () => {
  const [activeTab, setActiveTab] = useState('form');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: null, customerId: null });
  const { requests, loading: requestsLoading } = useServiceRequests(filters);

  const [formData, setFormData] = useState({
    gensetId: '',
    serviceType: 'Maintenance',
    priority: 'Medium',
    description: '',
    contactNumber: '',
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, customerId: user?._id || null }));
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request service');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        customerId: user._id,
      };
      if (!data.gensetId) {
        delete data.gensetId;
      }
      const response = await serviceAPI.create(data);
      alert(`Service request created! Ticket: ${response.data.data.ticketNumber}`);
      setFormData({
        gensetId: '',
        serviceType: 'Maintenance',
        priority: 'Medium',
        description: '',
        contactNumber: '',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create service request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Service Requests</h1>

      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === 'form'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          New Request
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          My Requests
        </button>
      </div>

      {activeTab === 'form' && (
        <div className="max-w-2xl bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Request Service</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Genset ID (optional)</label>
              <input
                type="text"
                name="gensetId"
                value={formData.gensetId}
                onChange={handleFormChange}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Paste the genset ID if you have one"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="Installation">Installation</option>
                  <option value="Repair">Repair</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Warranty">Warranty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
                rows="4"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Describe the issue or service needed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleFormChange}
                required
                className="w-full border rounded-md px-3 py-2"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Filter by Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value || null,
                }))
              }
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {requestsLoading ? (
            <div>Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
              No service requests found
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">Ticket: {request.ticketNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        request.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : request.status === 'Open'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    <strong>Type:</strong> {request.serviceType} ({request.priority} Priority)
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Description:</strong> {request.description}
                  </p>
                  {request.assignedTechnician?.name && (
                    <p className="text-sm">
                      <strong>Assigned to:</strong> {request.assignedTechnician.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicePage;
