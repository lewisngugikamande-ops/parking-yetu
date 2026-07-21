# ADR-007: Animated Transport Background

## Status
Accepted

## Context
Parking Yetu needed a background that reinforces the product domain without distracting from content.

## Decision
Use animated transport emojis in the background.

## Consequences

### Benefits
- Reinforces "Movement" brand value
- Creates a living, active atmosphere
- Subtle enough to not distract
- Performance-friendly (CSS animations)

### Tradeoffs
- May not work in all browsers (graceful fallback)
- Additional CSS maintenance

## Implementation
- CSS animations (GPU-accelerated)
- Multiple lanes with different speeds
- Device-responsive scaling
- Respects prefers-reduced-motion
- Uses `will-change: transform` for performance
