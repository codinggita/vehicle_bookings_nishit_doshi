const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  searchGeneral,
  searchByBookingId,
  searchByCustomerId,
  searchByPaymentMethod,
  searchByVehicleType,
  searchByLocation,
  searchByCancelReason,
  searchByIncompleteReason,
  searchByRating,
} = require('../controllers/searchController');
const { searchLimiter } = require('../middlewares/rateLimiter');

const optionsHandler = require('../utils/optionsHandler');

const router = express.Router();

router.options('/', optionsHandler(['GET', 'OPTIONS']));

router.use(protect);
router.use(searchLimiter);

router.get('/', searchGeneral);
router.get('/bookings', searchByBookingId);
router.get('/customers', searchByCustomerId);

router.get('/payment', searchByPaymentMethod);
router.get('/vehicle', searchByVehicleType);
router.get('/location', searchByLocation);
router.get('/cancel-reason', searchByCancelReason);
router.get('/incomplete', searchByIncompleteReason);
router.get('/rating', searchByRating);

module.exports = router;
