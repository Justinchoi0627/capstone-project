#!/usr/bin/env python3
"""Serve this static site over HTTPS (secure context for camera / sensors on phones)."""
from __future__ import annotations

import errno
import functools
import http.server
import os
import socket
import ssl
import sys
from pathlib import Path

WEB_ROOT = Path(__file__).resolve().parent
CERT = WEB_ROOT / "cert.pem"
KEY = WEB_ROOT / "key.pem"
DEFAULT_PORT = 8443


class _ReuseThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True


def _guess_lan_ip() -> str | None:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None


def main() -> None:
    port = int(os.environ.get("PORT", DEFAULT_PORT))
    if not CERT.is_file() or not KEY.is_file():
        print("Missing cert.pem or key.pem next to this script.", file=sys.stderr)
        print("Run: ./scripts/gen_dev_cert.sh [YOUR_LAN_IP]", file=sys.stderr)
        sys.exit(1)

    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=str(WEB_ROOT),
    )
    try:
        httpd = _ReuseThreadingHTTPServer(("0.0.0.0", port), handler)
    except OSError as e:
        if e.errno == errno.EADDRINUSE:
            print(f"Port {port} is already in use.", file=sys.stderr)
            print(f"Pick another port, e.g.: PORT=8444 python3 {sys.argv[0]}", file=sys.stderr)
            print("Or stop the other process: lsof -iTCP:%s -sTCP:LISTEN" % port, file=sys.stderr)
            sys.exit(1)
        raise

    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    try:
        ctx.minimum_version = ssl.TLSVersion.TLSv1_2
    except AttributeError:
        pass
    ctx.load_cert_chain(str(CERT), str(KEY))
    httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)

    lan = _guess_lan_ip()
    print(f"Serving {WEB_ROOT} over HTTPS on port {port} (all interfaces).")
    print(f"  On this machine: https://127.0.0.1:{port}/")
    if lan:
        print(f"  On your phone:   https://{lan}:{port}/")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
