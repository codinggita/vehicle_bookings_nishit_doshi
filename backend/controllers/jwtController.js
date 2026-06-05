const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken } = require('../utils/auth');

const generateTokenHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return ApiResponse.error(res, 'Please provide both email and password.', null, 400);
  }

  const user = await User.findOne({ email, isDeleted: false }).select('+password');
  if (!user) {
    return ApiResponse.error(res, 'Invalid credentials. User not found.', null, 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid credentials. Incorrect password.', null, 401);
  }

  const token = generateToken(user._id);
  return ApiResponse.success(res, 'JWT token generated successfully.', { token }, 200);
});

const verifyTokenHandler = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return ApiResponse.error(res, 'Please provide a token to verify.', null, 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return ApiResponse.error(res, 'Token is valid but the associated user account is invalid or deactivated.', null, 401);
    }

    return ApiResponse.success(res, 'JWT token is valid.', {
      decoded,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 200);
  } catch (error) {
    return ApiResponse.error(res, 'JWT token verification failed.', error.message, 401);
  }
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  let userId;
  if (req.user) {
    userId = req.user._id;
  } else {
    const { token } = req.body;
    if (!token) {
      return ApiResponse.error(res, 'Please provide a token to refresh.', null, 400);
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      userId = decoded.id;
    } catch (error) {
      return ApiResponse.error(res, 'Invalid token. Cannot refresh.', error.message, 401);
    }
  }

  const user = await User.findById(userId);
  if (!user || user.isDeleted) {
    return ApiResponse.error(res, 'User account associated with this token is invalid or deactivated.', null, 401);
  }

  const newToken = generateToken(user._id);
  return ApiResponse.success(res, 'JWT token refreshed successfully.', { token: newToken }, 200);
});

const getProfileHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'User context not found.', null, 404);
  }

  return ApiResponse.success(res, 'JWT protected profile accessed successfully.', {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  }, 200);
});

const getDashboardHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'User context not found.', null, 404);
  }

  return ApiResponse.success(res, 'JWT protected dashboard accessed successfully.', {
    message: `Welcome to your dashboard, ${req.user.name}!`,
    timestamp: new Date(),
    role: req.user.role,
  }, 200);
});

const getAdminHandler = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'Admin protected route accessed successfully.', {
    message: 'Welcome Admin! You have access to this endpoint.',
  }, 200);
});

const getUserHandler = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'User protected route accessed successfully.', {
    message: 'Welcome User! You have access to this endpoint.',
  }, 200);
});

const logoutHandler = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'JWT session logged out successfully.', null, 200);
});

module.exports = {
  generateToken: generateTokenHandler,
  verifyToken: verifyTokenHandler,
  refreshToken: refreshTokenHandler,
  getProfile: getProfileHandler,
  getDashboard: getDashboardHandler,
  getAdmin: getAdminHandler,
  getUser: getUserHandler,
  logout: logoutHandler,
};
