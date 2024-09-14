const express = require('express');
const { generateUserProfile } = require('../controllers/profileController');

const router = express.Router();

// Route to generate a profile
router.post('/', generateUserProfile);

module.exports = router;
