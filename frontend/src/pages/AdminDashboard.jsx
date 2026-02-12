import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsResponse = await api.get('/dashboard');
        setStats(statsResponse.data.data);

        const usersResponse = await api.get('/users');
        setUsers(usersResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Full Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">System Overview</h2>

            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Gensets */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Gensets</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.totalGensets || 0}
                  </div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.totalUsers || users.length || 0}
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Orders</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.totalOrders || 0}
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-gray-600 text-sm font-medium mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold text-yellow-600">
                    ₹{stats.totalRevenue || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold"
                >
                  Manage Users
                </button>
                <button
                  onClick={() => navigate('/admin/gensets')}
                  className="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold"
                >
                  Manage Gensets
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-semibold"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/admin/services')}
                  className="p-4 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-semibold"
                >
                  Service Requests
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <button
                onClick={() => navigate('/admin/users/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add User
              </button>
            </div>

            {users.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              u.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : u.role === 'employee'
                                ? 'bg-blue-100 text-blue-800'
                                : u.role === 'technician'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              u.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => navigate(`/admin/users/${u._id}`)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Month */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Sales by Month</h3>
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                  <p className="text-gray-600">Chart coming soon...</p>
                </div>
              </div>

              {/* Service Requests by Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Service Requests by Status</h3>
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                  <p className="text-gray-600">Chart coming soon...</p>
                </div>
              </div>

              {/* Genset Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Genset Distribution by Brand</h3>
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                  <p className="text-gray-600">Chart coming soon...</p>
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">User Growth</h3>
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                  <p className="text-gray-600">Chart coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
