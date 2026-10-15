#!/usr/bin/env bash
# =====================================================================
# AI-Based Automated Software Testing Platform - Bootstrap Script
# =====================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "--------------------------------------------------------"
echo "Initializing AI Testing Platform Workspace at: ${ROOT_DIR}"
echo "--------------------------------------------------------"

mkdir -p "${ROOT_DIR}/backend" \
  "${ROOT_DIR}/frontend" \
  "${ROOT_DIR}/ai-engine" \
  "${ROOT_DIR}/automation-engine" \
  "${ROOT_DIR}/test-engine" \
  "${ROOT_DIR}/database" \
  "${ROOT_DIR}/reports/templates" \
  "${ROOT_DIR}/docs" \
  "${ROOT_DIR}/ci"

echo "[✓] Directory scaffolding complete."
echo "Launch containers with: docker compose up --build -d"
