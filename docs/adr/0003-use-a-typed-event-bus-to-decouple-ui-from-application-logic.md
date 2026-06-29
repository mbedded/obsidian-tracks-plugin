# 3. Use a typed event bus to decouple UI from application logic

Date: 2026-05-02

## Status

Accepted

## Context

This plugin has some UI components and user interaction.
The user actions should not be directly coupled to the UI implementation.
So we should decouple UI from application logic to improve maintainability and testability.

## Decision

We will use a typed event bus as a boundary between UI components and application logic.
These events will be defined centrally using TypeScript types, so das  
Events will be defined centrally using TypeScript types so that event names are explicit and discoverable.
Furthermore, we have typed arguments to ensure that event payloads are checked at compile time.

The event bus should be used for cross-boundary communication between UI and application logic.
It should not replace local component state, direct parent-child communication
or simple function calls where those are clearer and more appropriate.

## Examples / Use-cases


The typed event bus should be used when a user action represents application intent
and may need to affect plugin state, application services or multiple UI components.

Typical use cases include:

- **User executes plugin commands**
  - Obsidian is able to register and show events to the user like "reload all tasks".
  - The user triggers a command registered by the plugin.
  - Application logic subscribes to the event and performs the required behavior.
    This affects the plugin state and UI but comes from the users intent.

- **User interacts with UI elements that affect other components**
  - A user clicks, selects, toggles, submits or otherwise interacts with a UI element.
  - The interaction causes a change that is relevant outside the local component.
  - The component publishes a typed event instead of directly modifying unrelated components.


## Consequences

### Positive

- UI components become less coupled to application services and implementation details.
- Event contracts are explicit and type-checked.
- New subscribers can react to existing events without changing the publishing component.
- The application gains a clearer separation between user intent and business logic.

### Negative

- Event-driven flows can be harder to trace than direct function calls.
- Overuse of the event bus may make control flow less obvious.
- Event names and payloads require careful design and maintenance.
- Debugging may require additional logging or tooling to understand event order and subscribers.
