const Log = require('../models/Log');

const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

    Log.create({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || (req.connection && req.connection.remoteAddress) || 'unknown',
    }).catch((err) => {
      console.error('Failed to log request to database:', err.message);
    });
  });
  next();
};

module.exports = logger;
