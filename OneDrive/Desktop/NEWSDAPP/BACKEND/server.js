const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const newsRoutes = require('./src/routes/newsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/news', newsRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('News Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
