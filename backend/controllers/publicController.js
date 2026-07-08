const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getPublicDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalBookings,
    successRides,
    cancelledRides,
    ratings,
    topV,
    topP,
    revenueStats,
    statusDistribution
  ] = await Promise.all([
    Booking.countDocuments({ isDeleted: false }),
    Booking.countDocuments({ bookingStatus: 'Success', isDeleted: false }),
    Booking.countDocuments({ bookingStatus: { $regex: /^Canceled/i }, isDeleted: false }),
    Booking.aggregate([
      { $match: { isDeleted: false, driverRating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$driverRating' } } }
    ]),
    Booking.aggregate([
      { $match: { isDeleted: false, vehicleType: { $ne: null } } },
      { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]),
    Booking.aggregate([
      { $match: { isDeleted: false, paymentMethod: { $ne: null, $ne: '' } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]),
    Booking.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$vehicleType',
          totalRevenue: { $sum: '$bookingValue' },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          vehicleType: '$_id',
          totalRevenue: { $round: ['$totalRevenue', 2] },
          totalBookings: 1,
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]),
    Booking.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  const avgDriverRating = ratings.length > 0 ? parseFloat(ratings[0].avgRating.toFixed(2)) : 0;
  const topVehicle = topV.length > 0 ? topV[0]._id : 'N/A';
  const topPaymentMethod = topP.length > 0 ? topP[0]._id : 'N/A';

  return ApiResponse.success(res, 'Public dashboard statistics fetched successfully.', {
    totalBookings,
    successRides,
    cancelledRides,
    avgDriverRating,
    topVehicle,
    topPaymentMethod,
    revenueStats,
    statusDistribution,
  }, 200);
});

module.exports = {
  getPublicDashboardStats,
};
