# Access Engine Architecture

## Layers

- **Foundation** — Pure, dependency-free primitives: value objects, shared errors, and utilities used everywhere. Has no knowledge of sessions, organizations, or requests.
- **Kernel** — Owns startup and wiring. Loads configuration, initializes dependency injection, and boots the Engine. Contains no business logic itself.
- **Engine** — The domain core: sessions, identities, policies, events. Defines repository *interfaces* but never their implementations. Knows nothing about HTTP, databases, or any specific application.
- **Infrastructure** — Concrete implementations of the Engine's interfaces: Firestore repositories, auth providers, external APIs. Adapts the outside world to what the Engine expects.
- **Applications** — The consumer-facing layer (e.g. the parking app, the building app). Composes Foundation, Kernel, Engine, and Infrastructure into something a user can actually use.

## Dependency Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| Foundation | Nothing | Everything else |
| Kernel | Foundation | Engine, Infrastructure, Applications |
| Engine | Foundation, Kernel | Infrastructure, Applications |
| Infrastructure | Foundation, Kernel, Engine | Applications |
| Applications | Everything | N/A |

Dependencies only ever point inward or sideways along this chain, never backward. An outer layer may depend on an inner one; an inner layer must never depend on an outer one.

## The One Entry Point

AccessEngine.process(request)

Every interaction with the Engine — regardless of which Application initiates it — goes through this single call. There is no secondary or side-door API. This keeps request handling, auditing, and policy enforcement centralized and consistent across every Application built on top of the Engine.
