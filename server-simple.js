const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Sanitize URL to prevent directory traversal
    let filePath = path.join(__dirname, req.url.split('?')[0]);
    
    // If path is root, serve index.html
    if (filePath === __dirname || filePath === path.join(__dirname, '')) {
        filePath = path.join(__dirname, 'index.html');
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // For SPA: serve index.html for all non-file routes
            if (req.url.startsWith('/src/') || req.url.startsWith('/assets/')) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - File not found');
                return;
            }
            
            // Serve index.html for SPA routes
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 - Internal Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 Access Engine v3.1.0');
    console.log(`📍 Running at http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Golden Path: End-to-End Access Journey');
});
