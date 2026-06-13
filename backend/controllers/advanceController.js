const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// GET /bookings/top/highest-fare
const getHighestFareBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const bookings = await Booking.find({ isDeleted: false })
    .sort({ bookingValue: -1 })
    .limit(limit);
  return ApiResponse.success(res, 'Highest fare bookings fetched successfully.', bookings, 200);
});

// GET /bookings/top/lowest-fare
const getLowestFareBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const bookings = await Booking.find({ isDeleted: false })
    .sort({ bookingValue: 1 })
    .limit(limit);
  return ApiResponse.success(res, 'Lowest fare bookings fetched successfully.', bookings, 200);
});

// GET /bookings/recent
const getRecentBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const bookings = await Booking.find({ isDeleted: false })
    .sort({ date: -1 })
    .limit(limit);
  return ApiResponse.success(res, 'Recent bookings fetched successfully.', bookings, 200);
});

// GET /bookings/latest
const getLatestBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  const bookings = await Booking.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit);
  return ApiResponse.success(res, 'Latest bookings fetched successfully.', bookings, 200);
});

// GET /bookings/random
const getRandomBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 1;
  const bookings = await Booking.aggregate([
    { $match: { isDeleted: false } },
    { $sample: { size: limit } }
  ]);
  return ApiResponse.success(res, 'Random bookings fetched successfully.', bookings, 200);
});

// GET /bookings/trending
const getTrendingBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;
  // Trending can be highly-rated bookings with high values
  const bookings = await Booking.find({ 
    isDeleted: false, 
    customerRating: { $gte: 4.5 } 
  })
    .sort({ bookingValue: -1 })
    .limit(limit);
  return ApiResponse.success(res, 'Trending bookings fetched successfully.', bookings, 200);
});

// GET /bookings/success
const getSuccessBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const bookings = await Booking.find({ bookingStatus: 'Success', isDeleted: false })
    .limit(limit);
  return ApiResponse.success(res, 'Successful rides fetched successfully.', bookings, 200);
});

// GET /bookings/cancelled
const getCancelledBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const bookings = await Booking.find({ 
    bookingStatus: { $regex: /^Canceled/i }, 
    isDeleted: false 
  }).limit(limit);
  return ApiResponse.success(res, 'Cancelled rides fetched successfully.', bookings, 200);
});

// GET /bookings/incomplete
const getIncompleteBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const bookings = await Booking.find({ bookingStatus: 'Incomplete', isDeleted: false })
    .limit(limit);
  return ApiResponse.success(res, 'Incomplete rides fetched successfully.', bookings, 200);
});

// GET /bookings/driver-not-found
const getDriverNotFoundBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const bookings = await Booking.find({ bookingStatus: 'Driver Not Found', isDeleted: false })
    .limit(limit);
  return ApiResponse.success(res, 'Driver not found rides fetched successfully.', bookings, 200);
});

// GET /health
const getHealth = asyncHandler(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const healthData = {
    status: 'UP',
    uptime: Math.round(process.uptime()),
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  return ApiResponse.success(res, 'API health status fetched successfully.', healthData, 200);
});

// GET /version
const getVersion = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'API version fetched successfully.', { version: '1.0.0' }, 200);
});

// GET /compare?booking1=CNR111&booking2=CNR222
const compareBookings = asyncHandler(async (req, res) => {
  const { booking1: id1, booking2: id2 } = req.query;

  if (!id1 || !id2) {
    return ApiResponse.error(res, 'Please provide both booking1 and booking2 query parameters.', null, 400);
  }

  const findBooking = async (id) => {
    let booking = await Booking.findOne({ bookingId: id, isDeleted: false });
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findOne({ _id: id, isDeleted: false });
    }
    return booking;
  };

  const b1 = await findBooking(id1);
  const b2 = await findBooking(id2);

  if (!b1 || !b2) {
    const missing = [];
    if (!b1) missing.push(id1);
    if (!b2) missing.push(id2);
    return ApiResponse.error(res, `Booking(s) not found: ${missing.join(', ')}`, null, 404);
  }

  const comparison = {
    booking1: {
      bookingId: b1.bookingId,
      bookingValue: b1.bookingValue,
      rideDistance: b1.rideDistance,
      driverRating: b1.driverRating,
      customerRating: b1.customerRating,
      bookingStatus: b1.bookingStatus,
      vehicleType: b1.vehicleType
    },
    booking2: {
      bookingId: b2.bookingId,
      bookingValue: b2.bookingValue,
      rideDistance: b2.rideDistance,
      driverRating: b2.driverRating,
      customerRating: b2.customerRating,
      bookingStatus: b2.bookingStatus,
      vehicleType: b2.vehicleType
    },
    comparisonMetrics: {
      valueDifference: b1.bookingValue - b2.bookingValue,
      distanceDifference: b1.rideDistance - b2.rideDistance,
      driverRatingDifference: (b1.driverRating || 0) - (b2.driverRating || 0),
      customerRatingDifference: (b1.customerRating || 0) - (b2.customerRating || 0),
      moreExpensive: b1.bookingValue > b2.bookingValue ? b1.bookingId : (b2.bookingValue > b1.bookingValue ? b2.bookingId : 'equal'),
      longerDistance: b1.rideDistance > b2.rideDistance ? b1.bookingId : (b2.rideDistance > b1.rideDistance ? b2.bookingId : 'equal')
    }
  };

  return ApiResponse.success(res, 'Bookings comparison generated successfully.', comparison, 200);
});

// GET /bookings/summary/ai
const getAISummary = asyncHandler(async (req, res) => {
  // Aggregate statistics to generate a realistic AI summary
  const totalCount = await Booking.countDocuments({ isDeleted: false });
  
  if (totalCount === 0) {
    return ApiResponse.success(res, 'AI summary generated successfully.', {
      summary: 'No bookings data available in the system yet. Please seed or insert booking data to generate insights.'
    }, 200);
  }

  const avgStats = await Booking.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        avgFare: { $avg: '$bookingValue' },
        avgDistance: { $avg: '$rideDistance' },
        avgDriverRating: { $avg: '$driverRating' }
      }
    }
  ]);

  const topVehicleAgg = await Booking.aggregate([
    { $match: { isDeleted: false, vehicleType: { $ne: null } } },
    { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const successCount = await Booking.countDocuments({ bookingStatus: 'Success', isDeleted: false });

  const avgFare = avgStats[0] ? Math.round(avgStats[0].avgFare) : 0;
  const avgDistance = avgStats[0] ? Math.round(avgStats[0].avgDistance * 10) / 10 : 0;
  const topVehicle = topVehicleAgg[0] ? topVehicleAgg[0]._id : 'N/A';
  const successRate = Math.round((successCount / totalCount) * 100);

  const aiInsights = `AI Booking Analysis: Based on the analysis of ${totalCount} records, the platform shows robust performance with a ride completion success rate of ${successRate}%. The average booking value stands at ₹${avgFare} over a mean distance of ${avgDistance} km per ride. "${topVehicle}" is the dominant vehicle class selected by customers. Recommendation: Optimize vehicle supply for "${topVehicle}" during peak hours to further reduce wait times (TAT) and enhance customer satisfaction scores.`;

  return ApiResponse.success(res, 'AI booking summary generated successfully.', {
    totalBookingsChecked: totalCount,
    successRate: `${successRate}%`,
    averageBookingValue: avgFare,
    topVehicleClass: topVehicle,
    summary: aiInsights
  }, 200);
});

module.exports = {
  getHighestFareBookings,
  getLowestFareBookings,
  getRecentBookings,
  getLatestBookings,
  getRandomBookings,
  getTrendingBookings,
  getSuccessBookings,
  getCancelledBookings,
  getIncompleteBookings,
  getDriverNotFoundBookings,
  getHealth,
  getVersion,
  compareBookings,
  getAISummary
};
