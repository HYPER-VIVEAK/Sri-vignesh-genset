const Genset = require('../models/Genset');
const SalesOrder = require('../models/SalesOrder');
const ServiceRequest = require('../models/ServiceRequest');
const Customer = require('../models/Customer');

// Generate sales report
async function generateSalesReport(startDate, endDate) {
  try {
    const orderMatch = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: { $ne: 'Cancelled' }
    };

    const orders = await SalesOrder.aggregate([
      {
        $match: orderMatch
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

    const brandWise = await SalesOrder.aggregate([
      { $match: orderMatch },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'gensets',
          localField: 'items.gensetId',
          foreignField: '_id',
          as: 'genset'
        }
      },
      { $unwind: '$genset' },
      {
        $group: {
          _id: '$genset.brand',
          sales: {
            $sum: {
              $ifNull: [
                '$items.total',
                { $multiply: ['$items.unitPrice', '$items.quantity'] }
              ]
            }
          }
        }
      }
    ]);

    const brandWiseSales = brandWise.reduce((acc, item) => {
      acc[item._id] = item.sales || 0;
      return acc;
    }, {});

    const serviceRevenueAgg = await ServiceRequest.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          actualCost: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$actualCost' }
        }
      }
    ]);
    const serviceRevenue = serviceRevenueAgg[0]?.total || 0;

    const summary = orders[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
    const productSales = summary.totalRevenue || 0;
    
    return {
      ...summary,
      brandWiseSales,
      productSales,
      serviceRevenue
    };
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
    const dateMatch = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const statusAgg = await ServiceRequest.aggregate([
      {
        $match: dateMatch
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgCost: { $avg: '$actualCost' }
        }
      }
    ]);

    const priorityAgg = await ServiceRequest.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const responseAgg = await ServiceRequest.aggregate([
      { $match: { ...dateMatch, scheduledDate: { $exists: true, $ne: null } } },
      {
        $project: {
          responseTimeMs: { $subtract: ['$scheduledDate', '$createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTimeMs: { $avg: '$responseTimeMs' }
        }
      }
    ]);

    const resolutionAgg = await ServiceRequest.aggregate([
      { $match: { ...dateMatch, completedDate: { $exists: true, $ne: null } } },
      {
        $project: {
          resolutionTimeMs: { $subtract: ['$completedDate', '$createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTimeMs: { $avg: '$resolutionTimeMs' }
        }
      }
    ]);

    const completedCount = await ServiceRequest.countDocuments({
      ...dateMatch,
      status: 'Completed'
    });
    
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

    const statusCount = statusAgg.reduce((acc, item) => {
      acc[item._id] = item.count || 0;
      return acc;
    }, {});

    const priorityCount = priorityAgg.reduce((acc, item) => {
      acc[item._id] = item.count || 0;
      return acc;
    }, {});

    const avgResponseTime = (responseAgg[0]?.avgResponseTimeMs || 0) / 3600000;
    const avgResolutionTime = (resolutionAgg[0]?.avgResolutionTimeMs || 0) / 3600000;
    
    return {
      statusCount,
      priorityCount,
      avgResponseTime,
      avgResolutionTime,
      completedCount,
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

    const totalUsers = await Customer.countDocuments({});
    const totalCustomers = await Customer.countDocuments({ role: 'customer' });
    const totalOrders = await SalesOrder.countDocuments({ status: { $ne: 'Cancelled' } });
    const revenueAgg = await SalesOrder.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    
    return {
      totalGensets,
      lowStockCount,
      pendingOrders,
      openServiceRequests,
      totalUsers,
      totalOrders,
      totalRevenue,
      totalCustomers
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
