#!/bin/bash

echo "========================================="
echo "   🔍 Parking Yetu - Code Verification"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

# ==========================================
# 1. FILE STRUCTURE
# ==========================================
echo -e "${BLUE}📁 1. File Structure${NC}"
echo "─────────────────────────────────────"

check_file() {
    if [ -f "$1" ]; then
        echo -e "  ${GREEN}✅${NC} $1"
        PASSED=$((PASSED+1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $1 (MISSING)"
        FAILED=$((FAILED+1))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "  ${GREEN}✅${NC} $1/"
        PASSED=$((PASSED+1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $1/ (MISSING)"
        FAILED=$((FAILED+1))
        return 1
    fi
}

# Check directories
check_dir "src/models"
check_dir "src/core"
check_dir "src/services"
check_dir "src/modules"
check_dir "src/modules/workstation"
check_dir "src/repositories"
check_dir "src/mappers"

# Check critical files
check_file "src/app.js"
check_file "src/bootstrap.js"
check_file "src/models/Organization.js"
check_file "src/models/Operator.js"
check_file "src/models/Site.js"
check_file "src/core/organization-service.js"
check_file "src/core/operator-service.js"
check_file "src/services/firebase.js"
check_file "src/modules/workstation/index.js"

echo ""

# ==========================================
# 2. CODE QUALITY
# ==========================================
echo -e "${BLUE}📊 2. Code Quality${NC}"
echo "─────────────────────────────────────"

# Count total lines
TOTAL_LINES=$(find src -name "*.js" -type f -exec wc -l {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
echo -e "  📄 Total lines of code: ${TOTAL_LINES}"

# Count files
TOTAL_FILES=$(find src -name "*.js" -type f | wc -l)
echo -e "  📁 Total JavaScript files: ${TOTAL_FILES}"

# Check for console.log (debug)
CONSOLE_LOGS=$(find src -name "*.js" -type f -exec grep -c "console.log" {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️${NC} $CONSOLE_LOGS console.log statements found"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "  ${GREEN}✅${NC} No console.log statements"
    PASSED=$((PASSED+1))
fi

# Check for TODO comments
TODOS=$(find src -name "*.js" -type f -exec grep -c "TODO" {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ "$TODOS" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️${NC} $TODOS TODO comments found"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "  ${GREEN}✅${NC} No TODO comments"
    PASSED=$((PASSED+1))
fi

# Check for hardcoded values
HARDCODED=$(grep -r "org_church_a" src/ --include="*.js" 2>/dev/null | wc -l)
if [ "$HARDCODED" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️${NC} $HARDCODED hardcoded 'org_church_a' references"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "  ${GREEN}✅${NC} No hardcoded organization references"
    PASSED=$((PASSED+1))
fi

# Check for empty catch blocks
EMPTY_CATCH=$(find src -name "*.js" -type f -exec grep -A2 "catch" {} \; 2>/dev/null | grep -c "{}")
if [ "$EMPTY_CATCH" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠️${NC} $EMPTY_CATCH empty catch blocks found"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "  ${GREEN}✅${NC} No empty catch blocks"
    PASSED=$((PASSED+1))
fi

echo ""

# ==========================================
# 3. ARCHITECTURE
# ==========================================
echo -e "${BLUE}🏗️ 3. Architecture${NC}"
echo "─────────────────────────────────────"

# Check if repositories exist (should be minimal)
REPO_COUNT=$(find src/repositories -name "*.js" -type f 2>/dev/null | wc -l)
if [ "$REPO_COUNT" -eq 0 ]; then
    echo -e "  ${GREEN}✅${NC} No repositories (correct - only one data source)"
    PASSED=$((PASSED+1))
else
    echo -e "  ${YELLOW}⚠️${NC} $REPO_COUNT repositories found (okay if needed)"
    WARNINGS=$((WARNINGS+1))
fi

# Check if mappers exist (should be minimal)
MAPPER_COUNT=$(find src/mappers -name "*.js" -type f 2>/dev/null | wc -l)
if [ "$MAPPER_COUNT" -eq 0 ]; then
    echo -e "  ${GREEN}✅${NC} No mappers (correct - no schema divergence)"
    PASSED=$((PASSED+1))
else
    echo -e "  ${YELLOW}⚠️${NC} $MAPPER_COUNT mappers found (okay if needed)"
    WARNINGS=$((WARNINGS+1))
fi

# Check for circular dependencies (simple check)
CIRCULAR=$(grep -r "import.*from.*\.\." src/core/ --include="*.js" 2>/dev/null | wc -l)
if [ "$CIRCULAR" -lt 10 ]; then
    echo -e "  ${GREEN}✅${NC} Minimal circular imports"
    PASSED=$((PASSED+1))
else
    echo -e "  ${YELLOW}⚠️${NC} Potential circular imports detected"
    WARNINGS=$((WARNINGS+1))
fi

echo ""

# ==========================================
# 4. FUNCTIONALITY
# ==========================================
echo -e "${BLUE}⚡ 4. Functionality${NC}"
echo "─────────────────────────────────────"

# Check if Firebase config exists
if grep -q "apiKey" src/services/firebase.js 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Firebase configured"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Firebase not configured"
    FAILED=$((FAILED+1))
fi

# Check if Organization service loads
if grep -q "load.*organization" src/core/organization-service.js 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} Organization service ready"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Organization service incomplete"
    FAILED=$((FAILED+1))
fi

# Check if Operator service has PIN support
if grep -q "signInWithPin" src/core/operator-service.js 2>/dev/null; then
    echo -e "  ${GREEN}✅${NC} PIN authentication supported"
    PASSED=$((PASSED+1))
else
    echo -e "  ${YELLOW}⚠️${NC} PIN authentication not yet implemented"
    WARNINGS=$((WARNINGS+1))
fi

# Check if bootstrap exists
if [ -f "src/bootstrap.js" ]; then
    echo -e "  ${GREEN}✅${NC} Bootstrap exists"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Bootstrap missing"
    FAILED=$((FAILED+1))
fi

echo ""

# ==========================================
# 5. SUMMARY
# ==========================================
echo -e "${BLUE}📊 Summary${NC}"
echo "─────────────────────────────────────"
echo -e "  ${GREEN}✅ Passed: $PASSED${NC}"
echo -e "  ${RED}❌ Failed: $FAILED${NC}"
echo -e "  ${YELLOW}⚠️ Warnings: $WARNINGS${NC}"
echo ""

TOTAL=$((PASSED+FAILED+WARNINGS))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
    echo -e "  🎯 Score: $PERCENTAGE%"
else
    echo -e "  🎯 Score: N/A"
fi

echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -lt 3 ]; then
    echo -e "  ${GREEN}🎉 Code is clean and ready for Sprint 3B!${NC}"
elif [ $FAILED -eq 0 ]; then
    echo -e "  ${YELLOW}⚠️ Code is clean but has some warnings to address.${NC}"
else
    echo -e "  ${RED}❌ Some issues need fixing before continuing.${NC}"
fi

echo ""
echo "========================================="
