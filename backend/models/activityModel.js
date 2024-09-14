const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use an absolute path for the database file
const dbPath = path.resolve('C:/Users/45622395/hackathon/backend/database/user_activities.db');

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
                activity TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating activities table:', err);
            } else {
                console.log('Activities table is ready.');
            }
        });

        // Create the profile_activities table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS profile_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id INTEGER NOT NULL,
                activity_id INTEGER NOT NULL,
                FOREIGN KEY (profile_id) REFERENCES profiles(id),
                FOREIGN KEY (activity_id) REFERENCES activities(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error creating profile_activities table:', err);
            } else {
                console.log('Profile_activities table is ready.');
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
                    return reject(err);
                }
                resolve(this.lastID);  // Return the profile ID
            }
        );
    });
}

// Insert an activity into the activities table
function insertActivity(activity) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO activities (activity) VALUES (?)`,
            [activity],
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);  // Return the activity ID
            }
        );
    });
}

// Link a profile to an activity in the profile_activities table
function linkProfileToActivity(profileId, activityId) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO profile_activities (profile_id, activity_id) VALUES (?, ?)`,
            [profileId, activityId],
            function (err) {
                if (err) {
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
            const activityId = await insertActivity(activity);
            await linkProfileToActivity(profileId, activityId);
        }

        console.log(`Profile and activities for ${profileType} inserted successfully.`);
    } catch (error) {
        console.error('Error inserting profile with activities:', error);
    }
}

module.exports = {
    insertProfileWithActivities
};
