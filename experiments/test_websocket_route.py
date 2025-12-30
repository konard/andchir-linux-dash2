#!/usr/bin/env python3
"""
Test script to verify the /websocket route returns correct response
"""

import sys
import os
import json
import time
import subprocess
import urllib.request
import urllib.error

# Start the server in the background
print("Starting Python server on port 8181...")
server_process = subprocess.Popen(
    [sys.executable, 'app/server/python3.py', '--port=8181'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for server to start
time.sleep(2)

try:
    # Test the /websocket route
    print("\nTesting GET /websocket...")
    try:
        response = urllib.request.urlopen('http://localhost:8181/websocket')
        data = json.loads(response.read().decode('utf-8'))
        print(f"✓ Status: {response.status}")
        print(f"✓ Response: {data}")

        # Verify the response structure
        if 'websocket_support' in data:
            if data['websocket_support'] == False:
                print("✓ Correct response: websocket_support is False")
            else:
                print("✗ Expected websocket_support to be False")
        else:
            print("✗ Missing websocket_support key in response")

    except urllib.error.HTTPError as e:
        print(f"✗ HTTP Error {e.code}: {e.reason}")
        print(f"✗ Failed - Server returned error instead of success")
    except Exception as e:
        print(f"✗ Error: {e}")

finally:
    # Cleanup
    print("\nStopping server...")
    server_process.terminate()
    server_process.wait(timeout=5)
    print("Test completed")
