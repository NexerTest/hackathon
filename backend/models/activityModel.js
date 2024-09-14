const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const dbPath = path.resolve('C:/Users/45622395/hackathon/backend/database/activities.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');

        // Drop the old activities table if it exists
        db.run(`DROP TABLE IF EXISTS activities`, (err) => {
            if (err) {
                console.error('Error dropping old activities table:', err);
            } else {
                console.log('Dropped old activities table.');
            }
        });

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

        // Recreate the activities table with the correct schema
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

// Insert a profile into the profiles table
function insertProfile(profileType) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO profiles (profile_type) VALUES (?)`,
            [profileType],
            function (err) {
                if (err) {
                    console.error('Error inserting profile:', err);
                    return reject(err);
                }
                resolve(this.lastID);  // Return the profile ID
            }
        );
    });
}

// Insert an activity into the activities table
function insertActivity(profileId, activityDetails) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO activities (profile_id, activity, element, action_type) VALUES (?, ?, ?, ?)`,
            [profileId, activityDetails.activity, activityDetails.element, activityDetails.action_type],
            function (err) {
                if (err) {
                    console.error('Error inserting activity:', err);
                    return reject(err);
                }
                resolve();
            }
        );
    });
}

// Insert a profile and its activities into the database
async function insertProfileWithActivities(profileType, activities) {
    try {
        // Insert the profile and get the profile ID
        const profileId = await insertProfile(profileType);

        // Insert each activity and link it to the profile
        for (const activity of activities) {
            await insertActivity(profileId, activity);
        }

        console.log(`Profile and activities for ${profileType} inserted successfully.`);
    } catch (error) {
        console.error('Error inserting profile with activities:', error);
        throw error;  // Rethrow the error for handling in the calling function
    }
}

// Export the functions for use in app.js
module.exports = {
    insertProfileWithActivities
};
