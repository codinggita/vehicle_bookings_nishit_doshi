const Log = require('../models/Log');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const deleteLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let log = await Log.findByIdAndDelete(id);
  if (!log) {
    log = await Log.findOneAndDelete({ _id: id });
  }

  if (!log) {
    return ApiResponse.error(res, `Log record with ID ${id} not found.`, null, 404);
  }

  return ApiResponse.success(res, `Log record ${id} deleted successfully.`, null, 200);
});

module.exports = {
  deleteLog,
};
