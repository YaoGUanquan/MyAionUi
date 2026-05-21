# Upstream Sync Check Report Template

- Date:
- Operator:
- Branch:

## 1. Command Outputs

### `git remote -v`

```text
<fill actual output>
```

### `git rev-list --left-right --count upstream/main...main`

```text
<fill actual output>
```

### `git diff --name-only upstream/main...main`

```text
<fill actual output>
```

## 2. Conflict Summary

- Shell-layer files:
- Core files:
- Core conflict ratio:

## 3. Decision

- [ ] Continue implementation
- [ ] Resolve conflicts first
- [ ] Block and rollback

## 4. Rationale

- Why this decision:
- Risks observed:

## 5. Follow-up Actions

- Action 1:
- Action 2:
