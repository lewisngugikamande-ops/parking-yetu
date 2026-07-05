#!/bin/bash
# Deploy UI to Netlify

set -e

echo "🚀 Deploying to Netlify..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root"
    exit 1
fi

# Build the UI
echo -e "${GREEN}📦 Building UI...${NC}"
cd packages/applications/parking

# Create a simple index.html if it doesn't exist
if [ ! -f "src/index.html" ]; then
    mkdir -p src
    cat > src/index.html << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parking Yetu</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #2563eb; }
        .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        input, button { padding: 10px; margin: 5px; }
        button { background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🚗 Parking Yetu</h1>
    <p>Welcome to the Access Engine demo.</p>
    
    <div class="card">
        <h2>Enter Parking</h2>
        <input type="text" id="credential" placeholder="QR Code (e.g., TEST-QR-123)" value="TEST-QR-123">
        <button onclick="handleEntry()">Enter</button>
        <button onclick="handleExit()">Exit</button>
        <div id="result"></div>
    </div>

    <script>
        const API_URL = 'https://api.parking-yetu.com';
        
        async function handleEntry() {
            const credential = document.getElementById('credential').value;
            const resultDiv = document.getElementById('result');
            
            try {
                const response = await fetch(`${API_URL}/api/entry`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential, accessPointId: 'gate-a' })
                });
                
                const data = await response.json();
                resultDiv.innerHTML = `<div class="status ${data.success ? 'success' : 'error'}">
                    ${data.success ? '✅ Entry allowed! Session: ' + data.sessionId : '❌ ' + data.error}
                </div>`;
            } catch (error) {
                resultDiv.innerHTML = `<div class="status error">❌ Error: ${error.message}</div>`;
            }
        }
        
        async function handleExit() {
            const credential = document.getElementById('credential').value;
            const resultDiv = document.getElementById('result');
            
            try {
                const response = await fetch(`${API_URL}/api/exit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential, accessPointId: 'gate-a' })
                });
                
                const data = await response.json();
                resultDiv.innerHTML = `<div class="status ${data.success ? 'success' : 'error'}">
                    ${data.success ? '✅ Exit allowed!' : '❌ ' + data.error}
                </div>`;
            } catch (error) {
                resultDiv.innerHTML = `<div class="status error">❌ Error: ${error.message}</div>`;
            }
        }
    </script>
</body>
</html>
HTML
fi

# Build (copy files to dist)
mkdir -p dist
cp -r src/* dist/ 2>/dev/null || cp src/index.html dist/

echo -e "${GREEN}✅ UI built successfully${NC}"

# Deploy to Netlify
echo -e "${GREEN}🚀 Deploying to Netlify...${NC}"

# Check if site is already initialized
if [ ! -f ".netlify/state.json" ]; then
    echo -e "${YELLOW}⚠️  First time deployment. Linking to Netlify...${NC}"
    netlify init
fi

# Deploy
netlify deploy --prod --dir=dist --message="Deploy from script"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Your site is live at:"
echo "   https://parking-yetu.netlify.app"
