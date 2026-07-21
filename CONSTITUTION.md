# Access Engine Constitution

## Article 1: Identity is Global
Identities exist once, across all organizations.

## Article 2: Sessions are the Source of Truth
Everything derives from sessions: analytics, billing, occupancy, attendance.

## Article 3: Events are Immutable
Events are append-only. Never deleted or modified.

## Article 4: The Engine is Application-Agnostic
The engine never knows what application is using it.

## Article 5: Credentials Prove Identity, Not Tenancy
Tenancy is resolved from context.

## Article 6: Policies are Owned by Organizations
Applications provide templates. Organizations own rules.

## Article 7: Infrastructure Depends on the Engine
The engine depends on interfaces. Infrastructure implements them.

## Article 8: The Request Pipeline is the Only Entry Point
All requests flow through the pipeline. No bypassing.

## Article 9: Kernel Owns Startup
The kernel loads plugins, configures DI, and starts the system.

## Article 10: Applications are Replaceable
Deleting an application should not change the core.
