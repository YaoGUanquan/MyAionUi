# Upstream Sync Drill - 2026-05-21

## Snapshot

- 执行目标：按 `docs/02-design/upstream-sync-strategy.md` 跑首次同步证据采集。
- 结论：**Resolve-first（先修复环境后再同步）**。

## Command Outputs

### `git remote -v`

```text
origin  https://github.com/YaoGUanquan/MyAionUi.git (fetch)
origin  https://github.com/YaoGUanquan/MyAionUi.git (push)
upstream  https://github.com/iOfficeAI/AionUi.git (fetch)
upstream  https://github.com/iOfficeAI/AionUi.git (push)
```

### `git fetch upstream`

```text
success
```

### `git rev-list --left-right --count upstream/main...main`

```text
fatal: ambiguous argument 'upstream/main...main': unknown revision or path not in the working tree.
```

### `git diff --name-only upstream/main...main`

```text
fatal: ambiguous argument 'upstream/main...main': unknown revision or path not in the working tree.
```

## Conflict Summary

- Shell-layer files: N/A（未进入 diff 阶段）
- Core files: N/A（未进入 diff 阶段）
- Core conflict ratio: N/A（未进入 diff 阶段）

## Decision

- [ ] Continue implementation
- [x] Resolve conflicts first
- [ ] Block and rollback

## Rationale

- 当前仓库的 `upstream` 远端已配置，且 `upstream/main` 可解析。
- 本地 `main` 仍是空分支，没有任何提交，无法参与 `upstream/main...main` 的比较。
- 在本地 `main` 尚未建立提交基线前，不满足 U2 的“可量化同步状态”要求。

## Follow-up Actions

1. 将本地仓库与上游源码建立有效提交基线。
2. 基线建立后，重新执行四条必跑命令并更新本报告。
3. 得到 ahead/behind 与冲突清单后，再判定是否继续 U4/U5 实施。
