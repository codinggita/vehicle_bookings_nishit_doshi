const Booking = require('../models/Booking');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const paginate = require('../utils/paginate');

const getBookings = asyncHandler(async (req, res) => {
  const {
    page, limit, sortBy,
    vehicleType, customerId, paymentMethod,
    search, minVal, maxVal,
    status, vehicle, payment, pickup, drop,
    date, time, driverRating, customer,
    customerRating, minFare, maxFare,
    minDistance, maxDistance,
    incomplete, cancelledByDriver,
    cancelledByCustomer, sort,
    minRating, maxRating,
    distanceAbove, distanceBelow,
    month, year, hour,
  } = req.query;

  const query = { isDeleted: false };
  const exprConditions = []; 


  if (status) query.bookingStatus = { $regex: status, $options: 'i' };

  if (vehicle) query.vehicleType = { $regex: vehicle, $options: 'i' };
  else if (vehicleType) query.vehicleType = { $regex: vehicleType, $options: 'i' };

  if (payment) query.paymentMethod = { $regex: payment, $options: 'i' };
  else if (paymentMethod) query.paymentMethod = { $regex: paymentMethod, $options: 'i' };

  if (pickup) query.pickupLocation = { $regex: pickup, $options: 'i' };

  if (drop) query.dropLocation = { $regex: drop, $options: 'i' };

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    if (!isNaN(start)) query.date = { $gte: start, $lt: end };
  }

  if (time) query.time = { $regex: `^${time}`, $options: 'i' };

  if (driverRating !== undefined) query.driverRating = parseFloat(driverRating);


  if (customer) query.customerId = customer;
  else if (customerId) query.customerId = customerId;

  if (customerRating !== undefined) query.customerRating = parseFloat(customerRating);

  const fareMin = minFare || minVal;
  const fareMax = maxFare || maxVal;
  if (fareMin || fareMax) {
    query.bookingValue = {};
    if (fareMin) query.bookingValue.$gte = Number(fareMin);
    if (fareMax) query.bookingValue.$lte = Number(fareMax);
  }

  if (minDistance || maxDistance) {
    query.rideDistance = query.rideDistance || {};
    if (minDistance) query.rideDistance.$gte = Number(minDistance);
    if (maxDistance) query.rideDistance.$lte = Number(maxDistance);
  }

  if (incomplete) query.incompleteRides = { $regex: incomplete, $options: 'i' };

  if (cancelledByDriver === 'true') {
    query.canceledRidesByDriver = { $exists: true, $ne: null };
  }


  if (cancelledByCustomer === 'true') {
    query.canceledRidesByCustomer = { $exists: true, $ne: null };
  }

  if (minRating || maxRating) {
    query.driverRating = query.driverRating || {};
    if (minRating) query.driverRating.$gte = parseFloat(minRating);
    if (maxRating) query.driverRating.$lte = parseFloat(maxRating);
  }

  if (distanceAbove) {
    query.rideDistance = query.rideDistance || {};
    query.rideDistance.$gt = Number(distanceAbove);
  }

  if (distanceBelow) {
    query.rideDistance = query.rideDistance || {};
    query.rideDistance.$lt = Number(distanceBelow);
  }


  if (month) {
    exprConditions.push({ $eq: [{ $month: '$date' }, parseInt(month, 10)] });
  }

  if (year) {
    exprConditions.push({ $eq: [{ $year: '$date' }, parseInt(year, 10)] });
  }

  if (hour !== undefined) {
    const paddedHour = String(parseInt(hour, 10)).padStart(2, '0');
    query.time = { $regex: `^${paddedHour}:`, $options: 'i' };
  }

  if (exprConditions.length > 0) {
    query.$expr = exprConditions.length === 1
      ? exprConditions[0]
      : { $and: exprConditions };
  }

  if (search) {
    query.$or = [
      { pickupLocation: { $regex: search, $options: 'i' } },
      { dropLocation:   { $regex: search, $options: 'i' } },
      { bookingId:      { $regex: search, $options: 'i' } },
    ];
  }

  const sortFieldMap = {
    'Booking_Value':   'bookingValue',   
    'Ride_Distance':   'rideDistance',   
    'Driver_Ratings':  'driverRating',   
    'Customer_Rating': 'customerRating', 
    'Date':            'date',           
    'Vehicle_Type':    'vehicleType',    
    'Payment_Method':  'paymentMethod',  
    'Pickup_Location': 'pickupLocation', 
    'Drop_Location':   'dropLocation',   
    'Booking_Status':  'bookingStatus',  
  };

  let resolvedSortBy = sortBy;
  if (sort) {
    const isDesc  = sort.startsWith('-');
    const key     = isDesc ? sort.slice(1) : sort;
    const field   = sortFieldMap[key] || key;
    resolvedSortBy = `${field}:${isDesc ? 'desc' : 'asc'}`;
  }


  const data = await paginate(Booking, query, { page, limit, sortBy: resolvedSortBy });
  return ApiResponse.success(res, 'Bookings fetched successfully.', data, 200);
});

const getBookingById = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  return ApiResponse.success(res, 'Booking fetched successfully.', booking, 200);
});

const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingId, date, time, bookingStatus, customerId, vehicleType,
    pickupLocation, dropLocation, vTat, cTat, canceledRidesByCustomer,
    canceledRidesByDriver, incompleteRides, incompleteRidesReason,
    bookingValue, paymentMethod, rideDistance, driverRating,
    customerRating, vehicleImage,
  } = req.body;

  const bookingExists = await Booking.findOne({ bookingId });
  if (bookingExists) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} already exists.`, null, 400);
  }

  const booking = await Booking.create({
    bookingId,
    date: date ? new Date(date) : new Date(),
    time: time || '00:00:00',
    bookingStatus: bookingStatus || 'Success',
    customerId: customerId || req.user.customerId || 'UNKNOWN',
    vehicleType,
    pickupLocation,
    dropLocation,
    vTat: vTat !== undefined ? vTat : null,
    cTat: cTat !== undefined ? cTat : null,
    canceledRidesByCustomer: canceledRidesByCustomer || null,
    canceledRidesByDriver: canceledRidesByDriver || null,
    incompleteRides: incompleteRides || null,
    incompleteRidesReason: incompleteRidesReason || null,
    bookingValue: Number(bookingValue) || 0,
    paymentMethod: paymentMethod || null,
    rideDistance: Number(rideDistance) || 0,
    driverRating: driverRating !== undefined ? driverRating : null,
    customerRating: customerRating !== undefined ? customerRating : null,
    vehicleImage: vehicleImage || null,
  });

  return ApiResponse.success(res, 'Booking created successfully.', booking, 201);
});

const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  const fieldsToUpdate = [
    'bookingStatus', 'vehicleType', 'pickupLocation', 'dropLocation',
    'vTat', 'cTat', 'canceledRidesByCustomer', 'canceledRidesByDriver',
    'incompleteRides', 'incompleteRidesReason', 'bookingValue',
    'paymentMethod', 'rideDistance', 'driverRating', 'customerRating', 'vehicleImage',
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) booking[field] = req.body[field];
  });

  const updatedBooking = await booking.save();
  return ApiResponse.success(res, 'Booking updated successfully.', updatedBooking, 200);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { bookingStatus } = req.body;

  if (!bookingStatus) {
    return ApiResponse.error(res, 'bookingStatus field is required.', null, 400);
  }

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  booking.bookingStatus = bookingStatus;
  const updatedBooking = await booking.save();
  return ApiResponse.success(res, 'Booking status updated successfully.', updatedBooking, 200);
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  let booking = await Booking.findOne({ bookingId, isDeleted: false });
  if (!booking && bookingId.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findOne({ _id: bookingId, isDeleted: false });
  }

  if (!booking) {
    return ApiResponse.error(res, `Booking with ID ${bookingId} not found.`, null, 404);
  }

  booking.isDeleted = true;
  await booking.save();
  return ApiResponse.success(res, `Booking ${bookingId} deleted successfully.`, null, 200);
});

const bulkInsertBookings = asyncHandler(async (req, res) => {
  const { bookings } = req.body;

  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
    return ApiResponse.error(res, 'Please provide a non-empty array of booking objects in the bookings field.', null, 400);
  }

  const preparedBookings = bookings.map((b) => ({
    ...b,
    date: b.date ? new Date(b.date) : new Date(),
    time: b.time || '00:00:00',
    bookingStatus: b.bookingStatus || 'Success',
    customerId: b.customerId || 'UNKNOWN',
    bookingValue: Number(b.bookingValue) || 0,
    rideDistance: Number(b.rideDistance) || 0,
    isDeleted: false,
  }));

  const result = await Booking.insertMany(preparedBookings, { ordered: false });
  return ApiResponse.success(res, `${result.length} bookings inserted successfully.`, result, 201);
});

const deleteAllBookings = asyncHandler(async (req, res) => {
  const result = await Booking.deleteMany({});
  return ApiResponse.success(res, `All bookings deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

const deleteAllCancelledBookings = asyncHandler(async (req, res) => {
  const result = await Booking.deleteMany({
    bookingStatus: { $regex: /^Canceled/i }
  });
  return ApiResponse.success(res, `All cancelled bookings deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  bulkInsertBookings,
  deleteAllBookings,
  deleteAllCancelledBookings,
};
