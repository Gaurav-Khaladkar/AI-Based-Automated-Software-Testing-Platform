#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "${ROOT_DIR}/backend" \
  "${ROOT_DIR}/frontend" \
  "${ROOT_DIR}/ai-engine" \
  "${ROOT_DIR}/automation-engine" \
  "${ROOT_DIR}/database" \
  "${ROOT_DIR}/ci"

echo "Project scaffolding ensured at ${ROOT_DIR}."
