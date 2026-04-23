#!/usr/bin/env bash
# Generate a self-signed TLS cert for local HTTPS testing.
# Browsers require the hostname you open to appear in Subject Alternative Name.
#
# Usage:
#   ./scripts/gen_dev_cert.sh              # localhost + 127.0.0.1 only
#   ./scripts/gen_dev_cert.sh 192.168.1.42 # add your Mac's Wi‑Fi IP for phone access
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LAN_IP="${1:-}"
SAN="DNS:localhost,IP:127.0.0.1"
if [[ -n "$LAN_IP" ]]; then
  SAN="${SAN},IP:${LAN_IP}"
fi

openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 825 -nodes \
  -subj "/CN=localhost" \
  -addext "subjectAltName=${SAN}"

echo "Wrote ${ROOT}/cert.pem and ${ROOT}/key.pem"
if [[ -z "$LAN_IP" ]]; then
  echo "Tip: for a phone on the same Wi‑Fi, re-run with your computer's LAN IP, e.g.:"
  echo "  ./scripts/gen_dev_cert.sh 192.168.x.x"
fi
