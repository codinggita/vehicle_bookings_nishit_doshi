const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');


const getCustomers = asyncHandler(async (req, res) => {
  const page  = Math.max(parseInt(req.query.page  || '1',  10), 1);
  const limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
  const skip  = (page - 1) * limit;

  const result = await Booking.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$customerId',
        totalBookings:   { $sum: 1 },
        totalSpent:      { $sum: '$bookingValue' },
        avgDriverRating: { $avg: '$driverRating' },
        lastBookingDate: { $max: '$date' },
      },
    },
    { $sort: { totalBookings: -1 } },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        customers: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const total     = result[0].metadata[0]?.total || 0;
  const customers = result[0].customers;

  return ApiResponse.success(res, 'Customers fetched successfully.', {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    customers,
  }, 200);
});

const getVehicles = asyncHandler(async (req, res) => {
  const page  = Math.max(parseInt(req.query.page  || '1', 10), 1);
  const limit = Math.min(parseInt(req.query.limit || '5', 10), 100);
  const skip  = (page - 1) * limit;

  const result = await Booking.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$vehicleType',
        totalBookings:  { $sum: 1 },
        totalRevenue:   { $sum: '$bookingValue' },
        totalDistance:  { $sum: '$rideDistance' },
        avgDriverRating:{ $avg: '$driverRating' },
      },
    },
    { $sort: { totalBookings: -1 } },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        vehicles: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ]);

  const total    = result[0].metadata[0]?.total || 0;
  const vehicles = result[0].vehicles;

  return ApiResponse.success(res, 'Vehicles fetched successfully.', {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    vehicles,
  }, 200);
});

const getSuccessRides = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const query = { bookingStatus: 'Success', isDeleted: false };
  const data  = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Successful rides fetched successfully.', data, 200);
});

const getCancelledRides = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const query = {
    bookingStatus: { $in: ['Canceled by Customer', 'Canceled by Driver'] },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Cancelled rides fetched successfully.', data, 200);
});


const getIncompleteRides = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const query = {
    incompleteRides: { $exists: true, $ne: null },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Incomplete rides fetched successfully.', data, 200);
});

const getRatings = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const query = {
    driverRating:   { $exists: true, $ne: null },
    customerRating: { $exists: true, $ne: null },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy: sortBy || 'driverRating:desc' });
  return ApiResponse.success(res, 'Rated bookings fetched successfully.', data, 200);
});

const getPayments = asyncHandler(async (req, res) => {
  const { page, limit, sortBy } = req.query;
  const query = {
    paymentMethod: { $exists: true, $ne: null },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Payment records fetched successfully.', data, 200);
});

const getAdminBookings = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, showDeleted } = req.query;

  const query = showDeleted === 'true' ? {} : { isDeleted: false };
  const data  = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Admin: All bookings fetched successfully.', data, 200);
});

module.exports = {
  getCustomers,
  getVehicles,
  getSuccessRides,
  getCancelledRides,
  getIncompleteRides,
  getRatings,
  getPayments,
  getAdminBookings,
};
