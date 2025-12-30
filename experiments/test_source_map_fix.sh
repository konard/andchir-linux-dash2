#!/bin/bash
# Test script to verify source map 404 errors are fixed

echo "=== Testing Source Map Fix ==="
echo ""

# Check if source map references are removed from linuxDash.min.js
echo "1. Checking for sourceMappingURL references in app/linuxDash.min.js..."
if grep -q "sourceMappingURL" app/linuxDash.min.js; then
    echo "❌ FAIL: sourceMappingURL references still present in app/linuxDash.min.js"
    grep -n "sourceMappingURL" app/linuxDash.min.js
    exit 1
else
    echo "✅ PASS: No sourceMappingURL references found in app/linuxDash.min.js"
fi

echo ""
echo "2. Starting Python server on port 8181 for testing..."

# Start the server in the background
python3 app/server/python3.py --port=8181 > experiments/server_test.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "❌ FAIL: Server failed to start"
    cat experiments/server_test.log
    exit 1
fi

echo "✅ Server started with PID: $SERVER_PID"
echo ""

echo "3. Testing HTTP requests to verify no 404 errors for source maps..."

# Test main page
echo "   Testing GET /"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8181/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ GET / returned $HTTP_CODE"
else
    echo "   ⚠️  GET / returned $HTTP_CODE (expected 200)"
fi

# Test linuxDash.min.js
echo "   Testing GET /linuxDash.min.js"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8181/linuxDash.min.js)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ GET /linuxDash.min.js returned $HTTP_CODE"
else
    echo "   ⚠️  GET /linuxDash.min.js returned $HTTP_CODE (expected 200)"
fi

echo ""
echo "4. Checking server logs for any 404 errors related to source maps..."
sleep 1

# Stop the server
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

# Check logs for 404 errors
if grep -q "404.*\.map" experiments/server_test.log; then
    echo "❌ FAIL: Found 404 errors for .map files in server logs:"
    grep "404.*\.map" experiments/server_test.log
    exit 1
else
    echo "✅ PASS: No 404 errors for .map files in server logs"
fi

echo ""
echo "=== All tests passed! ==="
echo ""
echo "Server log output:"
cat experiments/server_test.log
