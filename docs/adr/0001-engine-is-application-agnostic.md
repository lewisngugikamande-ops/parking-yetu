# ADR 0001: Engine is Application-Agnostic

**Status:** Accepted

**Context:** The Access Engine will power multiple applications.

**Decision:** The engine will never know what application is using it.

**Consequences:** Applications are plugins. Deleting an application doesn't change the engine.
