const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getTotalBookings = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({ isDeleted: false });
  return ApiResponse.success(res, 'Total bookings count fetched successfully.', { count }, 200);
});

const getSuccessRides = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({ bookingStatus: 'Success', isDeleted: false });
  return ApiResponse.success(res, 'Successful rides count fetched successfully.', { count }, 200);
});

const getCancelledRides = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({ bookingStatus: { $regex: /^Canceled/i }, isDeleted: false });
  return ApiResponse.success(res, 'Cancelled rides count fetched successfully.', { count }, 200);
});

const getIncompleteRides = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({ bookingStatus: 'Incomplete', isDeleted: false });
  return ApiResponse.success(res, 'Incomplete rides count fetched successfully.', { count }, 200);
});

const getDriverNotFound = asyncHandler(async (req, res) => {
  const count = await Booking.countDocuments({ bookingStatus: 'Driver Not Found', isDeleted: false });
  return ApiResponse.success(res, 'Driver not found rides count fetched successfully.', { count }, 200);
});

const getTotalCustomers = asyncHandler(async (req, res) => {
  const count = await Customer.countDocuments({ isDeleted: false });
  return ApiResponse.success(res, 'Total customers count fetched successfully.', { count }, 200);
});

const getTopVehicle = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    { $match: { isDeleted: false, vehicleType: { $ne: null } } },
    { $group: { _id: '$vehicleType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const vehicleType = stats.length > 0 ? stats[0]._id : null;
  const count = stats.length > 0 ? stats[0].count : 0;

  return ApiResponse.success(res, 'Top vehicle type fetched successfully.', { vehicleType, count }, 200);
});

const getTopPaymentMethod = asyncHandler(async (req, res) => {
  const stats = await Booking.aggregate([
    { $match: { isDeleted: false, paymentMethod: { $ne: null, $ne: '' } } },
    { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const paymentMethod = stats.length > 0 ? stats[0]._id : null;
  const count = stats.length > 0 ? stats[0].count : 0;

  return ApiResponse.success(res, 'Top payment method fetched successfully.', { paymentMethod, count }, 200);
});

const getHighestFare = asyncHandler(async (req, res) => {
  const highestBooking = await Booking.findOne({ isDeleted: false, bookingValue: { $ne: null } })
    .sort({ bookingValue: -1 })
    .select('bookingId bookingValue customerId vehicleType pickupLocation dropLocation date');

  return ApiResponse.success(res, 'Highest fare fetched successfully.', highestBooking || null, 200);
});

const getLowestFare = asyncHandler(async (req, res) => {
  const lowestBooking = await Booking.findOne({ isDeleted: false, bookingValue: { $ne: null } })
    .sort({ bookingValue: 1 })
    .select('bookingId bookingValue customerId vehicleType pickupLocation dropLocation date');

  return ApiResponse.success(res, 'Lowest fare fetched successfully.', lowestBooking || null, 200);
});

module.exports = {
  getTotalBookings,
  getSuccessRides,
  getCancelledRides,
  getIncompleteRides,
  getDriverNotFound,
  getTotalCustomers,
  getTopVehicle,
  getTopPaymentMethod,
  getHighestFare,
  getLowestFare,
};
