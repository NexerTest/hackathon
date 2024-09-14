const express = require('express');
const profileRoutes = require('./routes/profileRoutes');  // Import your profile routes
const activityRoutes = require('./routes/activityRoutes');  // Import activity routes

const app = express();
app.use(express.json());  // Parse incoming JSON requests

// Use the profile and activity routes
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
