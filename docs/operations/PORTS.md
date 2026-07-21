# Ports Registry

## Reserved Ports

| Port | Service | Status | Environment Variable |
|------|---------|--------|---------------------|
| 3000 | Access Engine API | ✅ Active | `PORT` |
| 4000 | Firebase Emulator UI | ✅ Active | `FIREBASE_UI_PORT` |
| 8080 | Firestore Emulator | ✅ Active | `FIRESTORE_EMULATOR_HOST` |
| 9090 | Metrics (Prometheus) | 🔜 Reserved | `METRICS_PORT` |
| 9099 | Firebase Auth Emulator | 🔜 Reserved | `FIREBASE_AUTH_EMULATOR_HOST` |
| 50051 | gRPC (future) | 🔜 Reserved | `GRPC_PORT` |

## Changing a Port

### API
```bash
PORT=3001 node packages/api/src/index.js
