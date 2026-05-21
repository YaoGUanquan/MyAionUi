# U4 Source Readiness Check - 2026-05-21

## Source Discovery

- `src` present: no
- `src/renderer` present: no
- Candidate integration files discovered: none

## Decision

- [ ] Ready for U4 code wiring
- [x] Blocked (missing source)

## Next Action

1. 先同步/引入上游 AionUi 前端源码。
2. 重新执行源码扫描：
   - `rg --files src`
   - `rg -n "menu|sidebar|route|router|conversation|domain" src`
3. 若扫描结果包含导航与路由接线文件，再进入 U4 代码实施。

## Impact

- 本轮不能执行 `src/renderer/extensions/domain-shell/*` 的真实代码创建。
- 允许继续推进 U2（同步治理）和 U5（协议文档）任务。