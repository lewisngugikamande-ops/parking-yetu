# ADR 002: Credential Abstraction

**Status:** Accepted - 2026-07-07

**Context:** Today we use QR codes. Tomorrow we might need NFC, RFID, biometrics, etc.

**Decision:** Implement a Credential Abstraction Layer where all credentials are polymorphic.

**Benefits:** Future-proof, flexible, easy to add new credential types.

**Consequences:** Credential validation is delegated to adapters.
