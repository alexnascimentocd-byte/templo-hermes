#!/usr/bin/env python3
"""Templo Hermes - Servidor Python Otimizado com Gzip"""
import http.server, gzip, io, os, json, mimetypes
from pathlib import Path
from urllib.parse import urlparse

PORT = 8082
BASE = Path("/root/templo-hermes")
DIST = BASE / "dist"

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

CACHE = {'.js': 3600, '.css': 3600, '.png': 86400, '.json': 300, '.html': 0}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(BASE), **kw)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
            return
        if path == '/':
            path = '/index.html'

        # Resolve file: try dist/ first for /js/ and /dist/ paths
        fp = BASE / path.lstrip('/')
        if not fp.exists() and (path.startswith('/js/') or path.startswith('/dist/')):
            alt = DIST / Path(path).name
            if alt.exists():
                fp = alt

        if not fp.exists():
            self.send_error(404)
            return

        with open(fp, 'rb') as f:
            content = f.read()

        ext = fp.suffix.lower()
        mime = mimetypes.types_map.get(ext, 'application/octet-stream')
        gz = 'gzip' in self.headers.get('Accept-Encoding', '') and len(content) > 500

        self.send_response(200)
        self.send_header('Content-Type', mime)
        if gz:
            self.send_header('Content-Encoding', 'gzip')
            buf = io.BytesIO()
            with gzip.GzipFile(fileobj=buf, mode='wb', compresslevel=6) as g:
                g.write(content)
            content = buf.getvalue()
        self.send_header('Content-Length', str(len(content)))
        ct = CACHE.get(ext, 3600)
        self.send_header('Cache-Control', f'public, max-age={ct}' if ct else 'no-cache')
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, fmt, *args):
        if '/health' in str(args): return
        super().log_message(fmt, *args)

if __name__ == '__main__':
    s = http.server.HTTPServer(('0.0.0.0', PORT), Handler)
    print(f"🏛️ Templo Hermes: http://0.0.0.0:{PORT}")
    s.serve_forever()
