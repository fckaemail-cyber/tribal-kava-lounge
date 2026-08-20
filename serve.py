#!/usr/bin/env python3
"""Local SPA server: unknown paths → index.html (mirrors Netlify)."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class SPA(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(ROOT), **k)

    def do_GET(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        fs = ROOT / path.lstrip('/')
        if path != '/' and not fs.is_file():
            self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    port = int(__import__('sys').argv[1]) if len(__import__('sys').argv) > 1 else 8765
    print(f'Serving {ROOT} on http://127.0.0.1:{port}')
    ThreadingHTTPServer(('127.0.0.1', port), SPA).serve_forever()
