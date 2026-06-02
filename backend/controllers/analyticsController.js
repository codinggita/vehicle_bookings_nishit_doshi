const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getRevenueStats = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    { $match: { isDeleted: false } },

    {
      $group: {
        _id: '$vehicleType',
        totalRevenue: { $sum: '$bookingValue' },
        totalDistance: { $sum: '$rideDistance' },
        totalBookings: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: 0,
        vehicleType: '$_id',
        totalRevenue: { $round: ['$totalRevenue', 2] },
        totalDistance: { $round: ['$totalDistance', 2] },
        totalBookings: 1,
        averageRevenuePerBooking: {
          $round: [{ $divide: ['$totalRevenue', '$totalBookings'] }, 2],
        },
      },
    },

    { $sort: { totalRevenue: -1 } },
  ]);

  return ApiResponse.success(res, 'Revenue and distance statistics by vehicle type retrieved.', stats, 200);
});

const getStatusDistribution = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
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
  ]);

  return ApiResponse.success(res, 'Booking status distribution statistics retrieved.', stats, 200);
});

const getLocationDemand = asyncHandler(async (req, res) => {
  const topPickups = await Booking.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$pickupLocation', count: { $sum: 1 } } },
    { $project: { _id: 0, location: '$_id', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const topDrops = await Booking.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$dropLocation', count: { $sum: 1 } } },
    { $project: { _id: 0, location: '$_id', count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return ApiResponse.success(
    res,
    'Top 10 pickup and drop locations retrieved successfully.',
    { topPickups, topDrops },
    200
  );
});

const getRatingsSummary = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    {
      $match: {
        isDeleted: false,
        driverRating: { $ne: null },
        customerRating: { $ne: null },
      },
    },

    {
      $group: {
        _id: '$vehicleType',
        avgDriverRating: { $avg: '$driverRating' },
        avgCustomerRating: { $avg: '$customerRating' },
        ratedBookingsCount: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: 0,
        vehicleType: '$_id',
        avgDriverRating: { $round: ['$avgDriverRating', 2] },
        avgCustomerRating: { $round: ['$avgCustomerRating', 2] },
        ratedBookingsCount: 1,
      },
    },

    { $sort: { vehicleType: 1 } },
  ]);

  return ApiResponse.success(res, 'Average ratings summary by vehicle type retrieved.', stats, 200);
});

module.exports = {
  getRevenueStats,
  getStatusDistribution,
  getLocationDemand,
  getRatingsSummary,
};
