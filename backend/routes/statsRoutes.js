const express = require('express');
const { protect } = require('../middlewares/auth');
const {
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
} = require('../controllers/statsController');

const router = express.Router();

router.use(protect);

router.get('/total-bookings', getTotalBookings);
router.get('/success-rides', getSuccessRides);
router.get('/cancelled-rides', getCancelledRides);
router.get('/incomplete-rides', getIncompleteRides);
router.get('/driver-not-found', getDriverNotFound);
router.get('/total-customers', getTotalCustomers);
router.get('/top-vehicle', getTopVehicle);
router.get('/top-payment-method', getTopPaymentMethod);
router.get('/highest-fare', getHighestFare);
router.get('/lowest-fare', getLowestFare);

module.exports = router;
