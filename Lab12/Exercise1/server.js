const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// IMPORT ROUTES (missing line)
const userRoutes = require('./routes/users');

// Home route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to REST API Server');
});

// Use routes
app.use('/users', userRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});