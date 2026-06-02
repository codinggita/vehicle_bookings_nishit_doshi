const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

const searchGeneral = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, keyword } = req.query;

  const query = { isDeleted: false };

  if (keyword) {
    query.$or = [
      { pickupLocation: { $regex: keyword, $options: 'i' } },
      { dropLocation: { $regex: keyword, $options: 'i' } },
      { vehicleType: { $regex: keyword, $options: 'i' } },
      { bookingStatus: { $regex: keyword, $options: 'i' } },
      { paymentMethod: { $regex: keyword, $options: 'i' } },
    ];
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'General search results fetched successfully.', data, 200);
});

const searchByBookingId = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, bookingId } = req.query;

  const query = { isDeleted: false };

  if (bookingId) {
    query.bookingId = { $regex: bookingId, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Booking ID search results fetched successfully.', data, 200);
});

const searchByCustomerId = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, customerId } = req.query;

  const query = { isDeleted: false };

  if (customerId) {
    query.customerId = { $regex: customerId, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Customer ID search results fetched successfully.', data, 200);
});

const searchByPaymentMethod = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, method } = req.query;

  const query = { isDeleted: false };

  if (method) {
    query.paymentMethod = { $regex: method, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Payment search results fetched successfully.', data, 200);
});

const searchByVehicleType = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, type } = req.query;

  const query = { isDeleted: false };

  if (type) {
    query.vehicleType = { $regex: type, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Vehicle search results fetched successfully.', data, 200);
});

const searchByLocation = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, pickup, drop } = req.query;

  const query = { isDeleted: false };

  if (pickup) {
    query.pickupLocation = { $regex: pickup, $options: 'i' };
  }
  if (drop) {
    query.dropLocation = { $regex: drop, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Location search results fetched successfully.', data, 200);
});

const searchByCancelReason = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, reason } = req.query;

  const query = { isDeleted: false };

  if (reason) {
    query.$or = [
      { canceledRidesByCustomer: { $regex: reason, $options: 'i' } },
      { canceledRidesByDriver: { $regex: reason, $options: 'i' } },
    ];
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Cancel reason search results fetched successfully.', data, 200);
});

const searchByIncompleteReason = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, reason } = req.query;

  const query = { isDeleted: false };

  if (reason) {
    query.incompleteRidesReason = { $regex: reason, $options: 'i' };
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Incomplete rides reason search results fetched successfully.', data, 200);
});

const searchByRating = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, driver, customer } = req.query;

  const query = { isDeleted: false };

  if (driver !== undefined) {
    const driverNum = parseFloat(driver);
    if (!isNaN(driverNum)) query.driverRating = driverNum;
  }
  if (customer !== undefined) {
    const customerNum = parseFloat(customer);
    if (!isNaN(customerNum)) query.customerRating = customerNum;
  }

  const data = await paginate(Booking, query, { page, limit, sortBy });
  return ApiResponse.success(res, 'Rating search results fetched successfully.', data, 200);
});

module.exports = {
  searchGeneral,
  searchByBookingId,
  searchByCustomerId,
  searchByPaymentMethod,
  searchByVehicleType,
  searchByLocation,
  searchByCancelReason,
  searchByIncompleteReason,
  searchByRating,
};
