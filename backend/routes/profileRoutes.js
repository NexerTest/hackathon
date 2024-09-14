const express = require('express');
const { generateUserProfile } = require('../controllers/profileController');

const router = express.Router();

// Define the POST /api/profile route
router.post('/', generateUserProfile);

module.exports = router;
