const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.cjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.wasm': 'application/wasm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    console.log(`📡 ${req.method} ${pathname}`);
    
    // Handle root path
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }
    
    // Build file path
    let filePath = path.join(__dirname, pathname);
    
    // Security: Prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }
    
    // Get file extension
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // For SPA: if it's not a static file request, serve index.html
            if (!pathname.startsWith('/src/') && 
                !pathname.startsWith('/assets/') &&
                !pathname.startsWith('/node_modules/') &&
                !pathname.startsWith('/.git/')) {
                
                // Serve index.html for SPA routing
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
            
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - File Not Found');
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error');
                return;
            }
            
            // Set proper headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 Access Engine v3.1.0');
    console.log(`📍 Running at http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Golden Path: End-to-End Access Journey');
    console.log('');
    console.log('Available routes:');
    console.log('  🏢 /         - Workstation');
    console.log('  🚪 /access   - Access Portal (Golden Path)');
    console.log('  🔧 /admin    - QR Generator');
    console.log('  🏛️ /org-admin - Organization Admin');
    console.log('');
    console.log('🔧 Debug: Press Ctrl+C to stop');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try: killall node`);
    } else {
        console.error('❌ Server error:', err);
    }
});
