const express = require('express');
const { saveActivities } = require('../controllers/activityController');

const router = express.Router();

// Route to save activities
router.post('/', saveActivities);

module.exports = router;