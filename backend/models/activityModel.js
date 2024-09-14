const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize the SQLite database
const dbPath = path.resolve(__dirname, '../../database/activities.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create the activities table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile TEXT,
            activity_type TEXT,
            element TEXT,
            class TEXT,
            element_id TEXT,
            timestamp TEXT
        )
    `);
});

// Insert a new activity
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

// Fetch all activities (for testing purposes)
function fetchAllActivities(callback) {
    db.all('SELECT * FROM activities', [], (err, rows) => {
        if (err) {
            console.error('Error fetching activities:', err);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

module.exports = {
    insertActivity,
    fetchAllActivities
};
