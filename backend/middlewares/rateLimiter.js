const ApiResponse = require('../utils/apiResponse');

const rateLimitStore = {};

const createLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // default 1 minute
  const max = options.max || 100;
  const message = options.message || 'Too many requests, please try again later.';
  
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // We scope limits per IP and route/path to make limiters independent
    const key = `${ip}:${req.baseUrl || ''}${req.path}`;
    const now = Date.now();
    
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = [];
    }
    
    // Clean up timestamps outside current window
    rateLimitStore[key] = rateLimitStore[key].filter(timestamp => now - timestamp < windowMs);
    
    if (rateLimitStore[key].length >= max) {
      return ApiResponse.error(res, message, null, 429);
    }
    
    rateLimitStore[key].push(now);
    next();
  };
};

module.exports = {
  bookingsLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many booking requests. Limit is 60 requests per minute.'
  }),
  loginLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again in a minute to prevent brute force.'
  }),
  registerLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many registration attempts. Please try again in a minute.'
  }),
  searchLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many search requests. Please try again in a minute.'
  }),
  adminLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Strict limit on admin actions. Please try again in a minute.'
  }),
  createBookingLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many booking submissions. Please try again in a minute to prevent spam.'
  }),
  deleteBookingLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many delete booking requests. Please try again in a minute.'
  }),
  importLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many bulk upload requests. Please try again in a minute.'
  })
};
