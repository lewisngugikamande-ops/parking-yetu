# Engine Laws

1. **The Engine Never Knows the Application** — It has no imports from, or references to, any specific Application. This is what makes it reusable across parking, building access, or anything else built on it.
2. **Sessions Are Immutable** — Once created, a session's core facts don't change in place. State transitions produce new records or events, not edits.
3. **Events Are Append-Only** — Events are the permanent history. They are never deleted or modified after being written.
4. **Repositories Are Interfaces** — The Engine defines what a repository must do, never how. Storage details belong to Infrastructure.
5. **Infrastructure Implements Interfaces** — Concrete implementations (Firestore, or anything else) live outside the Engine and fulfill its contracts.
6. **Applications Are Replaceable** — An Application can be deleted or swapped without the Engine, Kernel, or Infrastructure needing to change.
7. **Kernel Owns Startup** — All initialization, configuration loading, and dependency wiring happens in the Kernel, and only in the Kernel.
8. **AccessEngine.process() Is the Only Entry Point** — No Application talks to the Engine's internals directly; every request goes through this one call.
9. **Policies Never Mutate State** — Policies decide what's allowed; they don't perform the action themselves. Evaluation and execution stay separate.
10. **Version Everything That Changes** — Schemas, policies, and contracts are versioned so that changes are traceable and backward compatibility can be reasoned about explicitly.
