#!/usr/bin/env bash

PID=$(lsof -t -iTCP:3000 -sTCP:LISTEN)

if [ -z "$PID" ]; then
    echo "API is not running."
    exit 0
fi

echo "Stopping API (PID $PID)..."
kill "$PID"

sleep 2

if lsof -t -iTCP:3000 -sTCP:LISTEN >/dev/null; then
    echo "API still running."
else
    echo "API stopped."
fi
