# Parking Yetu — Non-Negotiables

These are the principles we will never compromise, regardless of version, feature, or timeline.

---

## Operator Experience

**The operator never waits unnecessarily.**

If something takes more than 300ms, we show progress.
If something takes more than 2 seconds, we explain why.
If something fails, we tell them what to do next.

**The operator is never surprised.**

Every action has a predictable outcome.
Every state change is communicated.
Every error is explained.

**Confidence is a feature.**

After every interaction, the operator should be more confident than before.

---

## Design

**Movement always has meaning.**

We animate consequences, never decoration.
Every animation communicates something that happened.

**Accessibility is never optional.**

Keyboard navigation works.
Screen readers can understand every screen.
Reduced motion is respected.

**Dark mode is always supported.**

We default to dark. We never remove light mode.

**Every color communicates state.**

Purple = Identity.
Cyan = Live information.
Green = Success.
Amber = Warning.
Red = Problems.

---

## Engineering

**Simplicity before cleverness.**

Readable code outlives clever code.
We choose clarity over novelty.

**One source of truth.**

We never allow two places to own the same information.

**Every dependency must earn its place.**

A library should remove more complexity than it introduces.

**Restore before redesign.**

Before adding new visual elements, we ensure the existing ones are faithfully preserved.

---

## Evolution

**Refactor in small steps.**

The application should work after every commit.
We never break the product to improve the architecture.

**Respect the operator's memory.**

An experienced operator should never need to relearn the interface.
Evolution is welcome. Surprise is not.
