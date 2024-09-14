const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database
const dbPath = path.resolve(__dirname, '../../database/activities.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');

        // Create the profiles table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_type TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating profiles table:', err);
            } else {
                console.log('Profiles table is ready.');
            }
        });

        // Create the activities table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id INTEGER NOT NULL,
                activity TEXT NOT NULL,
                element TEXT,
                action_type TEXT,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (profile_id) REFERENCES profiles(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating activities table:', err);
            } else {
                console.log('Activities table is ready.');
            }
        });
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
}

// Export the function
module.exports = {
    insertActivity,
    // If you have more functions, export them here
};
