#!/bin/bash

echo "========================================="
echo "   🏗️ Parking Yetu - Architecture Verify"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
PASSED=0
FAILED=0

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

check_import() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "  ${GREEN}✅${NC} $1 has $2"
        PASSED=$((PASSED+1))
        return 0
    else
        echo -e "  ${RED}❌${NC} $1 missing $2"
        FAILED=$((FAILED+1))
        return 1
    fi
}

echo "📁 1. Checking Models (Domain Layer)"
echo "─────────────────────────────────────"
check_file "src/models/User.js"
check_file "src/models/Session.js"
check_file "src/models/Vehicle.js"
check_file "src/models/Gate.js"
check_file "src/models/Organization.js"
check_file "src/models/Permission.js"
echo ""

echo "📁 2. Checking Mappers (Conversion Layer)"
echo "─────────────────────────────────────────"
check_file "src/mappers/user-mapper.js"
check_file "src/mappers/session-mapper.js"
check_file "src/mappers/vehicle-mapper.js"
check_file "src/mappers/gate-mapper.js"
echo ""

echo "📁 3. Checking Repositories (Data Access Layer)"
echo "───────────────────────────────────────────────"
check_file "src/repositories/user-repository.js"
check_file "src/repositories/session-repository.js"
check_file "src/repositories/vehicle-repository.js"
check_file "src/repositories/gate-repository.js"
check_file "src/repositories/audit-repository.js"
echo ""

echo "📁 4. Checking Services (Business Logic Layer)"
echo "──────────────────────────────────────────────"
check_file "src/services/firebase.js"
check_file "src/services/parking-service.js"
check_file "src/services/user-service.js"
echo ""

echo "📁 5. Checking Core (Infrastructure Layer)"
echo "──────────────────────────────────────────"
check_file "src/core/store.js"
check_file "src/core/session.js"
check_file "src/core/permissions.js"
check_file "src/core/router.js"
check_file "src/core/feature-flags.js"
check_file "src/core/audit.js"
check_file "src/core/events.js"
check_file "src/core/errors.js"
echo ""

echo "📁 6. Checking Config"
echo "────────────────────"
check_file "src/config/index.js"
check_file ".env"
echo ""

echo "🔍 7. Checking Critical Fixes"
echo "─────────────────────────────"

# Check 1: setDoc import in session-repository
check_import "src/repositories/session-repository.js" "setDoc"

# Check 2: toDate() helper in mappers
check_import "src/mappers/user-mapper.js" "toDate"
check_import "src/mappers/session-mapper.js" "toDate"
check_import "src/mappers/vehicle-mapper.js" "toDate"
check_import "src/mappers/gate-mapper.js" "toDate"

# Check 3: serverTimestamp() in mappers
check_import "src/mappers/user-mapper.js" "serverTimestamp"
check_import "src/mappers/session-mapper.js" "serverTimestamp"
check_import "src/mappers/vehicle-mapper.js" "serverTimestamp"
check_import "src/mappers/gate-mapper.js" "serverTimestamp"

# Check 4: Classes instead of objects
if grep -q "export class" src/repositories/user-repository.js; then
    echo -e "  ${GREEN}✅${NC} UserRepository is a class"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} UserRepository is NOT a class"
    FAILED=$((FAILED+1))
fi

if grep -q "export class" src/repositories/session-repository.js; then
    echo -e "  ${GREEN}✅${NC} SessionRepository is a class"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} SessionRepository is NOT a class"
    FAILED=$((FAILED+1))
fi

# Check 5: Audit uses repository
if grep -q "AuditRepository" src/core/audit.js; then
    echo -e "  ${GREEN}✅${NC} Audit uses AuditRepository"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Audit does NOT use AuditRepository"
    FAILED=$((FAILED+1))
fi

# Check 6: Event Bus has async
if grep -q "async emit" src/core/events.js; then
    echo -e "  ${GREEN}✅${NC} Event Bus has async support"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Event Bus missing async support"
    FAILED=$((FAILED+1))
fi

# Check 7: Services exist
if grep -q "export class ParkingService" src/services/parking-service.js; then
    echo -e "  ${GREEN}✅${NC} ParkingService exists"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} ParkingService missing"
    FAILED=$((FAILED+1))
fi

if grep -q "export class UserService" src/services/user-service.js; then
    echo -e "  ${GREEN}✅${NC} UserService exists"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} UserService missing"
    FAILED=$((FAILED+1))
fi

# Check 8: Config uses env
if grep -q "import.meta.env" src/config/index.js; then
    echo -e "  ${GREEN}✅${NC} Config uses environment variables"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} Config does NOT use environment variables"
    FAILED=$((FAILED+1))
fi

# Check 9: VehicleRepository exists
if [ -f "src/repositories/vehicle-repository.js" ]; then
    echo -e "  ${GREEN}✅${NC} VehicleRepository exists"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} VehicleRepository missing"
    FAILED=$((FAILED+1))
fi

# Check 10: GateRepository exists
if [ -f "src/repositories/gate-repository.js" ]; then
    echo -e "  ${GREEN}✅${NC} GateRepository exists"
    PASSED=$((PASSED+1))
else
    echo -e "  ${RED}❌${NC} GateRepository missing"
    FAILED=$((FAILED+1))
fi

echo ""
echo "========================================="
echo "   📊 Results"
echo "========================================="
echo ""
echo -e "  ${GREEN}✅ Passed: $PASSED${NC}"
echo -e "  ${RED}❌ Failed: $FAILED${NC}"
echo ""
TOTAL=$((PASSED+FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))
echo "  🎯 Score: $PERCENTAGE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "  ${GREEN}🎉 ALL CHECKS PASSED! Architecture is solid!${NC}"
else
    echo -e "  ${YELLOW}⚠️ $FAILED checks failed. Review the issues above.${NC}"
fi

echo ""
echo "========================================="
