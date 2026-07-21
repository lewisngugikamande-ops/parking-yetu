#!/usr/bin/env bash

echo "========================================="
echo "Access Engine Platform Status"
echo "========================================="

PORTS=(3000 4000 8080 9090 9099 50051)

for PORT in "${PORTS[@]}"; do
    if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null; then
        PID=$(lsof -t -iTCP:$PORT -sTCP:LISTEN)
        CMD=$(ps -p "$PID" -o args=)
        printf "✅ %-6s PID %-8s %s\n" "$PORT" "$PID" "$CMD"
    else
        printf "⬜ %-6s FREE\n" "$PORT"
    fi
done
