// Import required module
const http = require('http');

// Define port
const PORT = 3000;

// Create server
const server = http.createServer((req, res) => {
    
    // Log request
    console.log(`Request received for: ${req.url}`);

    // Set response header
    res.setHeader('Content-Type', 'text/plain');

    // Handle different routes
    if (req.url === '/') {
        res.write('Welcome to the Home Page');
    } else if (req.url === '/about') {
        res.write('This is the About Page');
    } else {
        res.write('404 - Page Not Found');
    }

    // End response
    res.end();
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});