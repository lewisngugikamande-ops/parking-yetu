# Access Engine Architecture

## Layer Diagram

## Dependency Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| Foundation | Nothing | Everything else |
| Kernel | Foundation | Engine, Infrastructure, Applications |
| Engine | Foundation, Kernel | Infrastructure, Applications |
| Infrastructure | Foundation, Kernel, Engine | Applications |
| Applications | Everything | N/A |

## The One Entry Point
