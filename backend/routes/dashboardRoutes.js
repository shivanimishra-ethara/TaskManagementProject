const express = require('express');
const { getDashboardMetrics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getDashboardMetrics);

module.exports = router;
