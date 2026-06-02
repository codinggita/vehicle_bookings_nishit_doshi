const Driver = require('../models/Driver');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createDriver = asyncHandler(async (req, res) => {
  const { driverId, name, phone, rating } = req.body;

  if (!driverId || !name) {
    return ApiResponse.error(res, 'driverId and name fields are required.', null, 400);
  }

  const driverExists = await Driver.findOne({ driverId });
  if (driverExists) {
    return ApiResponse.error(res, `Driver with ID ${driverId} already exists.`, null, 400);
  }

  const driver = await Driver.create({
    driverId,
    name,
    phone,
    rating: rating !== undefined ? Number(rating) : 0,
  });

  return ApiResponse.success(res, 'Driver created successfully.', driver, 201);
});

const bulkInsertDrivers = asyncHandler(async (req, res) => {
  const { drivers } = req.body;

  if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
    return ApiResponse.error(res, 'Please provide a non-empty array of driver objects in the drivers field.', null, 400);
  }

  const result = await Driver.insertMany(drivers, { ordered: false });
  return ApiResponse.success(res, `${result.length} drivers inserted successfully.`, result, 201);
});

const deleteDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.params;

  const driver = await Driver.findOne({ driverId, isDeleted: false });
  if (!driver) {
    return ApiResponse.error(res, `Driver with ID ${driverId} not found.`, null, 404);
  }

  driver.isDeleted = true;
  await driver.save();

  return ApiResponse.success(res, `Driver ${driverId} deleted successfully.`, null, 200);
});

const deleteAllDrivers = asyncHandler(async (req, res) => {
  const result = await Driver.deleteMany({});
  return ApiResponse.success(res, `All drivers deleted successfully. Count: ${result.deletedCount}`, null, 200);
});

module.exports = {
  createDriver,
  bulkInsertDrivers,
  deleteDriver,
  deleteAllDrivers,
};
