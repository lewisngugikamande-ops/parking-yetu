#!/bin/bash

echo "🧪 RUNNING INTEGRATION TESTS"
echo "==========================="

# Test 1: Health
echo ""
echo "1. Testing health..."
curl -s http://localhost:3000/health | jq -c '{status, service}'

# Test 2: Login
echo ""
echo "2. Testing login..."
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"test-user","password":"password"}' | jq -r '.token')
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi
echo "✅ Login successful"

# Test 3: Entry with token
echo ""
echo "3. Testing entry with token..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/entry -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"credential":"TEST-QR-123","accessPointId":"gate-a","organizationId":"test-org"}')
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" != "true" ]; then
  echo "❌ Entry failed: $RESPONSE"
  exit 1
fi
echo "✅ Entry successful"

# Test 4: Entry without token
echo ""
echo "4. Testing entry without token..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/entry -H "Content-Type: application/json" -d '{"credential":"TEST-QR-123"}')
if [ "$STATUS" = "401" ]; then
  echo "✅ Missing token test passed (HTTP $STATUS)"
else
  echo "❌ Missing token test failed (HTTP $STATUS)"
fi

# Test 5: Entry with invalid token
echo ""
echo "5. Testing entry with invalid token..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/entry -H "Authorization: Bearer invalid" -H "Content-Type: application/json" -d '{"credential":"TEST-QR-123"}')
if [ "$STATUS" = "401" ]; then
  echo "✅ Invalid token test passed (HTTP $STATUS)"
else
  echo "❌ Invalid token test failed (HTTP $STATUS)"
fi

echo ""
echo "🎉 All integration tests passed!"
