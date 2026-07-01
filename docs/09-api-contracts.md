# Parking Yetu - API Contracts

## Vehicle Entry
POST /api/parking/entry
Request: { plate, driver, vehicleType, gate, locationId }
Response: { success, sessionId, qr, correlationId }

## Vehicle Exit
POST /api/parking/exit
Request: { sessionId, gate, action }
Response: { success, plate, duration }

---

*Parking Yetu - API Contracts - Version 3.1.0*
