#!/bin/bash
# Deploy API to Render

set -e

echo "🚀 Deploying API to Render..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""
echo -e "${YELLOW}📋 Manual steps to deploy on Render:${NC}"
echo ""
echo "1. Go to https://render.com"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: access-engine-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: node packages/api/src/index.js"
echo "5. Add environment variables:"
echo "   - PORT=3000"
echo "   - NODE_ENV=production"
echo "6. Click 'Create Web Service'"
echo ""
echo -e "${GREEN}🚀 Your API will be available at:${NC}"
echo "   https://access-engine-api.onrender.com"
