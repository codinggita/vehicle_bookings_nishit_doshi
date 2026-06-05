const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/apiResponse');

const healthRoutes     = require('./routes/healthRoutes');
const authRoutes       = require('./routes/authRoutes');
const bookingRoutes    = require('./routes/bookingRoutes');
const analyticsRoutes  = require('./routes/analyticsRoutes');
const paginationRoutes = require('./routes/paginationRoutes');
const searchRoutes     = require('./routes/searchRoutes');
const customerRoutes   = require('./routes/customerRoutes');
const driverRoutes     = require('./routes/driverRoutes');
const paymentRoutes    = require('./routes/paymentRoutes');
const ratingRoutes     = require('./routes/ratingRoutes');
const vehicleRoutes    = require('./routes/vehicleRoutes');
const locationRoutes   = require('./routes/locationRoutes');
const logRoutes        = require('./routes/logRoutes');
const middlewareRoutes  = require('./routes/middlewareRoutes');
const statsRoutes       = require('./routes/statsRoutes');
const jwtRoutes         = require('./routes/jwtRoutes');

connectDB();

const app = express();

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api/v1/health',    healthRoutes);
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/bookings',  bookingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/search',    searchRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/drivers',   driverRoutes);
app.use('/api/v1/payments',  paymentRoutes);
app.use('/api/v1/ratings',   ratingRoutes);
app.use('/api/v1/vehicles',  vehicleRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/logs',      logRoutes);
app.use('/api/v1',           middlewareRoutes);
app.use('/api/v1',           paginationRoutes);
app.use('/api/v1/stats',     statsRoutes);
app.use('/api/v1/jwt',       jwtRoutes);

app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
