// Import express
const express = require('express');
const app = express();

// ================= GLOBAL MIDDLEWARE =================

// Middleware 1: Logger
app.use((req, res, next) => {
    console.log('--- Global Middleware 1 ---');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    next(); // pass control
});

// Middleware 2: Another global middleware
app.use((req, res, next) => {
    console.log('--- Global Middleware 2 ---');
    next();
});

// ================= ROUTE-LEVEL MIDDLEWARE =================

// Custom middleware for specific route
const checkUser = (req, res, next) => {
    console.log('--- Route Middleware: Checking User ---');
    const user = req.query.user;

    if (!user) {
        return res.send('User not provided');
    }

    next();
};

// ================= ROUTES =================

// Home route
app.get('/', (req, res) => {
    console.log('--- Route Handler ---');
    res.send('Home Page');
});

// Route with middleware chaining
app.get('/dashboard', checkUser, (req, res) => {
    console.log('--- Dashboard Handler ---');
    res.send(`Welcome ${req.query.user}`);
});

// ================= SERVER =================

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});