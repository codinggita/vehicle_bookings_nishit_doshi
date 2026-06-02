const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');


const getByBookingId = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking) {
    return ApiResponse.error(res, `No booking found with ID: ${bookingId}`, null, 404);
  }

  return ApiResponse.success(res, 'Booking fetched by booking ID.', booking, 200);
});

const getByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { bookingStatus: { $regex: status, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with status "${status}" fetched.`, data, 200);
});

const getByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { customerId, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings for customer "${customerId}" fetched.`, data, 200);
});

const getByVehicleType = asyncHandler(async (req, res) => {
  const { vehicleType } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { vehicleType: { $regex: vehicleType, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings for vehicle type "${vehicleType}" fetched.`, data, 200);
});

const getByPaymentMethod = asyncHandler(async (req, res) => {
  const { method } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { paymentMethod: { $regex: method, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with payment method "${method}" fetched.`, data, 200);
});

const getByPickupLocation = asyncHandler(async (req, res) => {
  const { location } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { pickupLocation: { $regex: location, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with pickup location "${location}" fetched.`, data, 200);
});

const getByDropLocation = asyncHandler(async (req, res) => {
  const { location } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { dropLocation: { $regex: location, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with drop location "${location}" fetched.`, data, 200);
});

const getByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const { page, limit, sortBy } = req.query;

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  if (isNaN(start)) {
    return ApiResponse.error(res, 'Invalid date format. Use YYYY-MM-DD.', null, 400);
  }

  const query = { date: { $gte: start, $lt: end }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings on date "${date}" fetched.`, data, 200);
});

const getByTime = asyncHandler(async (req, res) => {
  const { time } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { time: { $regex: `^${time}`, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings at time "${time}" fetched.`, data, 200);
});

const getByDriverRating = asyncHandler(async (req, res) => {
  const rating = parseFloat(req.params.rating);
  const { page, limit, sortBy } = req.query;

  if (isNaN(rating)) {
    return ApiResponse.error(res, 'Rating must be a valid number.', null, 400);
  }

  const query = { driverRating: rating, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with driver rating ${rating} fetched.`, data, 200);
});


const getByCustomerRating = asyncHandler(async (req, res) => {
  const rating = parseFloat(req.params.rating);
  const { page, limit, sortBy } = req.query;

  if (isNaN(rating)) {
    return ApiResponse.error(res, 'Rating must be a valid number.', null, 400);
  }

  const query = { customerRating: rating, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with customer rating ${rating} fetched.`, data, 200);
});

const getByDistance = asyncHandler(async (req, res) => {
  const distance = parseFloat(req.params.distance);
  const { page, limit, sortBy } = req.query;

  if (isNaN(distance)) {
    return ApiResponse.error(res, 'Distance must be a valid number.', null, 400);
  }

  const query = { rideDistance: distance, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with ride distance ${distance} fetched.`, data, 200);
});

const getByValue = asyncHandler(async (req, res) => {
  const amount = parseFloat(req.params.amount);
  const { page, limit, sortBy } = req.query;

  if (isNaN(amount)) {
    return ApiResponse.error(res, 'Amount must be a valid number.', null, 400);
  }

  const query = { bookingValue: amount, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with value ${amount} fetched.`, data, 200);
});

const getByIncompleteStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { incompleteRides: { $regex: status, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Incomplete bookings with status "${status}" fetched.`, data, 200);
});

const getByIncompleteReason = asyncHandler(async (req, res) => {
  const { reason } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { incompleteRidesReason: { $regex: reason, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with incomplete reason "${reason}" fetched.`, data, 200);
});

const getByCancelCustomer = asyncHandler(async (req, res) => {
  const { reason } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { canceledRidesByCustomer: { $regex: reason, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings cancelled by customer with reason "${reason}" fetched.`, data, 200);
});

const getByCancelDriver = asyncHandler(async (req, res) => {
  const { reason } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { canceledRidesByDriver: { $regex: reason, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings cancelled by driver with reason "${reason}" fetched.`, data, 200);
});

const getByVtat = asyncHandler(async (req, res) => {
  const minutes = parseFloat(req.params.minutes);
  const { page, limit, sortBy } = req.query;

  if (isNaN(minutes)) {
    return ApiResponse.error(res, 'VTAT minutes must be a valid number.', null, 400);
  }

  const query = { vTat: minutes, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with VTAT of ${minutes} minutes fetched.`, data, 200);
});

const getByCtat = asyncHandler(async (req, res) => {
  const minutes = parseFloat(req.params.minutes);
  const { page, limit, sortBy } = req.query;

  if (isNaN(minutes)) {
    return ApiResponse.error(res, 'CTAT minutes must be a valid number.', null, 400);
  }

  const query = { cTat: minutes, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with CTAT of ${minutes} minutes fetched.`, data, 200);
});

const getByDay = asyncHandler(async (req, res) => {
  const day = parseInt(req.params.day, 10);
  const { page, limit, sortBy } = req.query;

  if (isNaN(day) || day < 1 || day > 31) {
    return ApiResponse.error(res, 'Day must be a number between 1 and 31.', null, 400);
  }

  const query = {
    $expr: { $eq: [{ $dayOfMonth: '$date' }, day] },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings on day ${day} of the month fetched.`, data, 200);
});


const getByMonth = asyncHandler(async (req, res) => {
  const month = parseInt(req.params.month, 10);
  const { page, limit, sortBy } = req.query;

  if (isNaN(month) || month < 1 || month > 12) {
    return ApiResponse.error(res, 'Month must be a number between 1 and 12.', null, 400);
  }

  const query = {
    $expr: { $eq: [{ $month: '$date' }, month] },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings in month ${month} fetched.`, data, 200);
});

const getByYear = asyncHandler(async (req, res) => {
  const year = parseInt(req.params.year, 10);
  const { page, limit, sortBy } = req.query;

  if (isNaN(year)) {
    return ApiResponse.error(res, 'Year must be a valid number.', null, 400);
  }

  const query = {
    $expr: { $eq: [{ $year: '$date' }, year] },
    isDeleted: false,
  };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings in year ${year} fetched.`, data, 200);
});

const getByHour = asyncHandler(async (req, res) => {
  const hour = parseInt(req.params.hour, 10);
  const { page, limit, sortBy } = req.query;

  if (isNaN(hour) || hour < 0 || hour > 23) {
    return ApiResponse.error(res, 'Hour must be a number between 0 and 23.', null, 400);
  }

  const paddedHour = String(hour).padStart(2, '0');
  const query = { time: { $regex: `^${paddedHour}:`, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings in hour ${hour} fetched.`, data, 200);
});

const getByMinute = asyncHandler(async (req, res) => {
  const minute = parseInt(req.params.minute, 10);
  const { page, limit, sortBy } = req.query;

  if (isNaN(minute) || minute < 0 || minute > 59) {
    return ApiResponse.error(res, 'Minute must be a number between 0 and 59.', null, 400);
  }

  const paddedMinute = String(minute).padStart(2, '0');
  const query = { time: { $regex: `^\\d{2}:${paddedMinute}`, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings at minute ${minute} fetched.`, data, 200);
});

const getBySource = asyncHandler(async (req, res) => {
  const { pickup } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { pickupLocation: { $regex: pickup, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with pickup source "${pickup}" fetched.`, data, 200);
});

const getByDestination = asyncHandler(async (req, res) => {
  const { drop } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { dropLocation: { $regex: drop, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with destination "${drop}" fetched.`, data, 200);
});

const getByVehicleImage = asyncHandler(async (req, res) => {
  const { imageName } = req.params;
  const { page, limit, sortBy } = req.query;

  const query = { vehicleImage: { $regex: imageName, $options: 'i' }, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with vehicle image "${imageName}" fetched.`, data, 200);
});

const getByFare = asyncHandler(async (req, res) => {
  const value = parseFloat(req.params.value);
  const { page, limit, sortBy } = req.query;

  if (isNaN(value)) {
    return ApiResponse.error(res, 'Fare value must be a valid number.', null, 400);
  }

  const query = { bookingValue: value, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy });

  return ApiResponse.success(res, `Bookings with fare ${value} fetched.`, data, 200);
});

const getCustomerHistory = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { page, limit } = req.query;

  const query = { customerId, isDeleted: false };
  const data = await paginate(Booking, query, { page, limit, sortBy: 'date:desc' });

  return ApiResponse.success(res, `Booking history for customer "${customerId}" fetched.`, data, 200);
});

const getCustomerLatest = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const booking = await Booking.findOne({ customerId, isDeleted: false }).sort({ date: -1 });

  if (!booking) {
    return ApiResponse.error(res, `No bookings found for customer "${customerId}".`, null, 404);
  }

  return ApiResponse.success(res, `Latest booking for customer "${customerId}" fetched.`, booking, 200);
});

module.exports = {
  getByBookingId,
  getByStatus,
  getByCustomer,
  getByVehicleType,
  getByPaymentMethod,
  getByPickupLocation,
  getByDropLocation,
  getByDate,
  getByTime,
  getByDriverRating,
  getByCustomerRating,
  getByDistance,
  getByValue,
  getByIncompleteStatus,
  getByIncompleteReason,
  getByCancelCustomer,
  getByCancelDriver,
  getByVtat,
  getByCtat,
  getByDay,
  getByMonth,
  getByYear,
  getByHour,
  getByMinute,
  getBySource,
  getByDestination,
  getByVehicleImage,
  getByFare,
  getCustomerHistory,
  getCustomerLatest,
};
