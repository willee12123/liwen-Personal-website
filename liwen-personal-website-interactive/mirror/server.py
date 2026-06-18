#!/usr/bin/env python3
from __future__ import annotations
import argparse, mimetypes, os
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
INDEX = ROOT / "index.html"
ASSETS = ROOT / "assets"
for k, v in {".js":"text/javascript",".css":"text/css",".json":"application/json",".webp":"image/webp",".svg":"image/svg+xml",".woff":"font/woff",".woff2":"font/woff2",".mp4":"video/mp4",".webm":"video/webm"}.items():
    mimetypes.add_type(v, k)

def safe_join(base, rel):
    candidate = (base / unquote(rel).lstrip("/")).resolve()
    try: candidate.relative_to(base.resolve())
    except ValueError: return None
    return candidate

class Handler(BaseHTTPRequestHandler):
    server_version = "MochiMirror/1.0"
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Range, Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def do_OPTIONS(self): self.send_response(204); self.end_headers()
    def do_HEAD(self): self.handle_request(False)
    def do_GET(self): self.handle_request(True)
    def handle_request(self, body):
        route = urlparse(self.path).path
        if route.startswith("/__stub__/"): self.send_response(204); self.end_headers(); return
        if route.startswith("/__mirror__/"): return self.send_file(safe_join(ASSETS, route.removeprefix("/__mirror__/")), body)
        if route in ("/", "/index.html") or route.endswith("/") or "." not in Path(route).name:
            return self.send_file(INDEX, body)
        return self.send_file(safe_join(ROOT, route), body)
    def send_file(self, target, body):
        if target is None or not target.exists() or not target.is_file(): self.send_error(404); return
        size = target.stat().st_size
        ctype = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        rng = self.headers.get("Range")
        if rng and rng.startswith("bytes="):
            start, end = self.parse_range(rng, size)
            if start is None: self.send_response(416); self.send_header("Content-Range", f"bytes */{size}"); self.end_headers(); return
            self.send_response(206); self.send_header("Content-Type", ctype); self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}"); self.send_header("Content-Length", str(end-start+1)); self.end_headers()
            if body:
                with target.open("rb") as fh:
                    fh.seek(start); self.wfile.write(fh.read(end-start+1))
            return
        self.send_response(200); self.send_header("Content-Type", ctype); self.send_header("Accept-Ranges", "bytes"); self.send_header("Content-Length", str(size)); self.end_headers()
        if body: self.wfile.write(target.read_bytes())
    @staticmethod
    def parse_range(header, size):
        try:
            a, b = header.split("=",1)[1].split(",",1)[0].split("-",1)
            start = max(size-int(b),0) if a == "" else int(a)
            end = size-1 if b == "" or a == "" else int(b)
            return (None, None) if start < 0 or end < start or start >= size else (start, min(end, size-1))
        except Exception: return None, None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(); parser.add_argument("--host", default="127.0.0.1"); parser.add_argument("--port", type=int, default=8782)
    args = parser.parse_args(); os.chdir(ROOT)
    print(f"Mochi mirror serving http://{args.host}:{args.port}/")
    ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()
