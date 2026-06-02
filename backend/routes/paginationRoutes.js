const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const { deleteAllCancelledBookings } = require('../controllers/bookingController');
const {
  getCustomers,
  getVehicles,
  getSuccessRides,
  getCancelledRides,
  getIncompleteRides,
  getRatings,
  getPayments,
} = require('../controllers/paginationController');

const router = express.Router();

router.use(protect);


router.get('/customers',       getCustomers);

router.get('/vehicles',        getVehicles);

router.get('/success-rides',   getSuccessRides);

router.get('/cancelled-rides', getCancelledRides);
router.delete('/cancelled-rides/delete-all', deleteAllCancelledBookings);


router.get('/incomplete-rides', getIncompleteRides);

router.get('/ratings',          getRatings);

router.get('/payments',         getPayments);

module.exports = router;
