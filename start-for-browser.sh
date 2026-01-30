#!/bin/bash
# Run this in your terminal so the Cursor browser can display the app at http://localhost:5173

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies (first time)..."
  npm install
fi

echo "Starting dev server..."
echo "Open in Cursor browser: http://localhost:5173"
npm run dev
