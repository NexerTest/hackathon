require('dotenv').config();
const express = require('express');
const activityModel = require('./models/activityModel');
const { generateUserActivities, simulateUserActions } = require('./services/openaiService');

const app = express();
app.use(express.json());

// Define the port, either from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

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
        res.status(500).json({ message: 'Error processing the request.', error: error.message });
    }
});

// Route to simulate user activities on a given URL
app.post('/simulate-activities', async (req, res) => {
    const { profileType, url } = req.body;

    try {
        // Generate possible user activities based on profile
        const activities = await generateUserActivities(profileType);

        if (!activities) {
            return res.status(500).json({ message: 'Error generating user activities.' });
        }

        // Simulate user actions on the provided URL using Puppeteer
        await simulateUserActions(url, activities);

        res.status(200).json({ message: 'User activities simulated successfully.', activities });
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ message: 'Error processing the request.', error: error.message });
    }
});

// Start the server on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
