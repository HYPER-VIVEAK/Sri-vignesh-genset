import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      let startDate = new Date();

      if (dateRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (dateRange === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      startDate = startDate.toISOString().split('T')[0];

      const [dashResponse, salesResponse, serviceResponse] = await Promise.all([
        api.get('/dashboard'),
        api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`),
        api.get(`/reports/service?startDate=${startDate}&endDate=${endDate}`),
      ]);

      setStats({
        dashboard: dashResponse.data.data,
        sales: salesResponse.data.data,
        service: serviceResponse.data.data,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      {stats?.dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{stats.dashboard.totalRevenue || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">Period: {dateRange}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.dashboard.totalOrders || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">Orders placed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.dashboard.totalCustomers || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">Active users</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Avg Order Value</p>
            <p className="text-3xl font-bold text-yellow-600">
              ₹{(stats.dashboard.totalRevenue / (stats.dashboard.totalOrders || 1)).toFixed(2)}
            </p>
            <p className="text-gray-500 text-xs mt-2">Average</p>
          </div>
        </div>
      )}

      {/* Sales Analytics */}
      {stats?.sales && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Sales by Genset Brand</h3>
            <div className="space-y-3">
              {stats.sales.brandWiseSales && Object.entries(stats.sales.brandWiseSales).map(
                ([brand, sales]) => (
                  <div key={brand} className="flex justify-between items-center">
                    <span className="text-gray-700">{brand}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(sales / Math.max(...Object.values(stats.sales.brandWiseSales || {}))) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-semibold w-12">₹{sales}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Product Sales</span>
                <span className="font-semibold text-gray-900">₹{stats.sales.productSales || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Service Revenue</span>
                <span className="font-semibold text-gray-900">₹{stats.sales.serviceRevenue || 0}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="font-bold text-gray-900">
                  ₹{(stats.sales.productSales || 0) + (stats.sales.serviceRevenue || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Analytics */}
      {stats?.service && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Service Requests by Status</h3>
            <div className="space-y-3">
              {stats.service.statusCount && Object.entries(stats.service.statusCount).map(
                ([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-gray-700">{status}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Service by Priority</h3>
            <div className="space-y-3">
              {stats.service.priorityCount && Object.entries(stats.service.priorityCount).map(
                ([priority, count]) => (
                  <div key={priority} className="flex justify-between items-center">
                    <span className="text-gray-700">{priority}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        priority === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Avg Response Time */}
      {stats?.service?.avgResponseTime && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Service Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(stats.service.avgResponseTime)} hrs
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(stats.service.avgResolutionTime || 0)} hrs
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Completed Requests</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.service.completedCount || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
