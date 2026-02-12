import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/service-requests');
      setServices(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesStatus = !statusFilter || service.status === statusFilter;
    const matchesPriority = !priorityFilter || service.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const handleStatusUpdate = async () => {
    if (!selectedService || !newStatus) return;
    try {
      await api.patch(`/service-requests/${selectedService._id}/status`, { status: newStatus });
      setServices(
        services.map((s) => (s._id === selectedService._id ? { ...s, status: newStatus } : s))
      );
      setSelectedService(null);
      setNewStatus('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading service requests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Service Request Management</h1>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredServices.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ticket</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {service.ticketNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{service.serviceType}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(service.priority)}`}>
                      {service.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setNewStatus(service.status);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">No service requests found</div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Service Request Details</h3>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Ticket Number</p>
                  <p className="font-semibold">{selectedService.ticketNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Service Type</p>
                  <p className="font-semibold">{selectedService.serviceType}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Priority</p>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${getPriorityColor(selectedService.priority)}`}>
                    {selectedService.priority}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Estimated Cost</p>
                  <p className="font-semibold">₹{selectedService.estimatedCost || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 text-sm mb-1">Description</p>
                <p className="text-gray-800">{selectedService.description}</p>
              </div>

              {selectedService.technicianNotes && (
                <div>
                  <p className="text-gray-600 text-sm mb-1">Technician Notes</p>
                  <p className="text-gray-800">{selectedService.technicianNotes}</p>
                </div>
              )}
            </div>

            {/* Update Status */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Update Status</p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border rounded-md px-3 py-2 w-full mb-3"
              >
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
              >
                Update Status
              </button>
            </div>

            <button
              onClick={() => setSelectedService(null)}
              className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
