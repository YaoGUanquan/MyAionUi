# Upstream Sync Strategy (AionUi Domain Extension)

## 1. 目标与适用范围

本策略用于 `ph-AionUi` 在做 domain extension（`wechat`/`trade`）时，持续同步上游 `AionUi`，并将同步风险控制在壳层扩展边界内。

适用范围：
- 上游同步检查
- 发版前同步门禁
- 冲突分类与阻断决策

## 2. 分支职责

- `upstream/main`
  - 官方镜像基线，只用于跟踪上游。
- `main`
  - 当前可发布主线，只接收通过回归验证的变更。
- `feature/domain-*`
  - 域能力开发分支（U4/U5 及后续）。

## 3. 同步节奏

- 固定每周一次同步检查（建议周四）。
- 每次发版前必须执行一次同步检查。

## 4. 必跑命令

```bash
git remote -v
git fetch upstream
git rev-list --left-right --count upstream/main...main
git diff --name-only upstream/main...main
```

命令输出必须记录到同步报告（见模板）。

## 5. 冲突分类

- 壳层冲突（可处理）
  - 导航、路由、扩展接线、`extensions` 目录相关。
- 核心冲突（高风险）
  - 会话引擎核心、框架引导、基础运行时关键路径。

## 6. 发布阻断规则

出现以下任一条件时阻断发布：

- 核心冲突占比 > 20%。
- 存在未解决核心冲突。
- 同步后无法给出明确“继续/暂停”结论。

## 7. 结果判定

- Continue
  - 可继续 U4/U5 开发或发布准备。
- Resolve-first
  - 先清冲突再继续。
- Block
  - 暂停推进并执行回退/重审。

## 8. 回退与恢复

- 回退到最近一个通过门禁的发布标签。
- 收缩壳层改动边界，复核扩展点白名单。
- 重新同步并复跑检查命令。

## 9. 交付物

每次同步至少产出：

- `docs/00-process/active/<date>-upstream-sync-drill.md`
- 内容含：ahead/behind、冲突列表、冲突分类、最终结论、后续动作。