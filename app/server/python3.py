#!/usr/bin/env python3

"""
Python 3 HTTP server for linux-dash.
Usage: python3 python3.py --port 8080
"""

import os
import sys
import subprocess
import argparse
import mimetypes
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn


parser = argparse.ArgumentParser(description='Simple Threaded HTTP server to run linux-dash.')
parser.add_argument('--port', metavar='PORT', type=int, nargs='?', default=80,
                    help='Port to run the server on.')

modulesSubPath = '/server/linux_json_api.sh'
appRootPath = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Threaded HTTP Server to handle multiple requests concurrently."""
    daemon_threads = True


class MainHandler(BaseHTTPRequestHandler):
    """Main request handler for linux-dash."""

    def do_GET(self):
        try:
            data = b''
            contentType = 'text/html'

            if self.path == "/websocket":
                # Websocket support check - Python server doesn't support websockets
                response = {"websocket_support": False}
                data = json.dumps(response).encode('utf-8')
                contentType = 'application/json'
            elif self.path.startswith("/server/"):
                # API call - execute shell script
                module = self.path.split('=')[1]
                output = subprocess.Popen(
                    appRootPath + modulesSubPath + " " + module,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE)
                stdout, stderr = output.communicate()
                data = stdout
                contentType = 'application/json'
            else:
                # Static file serving
                path = self.path
                # Strip query string if present
                if '?' in path:
                    path = path.split('?')[0]
                if path == '/':
                    path = 'index.html'
                if path.startswith('/'):
                    path = path[1:]

                filepath = os.path.join(appRootPath, path)

                # Security: prevent directory traversal
                filepath = os.path.realpath(filepath)
                if not filepath.startswith(appRootPath):
                    self.send_error(403, 'Forbidden')
                    return

                # Determine content type
                mime_type, _ = mimetypes.guess_type(filepath)
                if mime_type:
                    contentType = mime_type

                with open(filepath, 'rb') as f:
                    data = f.read()

            self.send_response(200)
            self.send_header('Content-type', contentType)
            self.send_header('Content-Length', len(data))
            self.end_headers()
            self.wfile.write(data)

        except FileNotFoundError:
            self.send_error(404, 'File Not Found: %s' % self.path)
        except IOError as e:
            self.send_error(500, 'Internal Server Error: %s' % str(e))

    def log_message(self, format, *args):
        """Log HTTP requests."""
        print("[%s] %s" % (self.log_date_time_string(), format % args))


if __name__ == '__main__':
    args = parser.parse_args()
    server = ThreadedHTTPServer(('0.0.0.0', args.port), MainHandler)
    print('Starting linux-dash server on port %d' % args.port)
    print('Use <Ctrl-C> to stop')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down server...')
        server.shutdown()
