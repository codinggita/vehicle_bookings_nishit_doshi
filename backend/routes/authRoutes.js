const express = require('express');
const {
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', protect, refreshToken);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;
