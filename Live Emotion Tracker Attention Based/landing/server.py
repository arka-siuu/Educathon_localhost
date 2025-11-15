import http.server
import os
import socketserver

PORT = 8050  # You can change the port if needed
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving React app at http://localhost:{PORT}")
    httpd.serve_forever()
