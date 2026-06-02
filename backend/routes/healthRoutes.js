const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/apiResponse');

router.get('/', (req, res) => {
  return ApiResponse.success(
    res,
    'Server is healthy and running.',
    {
      uptime: Math.round(process.uptime()),
      timestamp: new Date(),
      env: process.env.NODE_ENV || 'development',
    },
    200
  );
});

module.exports = router;
