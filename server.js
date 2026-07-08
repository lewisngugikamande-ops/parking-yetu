const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files first (CSS, JS, etc.)
app.use(express.static(path.join(__dirname), {
    // Ensure proper MIME types
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        } else if (filePath.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        }
    }
}));

// API routes (if needed later)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '3.1.0', timestamp: new Date().toISOString() });
});

// SPA fallback - serve index.html for all non-file routes
app.get('*', (req, res) => {
    // Check if the request is for a file that exists
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        // Let express.static handle it
        return res.sendFile(filePath);
    }
    
    // Otherwise serve index.html
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
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
    console.log('🔧 Debug:');
    console.log(`  http://localhost:${PORT}/src/`);
});
