#!/usr/bin/env bash

export PORT=3000
export AUTH_PROVIDER=mock
export FIRESTORE_EMULATOR_HOST=localhost:8080

echo "Starting Access Engine API..."

node packages/api/src/index.js
