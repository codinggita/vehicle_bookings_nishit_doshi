const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getAdminBookings,
  adminCreateBooking,
  adminDeleteBooking,
  adminUpdateBooking,
  getAdminDashboard,
  getProtectedBookings,
  createProtectedBooking,
  deleteProtectedBooking,
} = require('../controllers/middlewareController');

const router = express.Router();

router.use(protect);

router.route('/admin/bookings')
  .get(authorize('admin'), getAdminBookings)
  .post(authorize('admin'), adminCreateBooking);

router.route('/admin/bookings/:bookingId')
  .delete(authorize('admin'), adminDeleteBooking)
  .patch(authorize('admin'), adminUpdateBooking);

router.get('/admin/dashboard', authorize('admin'), getAdminDashboard);

router.route('/protected/bookings')
  .get(getProtectedBookings)
  .post(createProtectedBooking);

router.delete('/protected/bookings/:bookingId', deleteProtectedBooking);

module.exports = router;
