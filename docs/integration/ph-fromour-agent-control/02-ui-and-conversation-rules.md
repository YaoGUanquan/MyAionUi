# UI And Conversation Rules

## Interaction Rules

- Use explicit confirmation before write actions when intent is ambiguous.
- Show target project and target product ID before executing write actions.
- Surface remote rejection reasons without exposing secrets.

## Confirmation Guidance

Recommended confirmation before:

- `product.rename`
- `product.publish`
- `product.unpublish`

Confirmation can be skipped only when the user intent is explicit and the target entity is unambiguous.

## Result Presentation

For success:

- show action name
- show target product ID
- show changed fields summary

For failure:

- show remote error code if available
- show human-readable failure summary
- suggest re-exchange when token expiration is the cause

## Safety Rules

- Never echo long-lived credential back to the user.
- Avoid storing remote token outside active session context.
- If target identity is unclear, ask for clarification instead of guessing.
