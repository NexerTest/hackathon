const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database
const dbPath = path.resolve(__dirname, '../../database/activities.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Function to insert an activity
function insertActivity(profile, activities, callback) {
    const stmt = db.prepare(`
        INSERT INTO activities (profile, activity_type, element, class, element_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    activities.forEach(activity => {
        stmt.run(profile, activity.type, activity.element, activity.class, activity.id, activity.timestamp);
    });

    stmt.finalize(callback);
}

// Export the function
module.exports = {
    insertActivity,
    // If you have more functions, export them here
};
