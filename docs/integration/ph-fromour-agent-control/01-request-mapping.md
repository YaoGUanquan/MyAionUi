# Request Mapping

## Goal

Map local conversation intents and UI actions to the fixed remote `ph-fromour` agent-control APIs.

## Action Mapping

| Local intent | Remote action | Notes |
| --- | --- | --- |
| Query product | `product.query` | requires `productId` |
| Rename product | `product.rename` | requires `productId` and `newName` |
| Publish product | `product.publish` | requires `productId` |
| Unpublish product | `product.unpublish` | requires `productId` |

## Token Flow Mapping

1. User provides `baseUrl`, `userId`, and long-lived credential.
2. Current project calls `session/exchange`.
3. Current project stores remote short-lived token in memory only.
4. Current project generates a local session token.
5. Action request sends both tokens plus `requestId`.

## Data Handling Rules

- Long-lived credential must not be written into durable AI memory.
- Do not log credential plaintext in frontend, backend, or conversation summaries.
- Prefer in-memory session handling for remote short-lived tokens.

## To Be Refined

- exact local DTO names
- exact error-to-toast mapping
- retry rules for token expiration
