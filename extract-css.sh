#!/bin/bash

echo "========================================="
echo "   Extract CSS from index.html"
echo "========================================="
echo ""

# Check if backup exists
if [ ! -f "index.html.backup.before-css-extract" ]; then
    echo "❌ No backup found!"
    echo "   Please run: cp index.html index.html.backup.before-css-extract"
    exit 1
fi

echo "✅ Found backup file"

# Try Python extraction
echo ""
echo "📝 Extracting CSS with Python..."

python3 << 'PYTHON'
try:
    with open('index.html.backup.before-css-extract', 'r') as f:
        content = f.read()
    
    start = content.find('<style>')
    end = content.find('</style>')
    
    if start != -1 and end != -1:
        css = content[start+7:end]
        with open('css/main.css', 'w') as out:
            out.write(css)
        print(f"✅ Success! Extracted {len(css)} characters")
        print(f"✅ Saved to css/main.css")
    else:
        print("❌ No style block found in backup")
        exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
PYTHON

# Check if it worked
if [ -f "css/main.css" ] && [ -s "css/main.css" ]; then
    echo ""
    echo "✅ CSS file created successfully!"
    echo "   Size: $(ls -lh css/main.css | awk '{print $5}')"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Open index.html"
    echo "   2. Find the <style> block and delete it"
    echo "   3. Make sure <link rel='stylesheet' href='css/main.css'> exists"
    echo "   4. Test with: npm run dev"
else
    echo ""
    echo "❌ Extraction failed. Please extract manually."
    echo "   1. Open: nano index.html.backup.before-css-extract"
    echo "   2. Copy everything between <style> and </style>"
    echo "   3. Open: nano css/main.css"
    echo "   4. Paste and save"
fi
