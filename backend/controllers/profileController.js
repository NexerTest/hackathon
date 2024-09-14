const openaiService = require('../services/openaiService');

// Generate user profile
async function generateUserProfile(req, res) {
    const { profileType } = req.body;

    try {
        const profile = await openaiService.generateUserProfile(profileType);
        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ error: 'Error generating the profile' });
    }
}

module.exports = { generateUserProfile };
