const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  generateToken,
  verifyToken,
  refreshToken,
  getProfile,
  getDashboard,
  getAdmin,
  getUser,
  logout,
} = require('../controllers/jwtController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/dashboard', protect, getDashboard);
router.post('/generate-token', generateToken);
router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshToken);
router.get('/admin', protect, authorize('admin'), getAdmin);
router.get('/user', protect, authorize('user', 'admin'), getUser);
router.delete('/logout', protect, logout);

module.exports = router;
