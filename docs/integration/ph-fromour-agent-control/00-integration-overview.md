# PH-Fromour Agent Control Integration Overview

## Purpose

This directory records the consumer-side integration contract for connecting `ph-AionUi` to the remote `ph-fromour` agent-control adapter.

This documentation is for the caller side only. It should not redefine the remote API contract owned by `ph-fromour`.

## Source of Truth

- Remote provider contract lives in `ph-fromour/docs/integration/agent-control/`.
- This directory records how the current project consumes that contract.

## Scope

Current integration scope:

- `product.query`
- `product.rename`
- `product.publish`
- `product.unpublish`

Out of scope for now:

- stage 2 operation actions
- generic action registration
- multi-project unified registry

## Consumer Responsibilities

- collect target `baseUrl`, `userId`, and long-lived credential
- exchange credential for remote access token
- generate local session token
- map conversation actions to fixed white-listed remote actions
- render success, rejection, and error states clearly

## Provider Responsibilities

`ph-fromour` is responsible for:

- remote API paths
- request and response schema
- remote token issuance
- action authorization
- audit persistence
- idempotency semantics

## Working Rule

- Do not duplicate full API schema in this directory unless needed for local testing.
- Prefer linking or referencing the provider contract.
- Record local mapping, UX rules, and open integration issues here.
