require('dotenv').config();
const express = require('express');
const profileRoutes = require('./routes/profileRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);

// App port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
