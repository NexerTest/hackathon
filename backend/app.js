require('dotenv').config();
const express = require('express');
const activityModel = require('./models/activityModel');
const { generateUserActivities } = require('./services/openaiService');

const app = express();
app.use(express.json());

// Route to generate user activities based on the profile and save them to the database
app.post('/generate-activities', async (req, res) => {
    const { profileType } = req.body;

    try {
        // Generate possible user activities based on profile
        const activities = await generateUserActivities(profileType);

        if (!activities) {
            return res.status(500).json({ message: 'Error generating user activities.' });
        }

        // Save the profile and activities to the database
        await activityModel.insertProfileWithActivities(profileType, activities);

        res.status(200).json({ message: 'User activities generated and saved successfully.', activities });
    } catch (error) {
        console.error('Error generating or saving activities:', error);
        res.status(500).json({ message: 'Error processing the request.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
