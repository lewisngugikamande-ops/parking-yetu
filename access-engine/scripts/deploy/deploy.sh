#!/bin/bash
# Deploy everything

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏗️  ACCESS ENGINE DEPLOYMENT"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root"
    exit 1
fi

# Menu
echo "Select deployment option:"
echo "  1) Deploy UI to Netlify"
echo "  2) Deploy API to Render"
echo "  3) Deploy both"
echo "  4) Show deployment instructions"
echo "  5) Exit"
echo ""

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        ./scripts/deploy/netlify.sh
        ;;
    2)
        ./scripts/deploy/render.sh
        ;;
    3)
        ./scripts/deploy/netlify.sh
        ./scripts/deploy/render.sh
        ;;
    4)
        echo ""
        echo "📋 DEPLOYMENT INSTRUCTIONS"
        echo "=========================="
        echo ""
        echo "🌐 Netlify:"
        echo "   1. Create account at netlify.com"
        echo "   2. Install Netlify CLI: npm install -g netlify-cli"
        echo "   3. Run: ./scripts/deploy/netlify.sh"
        echo ""
        echo "🚀 Render:"
        echo "   1. Create account at render.com"
        echo "   2. Connect your GitHub repository"
        echo "   3. Follow the manual steps in scripts/deploy/render.sh"
        echo ""
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
