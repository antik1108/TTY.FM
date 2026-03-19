#!/bin/bash

# TTY.FM Startup Script
# Simple and straightforward server launcher

set -e  # Exit on any error

# Setup directories
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
MUSIC_DIR="$HOME/tty-fm/music"

echo "================================"
echo "  TTY.FM Startup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js not found"
  echo "Install from: https://nodejs.org (v18+)"
  exit 1
fi
echo "[OK] Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "[ERROR] npm not found"
  exit 1
fi
echo "[OK] npm $(npm --version)"

# Install backend dependencies (only if needed)
echo ""
echo "[SETUP] Backend dependencies..."
cd "$BACKEND_DIR"
npm install --silent 2>/dev/null
echo "[OK] Backend ready"

# Install frontend dependencies (only if needed)
echo "[SETUP] Frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --silent 2>/dev/null
echo "[OK] Frontend ready"

# Create music directory (idempotent)
echo ""
mkdir -p "$MUSIC_DIR"
echo "[OK] Music folder: $MUSIC_DIR"

# Start servers
echo ""
echo "================================"
echo "  Starting Servers"
echo "================================"
echo ""

cd "$BACKEND_DIR"
echo "[RUN] Backend on http://localhost:3001"
npm start &
BACKEND_PID=$!

cd "$FRONTEND_DIR"
echo "[RUN] Frontend on http://localhost:3000"
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "  TTY.FM Running"
echo "================================"
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo "  Music:    $MUSIC_DIR"
echo ""
echo "  Press Ctrl+C to stop"
echo "================================"
echo ""

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Wait for processes
wait