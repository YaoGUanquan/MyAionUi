# Test Cases

## Integration Smoke Cases

- exchange succeeds with valid `baseUrl`, `userId`, and credential
- exchange fails with invalid credential
- product query succeeds
- product rename succeeds
- product publish succeeds
- product unpublish succeeds
- expired remote token is rejected
- invalid local session token is rejected
- repeated write request with same `requestId` is idempotent

## Evidence To Capture

- request sample
- response sample
- target product before and after write action
- audit lookup result

## Deferred Cases

- stage 2 operation actions
- multi-project switching
- concurrent write collision behavior
