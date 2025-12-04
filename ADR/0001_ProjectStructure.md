ADR-0001: Choosing Modular Architecture

## Context

We needed an architecture that is easy to navigate, scales with new features, keeps code isolated, and avoids unnecessary complexity.

The options considered were:

- Layered (controller/service/repository)
- Hexagonal (ports & adapters)
- Modular (feature-based)

### Decision

Use a Modular Architecture, where each feature (e.g., users, accounts) contains its own controller, service, repository, routes, and tests.

### Why

- Good starting point when the project goal is not clear
- Reduces coupling between unrelated features
- Easier to test: each module is self-contained
- Faster development and onboarding
- Avoids the heavy abstraction and boilerplate of Hexagonal
- Can evolve into Hexagonal in the future if needed
