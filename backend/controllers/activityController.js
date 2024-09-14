const activityModel = require('../models/activityModel');

// Save activities to the SQLite database
function saveActivities(req, res) {
    const { profile, activities } = req.body;

    // Insert activities into the database
    activityModel.insertActivity(profile, activities, (err) => {
        if (err) {
            console.error('Error saving activities:', err);
            res.status(500).json({ message: 'Error saving activities' });
        } else {
            res.status(200).json({ message: 'Activities saved successfully' });
        }
    });
}

// For testing purposes: Get all activities from the database
function getAllActivities(req, res) {
    activityModel.fetchAllActivities((err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching activities' });
        } else {
            res.status(200).json({ activities: rows });
        }
    });
}

module.exports = { saveActivities, getAllActivities };
