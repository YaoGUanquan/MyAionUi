# Domain Extension U2 U4 U5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first executable foundation for domain extension by completing upstream sync governance (U2), shell-entry integration prerequisites (U4), and a frozen domain action contract (U5) without touching unrelated product behavior.

**Architecture:** Work in three layers. First, establish upstream sync guardrails and evidence outputs. Second, freeze domain contract artifacts used by both `wechat` and `trade`. Third, gate U4 code wiring behind a source-availability checkpoint, then apply shell-only integration in `src/renderer/extensions/domain-shell` once upstream source is present.

**Tech Stack:** Git, Markdown docs, JSON/JSON Schema, Node.js (for JSON validation), npm tooling (if AionUi source is present)

---

## File Structure and Responsibilities

- `docs/02-design/upstream-sync-strategy.md`
  - Defines branch roles, sync cadence, conflict classes, and release blocking rules.
- `docs/05-reports/upstream-sync-check-template.md`
  - Standard execution report template for each sync run.
- `docs/00-process/active/2026-05-21-upstream-sync-drill.md`
  - First drill record with actual command outputs and conclusion.
- `docs/04-api/domain-action-contract.md`
  - Human-readable contract specification for U5.
- `docs/04-api/domain-action-schema.json`
  - Machine-validated schema for request/response structures.
- `docs/04-api/examples/domain-action-examples.json`
  - Canonical examples for `wechat` and `trade`, including idempotency replay.
- `docs/02-design/aionui-extension-points.md`
  - U4 integration white-list/black-list and shell-only touch policy.
- `docs/00-process/active/2026-05-21-u4-source-readiness-check.md`
  - Source readiness checkpoint report for `src/renderer` availability.
- `src/renderer/extensions/domain-shell/domain-menu.ts` (created only after source checkpoint passes)
- `src/renderer/extensions/domain-shell/domain-routes.tsx` (created only after source checkpoint passes)
- `src/renderer/extensions/domain-shell/DomainLandingPage.tsx` (created only after source checkpoint passes)
- `src/renderer/extensions/domain-shell/README.md` (created only after source checkpoint passes)

### Task 1: Lock U2 Upstream Sync Strategy Docs

**Files:**
- Create: `docs/02-design/upstream-sync-strategy.md`
- Create: `docs/05-reports/upstream-sync-check-template.md`

- [ ] **Step 1: Write strategy document with fixed sections**

```markdown
# Upstream Sync Strategy (AionUi Domain Extension)

## 1. Branch Roles
- upstream/main: official mirror baseline
- main: release branch
- feature/domain-*: implementation branches

## 2. Sync Cadence
- Weekly sync every Thursday
- Mandatory sync before each release cut

## 3. Required Check Commands
- git remote -v
- git fetch upstream
- git rev-list --left-right --count upstream/main...main
- git diff --name-only upstream/main...main

## 4. Conflict Classification
- Shell-layer conflict: nav/router/extensions integration
- Core conflict: conversation engine/framework internals

## 5. Release Blocking Rules
- Block if core conflict ratio > 20%
- Block if unresolved core conflict exists

## 6. Recovery
- Roll back to latest passing release tag
- Re-scope shell touch points before retry
```

- [ ] **Step 2: Write sync check template**

```markdown
# Upstream Sync Check Report Template

- Date:
- Operator:
- Branch:

## Command Outputs
- `git remote -v`
- `git rev-list --left-right --count upstream/main...main`
- `git diff --name-only upstream/main...main`

## Conflict Summary
- Shell-layer files:
- Core files:
- Core conflict ratio:

## Decision
- [ ] Continue implementation
- [ ] Resolve conflicts first
- [ ] Block and rollback

## Notes
- Risks:
- Follow-up actions:
```

- [ ] **Step 3: Validate both docs exist and are non-empty**

Run: `rg --files docs/02-design docs/05-reports | rg "upstream-sync-strategy.md|upstream-sync-check-template.md"`
Expected: two matching file paths

- [ ] **Step 4: Commit**

```bash
git add docs/02-design/upstream-sync-strategy.md docs/05-reports/upstream-sync-check-template.md
git commit -m "docs: define upstream sync strategy and report template"
```

### Task 2: Run and Record First U2 Sync Drill

**Files:**
- Create: `docs/00-process/active/2026-05-21-upstream-sync-drill.md`
- Modify: `docs/02-design/upstream-sync-strategy.md` (only if command reality differs)

- [ ] **Step 1: Collect upstream status evidence**

Run:
```bash
git remote -v
git fetch upstream
git rev-list --left-right --count upstream/main...main
git diff --name-only upstream/main...main
```
Expected: command outputs captured without fatal error

- [ ] **Step 2: Write drill report from template with real output excerpts**

```markdown
# Upstream Sync Drill - 2026-05-21

## Snapshot
- Ahead/Behind: <left-right count>
- Diff file count: <N>

## Classification
- Shell-layer: <list>
- Core: <list>

## Decision
- Continue / Resolve-first / Block

## Rationale
- <short factual justification>
```

- [ ] **Step 3: Validate decision consistency with strategy rules**

Run: `rg -n "Block|Continue|Resolve" docs/00-process/active/2026-05-21-upstream-sync-drill.md docs/02-design/upstream-sync-strategy.md`
Expected: decision language exists in both files and does not conflict

- [ ] **Step 4: Commit**

```bash
git add docs/00-process/active/2026-05-21-upstream-sync-drill.md docs/02-design/upstream-sync-strategy.md
git commit -m "docs: add first upstream sync drill evidence"
```

### Task 3: Freeze U5 Contract Docs and Schema

**Files:**
- Create: `docs/04-api/domain-action-contract.md`
- Create: `docs/04-api/domain-action-schema.json`
- Create: `docs/04-api/examples/domain-action-examples.json`

- [ ] **Step 1: Write contract doc with exact v1 fields and state model**

```markdown
# Domain Action Contract v1

## Request
- version
- domain (wechat|trade)
- intent
- action
- payload
- requiresConfirmation
- idempotencyKey (frontend generated)
- clientRequestId (recommended)
- timestamp (recommended)

## Response
- status (pending_confirmation|confirmed|rejected|succeeded|failed)
- humanMessage
- machineCode
- traceId
- confirmationToken (required when pending_confirmation)
- result (when succeeded)
- error (when failed/rejected)

## Two-phase Confirmation
1) Request write action -> pending_confirmation
2) Confirm in-chat -> succeeded/failed
Unconfirmed or canceled -> rejected
```

- [ ] **Step 2: Write JSON schema covering request/response required fields**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "DomainActionEnvelopeV1",
  "type": "object",
  "required": ["version", "domain", "intent", "action", "payload", "requiresConfirmation", "idempotencyKey"],
  "properties": {
    "version": { "type": "string", "const": "v1" },
    "domain": { "type": "string", "enum": ["wechat", "trade"] },
    "intent": { "type": "string", "minLength": 1 },
    "action": { "type": "string", "minLength": 1 },
    "payload": { "type": "object" },
    "requiresConfirmation": { "type": "boolean" },
    "idempotencyKey": { "type": "string", "minLength": 8 },
    "clientRequestId": { "type": "string" },
    "timestamp": { "type": "string" }
  },
  "additionalProperties": false
}
```

- [ ] **Step 3: Write examples for wechat/trade + idempotency replay**

```json
{
  "cases": [
    {
      "name": "wechat_publish_draft_pending_confirmation",
      "request": {
        "version": "v1",
        "domain": "wechat",
        "intent": "publish_article",
        "action": "push_draft",
        "payload": { "title": "A", "body": "B" },
        "requiresConfirmation": true,
        "idempotencyKey": "idem-wechat-001"
      },
      "response": {
        "status": "pending_confirmation",
        "humanMessage": "Please confirm push draft",
        "machineCode": "PENDING_CONFIRMATION",
        "traceId": "trace-001",
        "confirmationToken": "ct-001"
      }
    },
    {
      "name": "trade_list_product_pending_confirmation",
      "request": {
        "version": "v1",
        "domain": "trade",
        "intent": "list_product",
        "action": "publish_listing",
        "payload": { "sku": "SKU-1", "price": 99.5 },
        "requiresConfirmation": true,
        "idempotencyKey": "idem-trade-001"
      },
      "response": {
        "status": "pending_confirmation",
        "humanMessage": "Please confirm product listing",
        "machineCode": "PENDING_CONFIRMATION",
        "traceId": "trace-002",
        "confirmationToken": "ct-002"
      }
    },
    {
      "name": "trade_idempotency_replay",
      "request": {
        "version": "v1",
        "domain": "trade",
        "intent": "list_product",
        "action": "publish_listing",
        "payload": { "sku": "SKU-1", "price": 99.5 },
        "requiresConfirmation": true,
        "idempotencyKey": "idem-trade-001"
      },
      "response": {
        "status": "succeeded",
        "humanMessage": "Idempotent replay, original result returned",
        "machineCode": "IDEMPOTENT_REPLAY",
        "traceId": "trace-002"
      }
    }
  ]
}
```

- [ ] **Step 4: Validate JSON parse**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('docs/04-api/domain-action-schema.json','utf8'));JSON.parse(require('fs').readFileSync('docs/04-api/examples/domain-action-examples.json','utf8'));console.log('ok')"
```
Expected: `ok`

- [ ] **Step 5: Validate contract field coverage**

Run: `rg -n "idempotencyKey|requiresConfirmation|traceId|pending_confirmation|wechat|trade" docs/04-api/domain-action-contract.md docs/04-api/examples/domain-action-examples.json`
Expected: all keywords found

- [ ] **Step 6: Commit**

```bash
git add docs/04-api/domain-action-contract.md docs/04-api/domain-action-schema.json docs/04-api/examples/domain-action-examples.json
git commit -m "docs(api): freeze domain action contract v1"
```

### Task 4: U4 Source Readiness Gate (Before Any Frontend Code)

**Files:**
- Create: `docs/00-process/active/2026-05-21-u4-source-readiness-check.md`
- Create: `docs/02-design/aionui-extension-points.md`

- [ ] **Step 1: Check source availability for renderer shell wiring**

Run:
```bash
rg --files src
rg -n "menu|sidebar|route|router|conversation|domain" src
```
Expected: if `src` exists, command returns file list and matches; if missing, record as blocker

- [ ] **Step 2: Record readiness decision**

```markdown
# U4 Source Readiness Check - 2026-05-21

- `src` present: yes/no
- `src/renderer` present: yes/no
- Candidate integration files discovered: <list or none>

## Decision
- [ ] Ready for U4 code wiring
- [ ] Blocked (missing source)

## Next Action
- If blocked: sync/import upstream source tree, rerun this check
- If ready: proceed Task 5
```

- [ ] **Step 3: Write extension points design with white-list / black-list**

```markdown
# AionUi Extension Points for Domain Shell

## White-list (allowed)
- src/renderer/extensions/domain-shell/**
- minimal shell wiring files identified during readiness scan

## Black-list (disallowed for U4)
- conversation engine core files
- framework bootstrap internals unrelated to nav/router injection

## Rule
- Any change outside white-list requires explicit design update before implementation.
```

- [ ] **Step 4: Commit**

```bash
git add docs/00-process/active/2026-05-21-u4-source-readiness-check.md docs/02-design/aionui-extension-points.md
git commit -m "docs: add U4 source readiness gate and extension boundaries"
```

### Task 5: U4 Shell Code Wiring (Execute Only If Task 4 Is Ready)

**Files:**
- Create: `src/renderer/extensions/domain-shell/domain-menu.ts`
- Create: `src/renderer/extensions/domain-shell/domain-routes.tsx`
- Create: `src/renderer/extensions/domain-shell/DomainLandingPage.tsx`
- Create: `src/renderer/extensions/domain-shell/README.md`
- Modify: exact nav/router integration files discovered in Task 4
- Test: router/menu tests in existing frontend test layout

- [ ] **Step 1: Write failing route mapping test for domain entries**

```ts
import { resolveDomainFromRoute } from "../domain-routes";

describe("domain route mapping", () => {
  it("maps wechat route to wechat domain", () => {
    expect(resolveDomainFromRoute("/domains/wechat")).toBe("wechat");
  });

  it("maps trade route to trade domain", () => {
    expect(resolveDomainFromRoute("/domains/trade")).toBe("trade");
  });
});
```

- [ ] **Step 2: Run targeted test to confirm fail**

Run: `npm test -- domain-routes`
Expected: FAIL due to missing implementation

- [ ] **Step 3: Implement minimal domain shell files**

```ts
// domain-menu.ts
export const domainMenuItems = [
  { key: "wechat", label: "公众号", route: "/domains/wechat" },
  { key: "trade", label: "外贸", route: "/domains/trade" }
];
```

```ts
// domain-routes.tsx
export type DomainKey = "wechat" | "trade";

export function resolveDomainFromRoute(pathname: string): DomainKey | null {
  if (pathname === "/domains/wechat") return "wechat";
  if (pathname === "/domains/trade") return "trade";
  return null;
}
```

```tsx
// DomainLandingPage.tsx
import React from "react";

export function DomainLandingPage({ domain }: { domain: "wechat" | "trade" }) {
  return <div data-domain={domain}>Domain session: {domain}</div>;
}
```

- [ ] **Step 4: Wire menu and router in discovered shell files**

```ts
// pseudo-integration snippet shape (replace with actual discovered files)
import { domainMenuItems } from "./extensions/domain-shell/domain-menu";
// append domainMenuItems to sidebar model
```

```tsx
// pseudo-router snippet shape
import { DomainLandingPage } from "./extensions/domain-shell/DomainLandingPage";
// register /domains/wechat and /domains/trade routes
```

- [ ] **Step 5: Run build and targeted tests**

Run:
```bash
npm run build
npm test -- domain-routes
```
Expected: build success, tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/renderer/extensions/domain-shell/ <actual-nav-router-files> <test-files>
git commit -m "feat(ui): add wechat and trade domain shell entries"
```

### Task 6: Final Cross-Unit Verification and Handoff

**Files:**
- Modify: `docs/00-process/active/2026-05-21-upstream-sync-drill.md` (append final conclusion)
- Modify: `docs/00-process/active/2026-05-21-u4-source-readiness-check.md` (append execution status)
- Create: `docs/ae/handoffs/2026-05-21-u2-u4-u5-implementation-handoff.md`

- [ ] **Step 1: Verify U2/U4/U5 acceptance checklist**

```markdown
- [ ] U2 evidence exists and decision is non-contradictory
- [ ] U5 schema/examples valid and fields complete
- [ ] U4: either implemented (if ready) or explicitly blocked with next action
```

- [ ] **Step 2: Run final command bundle**

Run:
```bash
rg --files docs/02-design docs/04-api docs/05-reports docs/00-process/active
node -e "JSON.parse(require('fs').readFileSync('docs/04-api/domain-action-schema.json','utf8'));JSON.parse(require('fs').readFileSync('docs/04-api/examples/domain-action-examples.json','utf8'));console.log('contract-ok')"
```
Expected: expected file set found, `contract-ok` printed

- [ ] **Step 3: Write handoff summary**

```markdown
# U2 U4 U5 Implementation Handoff

## Completed
- <list>

## Blocked
- <list>

## Ready Next
- U6 gateway architecture execution prep
- U4 implementation continuation (if source was blocked)
```

- [ ] **Step 4: Commit**

```bash
git add docs/00-process/active/ docs/ae/handoffs/2026-05-21-u2-u4-u5-implementation-handoff.md
git commit -m "docs: handoff for u2 u4 u5 implementation status"
```

## Spec Coverage Self-Check

- Covers sync governance requirement: yes (Tasks 1-2).
- Covers domain shell requirement: yes (Tasks 4-5 with readiness gate).
- Covers unified action contract requirement: yes (Task 3).
- Covers validation and rollback signals: yes (all tasks include commands and decision points).

## Placeholder Scan Self-Check

- No `TBD`/`TODO` placeholders.
- No "implement later" phrasing.
- Each code-change step includes concrete snippet or command.

## Type and Naming Consistency Self-Check

- Domain values consistently use `wechat` and `trade`.
- Confirmation state consistently uses `pending_confirmation` and `rejected`/`succeeded`/`failed`.
- Idempotency field consistently uses `idempotencyKey`.
