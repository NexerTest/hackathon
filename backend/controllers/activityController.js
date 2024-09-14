const activityModel = require('../models/activityModel'); // Ensure the path is correct

// Save activities to the SQLite database
function saveActivities(req, res) {
    const { profile, activities } = req.body;

    // Call the insertActivity function
    activityModel.insertActivity(profile, activities, (err) => {
        if (err) {
            console.error('Error saving activities:', err);
            res.status(500).json({ message: 'Error saving activities' });
        } else {
            res.status(200).json({ message: 'Activities saved successfully' });
        }
    });
}

module.exports = { saveActivities };
