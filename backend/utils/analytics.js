const Genset = require('../models/Genset');
const SalesOrder = require('../models/SalesOrder');
const ServiceRequest = require('../models/ServiceRequest');

// Generate sales report
async function generateSalesReport(startDate, endDate) {
  try {
    const orders = await SalesOrder.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    return orders[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
  } catch (error) {
    throw new Error(`Report generation failed: ${error.message}`);
  }
}

// Get low stock gensets
async function getLowStockGensets(threshold = 5) {
  try {
    const lowStock = await Genset.find({ 
      stock: { $lte: threshold },
      isActive: true
    }).select('model brand capacity stock');
    
    return lowStock;
  } catch (error) {
    throw new Error(`Low stock check failed: ${error.message}`);
  }
}

// Calculate service metrics
async function getServiceMetrics(startDate, endDate) {
  try {
    const metrics = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgCost: { $avg: '$actualCost' }
        }
      }
    ]);
    
    const avgRating = await ServiceRequest.aggregate([
      {
        $match: {
          'customerFeedback.rating': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$customerFeedback.rating' }
        }
      }
    ]);
    
    return {
      statusBreakdown: metrics,
      averageRating: avgRating[0]?.averageRating || 0
    };
  } catch (error) {
    throw new Error(`Metrics calculation failed: ${error.message}`);
  }
}

// Get dashboard statistics
async function getDashboardStats() {
  try {
    const totalGensets = await Genset.countDocuments({ isActive: true });
    const lowStockCount = await Genset.countDocuments({ stock: { $lte: 5 }, isActive: true });
    const pendingOrders = await SalesOrder.countDocuments({ status: { $in: ['Quotation', 'Confirmed', 'In Production'] } });
    const openServiceRequests = await ServiceRequest.countDocuments({ status: { $in: ['Open', 'Assigned', 'In Progress'] } });
    
    return {
      totalGensets,
      lowStockCount,
      pendingOrders,
      openServiceRequests
    };
  } catch (error) {
    throw new Error(`Dashboard stats failed: ${error.message}`);
  }
}

module.exports = {
  generateSalesReport,
  getLowStockGensets,
  getServiceMetrics,
  getDashboardStats
};
