const express = require('express');
const { getPublicDashboardStats } = require('../controllers/publicController');

const router = express.Router();

router.get('/dashboard-stats', getPublicDashboardStats);

module.exports = router;
