# Design Spec: domain-extension-u2-u4-u5

- Date: 2026-05-21
- Status: Draft for review
- Source requirements: `docs/ae/brainstorms/2026-05-20-conversation-domain-requirements.md`
- Related plan: `docs/ae/plans/2026-05-21-002-domain-extension-u2-u4-u5-execution-plan.md`

## 1. Problem and Scope

本设计聚焦最小闭环 `U2 + U4 + U5`，目标是在不改官方既有功能的前提下，为 AionUi 新增 `公众号` 与 `外贸` 域化入口，并冻结统一对话动作协议，同时确保后续可持续同步上游更新。

In scope:
- U2: 上游同步与分支策略（可执行、可审计）。
- U4: 域菜单与路由骨架（壳层最小接线）。
- U5: Domain Action Contract（统一请求/响应与确认语义）。

Out of scope:
- 不实现业务网关、鉴权系统、审计系统的生产能力（U6+）。
- 不实现公众号/外贸平台 SDK 对接细节。
- 不在本阶段编写产品实现代码。

## 2. Confirmed Decisions

1. 入口可见性：首版全员可见。
2. 写操作确认：采用对话内确认，不使用弹窗。
3. 幂等键：`idempotencyKey` 由前端生成并透传。
4. 上游同步：每周一次 + 发版前强制一次。
5. 推进路径：先文档定边界（推荐方案 1），再转 implementation planning。

## 3. Architecture Overview

### 3.1 Flow by unit

1. U2 先行：定义同步规则与冲突门禁，保证后续改动可持续。
2. U4 次之：只在前端壳层新增域入口和域路由，不改核心会话引擎。
3. U5 并行冻结：统一两域动作协议，约束后续网关与前端接口语义。

### 3.2 Boundary principles

- 菜单层只做 domain 选择。
- 路由层只做 domain 上下文注入。
- 业务动作语义由统一协议承载。
- 所有改动优先收敛在扩展目录，降低上游冲突面。

## 4. U2 Design: Upstream Sync Strategy

### 4.1 Branch roles

- `upstream/main`: 官方镜像基线。
- `main`: 可发布主线。
- `feature/domain-*`: 域能力开发分支。

### 4.2 Sync cadence

- 固定每周一次同步检查。
- 每次发版前强制同步一次。

### 4.3 Required outputs per sync

- ahead/behind 统计（`main` vs `upstream/main`）。
- 冲突文件清单与分类：壳层冲突 / 核心冲突。
- 同步结论：继续开发 / 先清冲突 / 暂停并回退。

### 4.4 Artifacts

- `docs/02-design/upstream-sync-strategy.md`
- `docs/05-reports/upstream-sync-check-template.md`
- `docs/00-process/active/<date>-upstream-sync-drill.md`

### 4.5 Error handling and rollback signals

- 核心冲突占比超过阈值（例如 >20%）时，阻断后续功能推进。
- 连续两次同步出现核心冲突时，触发扩展边界重审。

## 5. U4 Design: Domain Entry Shell

### 5.1 Goal

新增 `公众号` 与 `外贸` 两个入口，使用户进入对应域会话上下文：
- `公众号` -> `domain=wechat`
- `外贸` -> `domain=trade`

### 5.2 Planned file boundaries

- `src/renderer/extensions/domain-shell/domain-menu.ts`
- `src/renderer/extensions/domain-shell/domain-routes.tsx`
- `src/renderer/extensions/domain-shell/DomainLandingPage.tsx`
- `src/renderer/extensions/domain-shell/README.md`
- `docs/02-design/aionui-extension-points.md`

### 5.3 Data flow

1. 用户点击侧边栏域入口。
2. 路由层写入对应 `domain` 上下文。
3. 会话容器读取 `domain` 并显示域化会话。
4. 后续动作请求按 U5 协议发出。

### 5.4 Error handling and safeguards

- 路由冲突或菜单状态异常时，降级为“隐藏入口 + 日志模式”。
- 原有菜单行为必须保持不变，出现回归即阻断发布。

### 5.5 Current constraint

当前仓库尚未检索到 `src/renderer`；本设计先冻结文件级边界，待上游源码到位后再执行代码接线。

## 6. U5 Design: Domain Action Contract

### 6.1 Request schema (v1 required fields)

- `version`
- `domain` (`wechat | trade`)
- `intent`
- `action`
- `payload`
- `requiresConfirmation`
- `idempotencyKey` (frontend generated)
- `clientRequestId` (recommended)
- `timestamp` (recommended)

### 6.2 Response schema (v1 required fields)

- `status` (`pending_confirmation | confirmed | rejected | succeeded | failed`)
- `humanMessage`
- `machineCode`
- `traceId`
- `confirmationToken` (required when `pending_confirmation`)
- `result` (when succeeded)
- `error` (when failed/rejected)

### 6.3 Two-phase confirmation flow

Phase A:
- 用户发起高风险写操作。
- 返回 `pending_confirmation + confirmationToken`。

Phase B:
- 用户在对话内确认。
- 执行后返回 `succeeded` 或 `failed`。
- 未确认或取消返回 `rejected`。

### 6.4 Idempotency behavior

- 同一 `idempotencyKey` 重放不得重复写入。
- 重放响应需要可识别为幂等命中。

### 6.5 Contract artifacts

- `docs/04-api/domain-action-contract.md`
- `docs/04-api/examples/domain-action-examples.json`
- `docs/04-api/domain-action-schema.json`

## 7. Testing and Validation Strategy

### 7.1 U2 validation

- 能输出同步差异、冲突分类和继续/阻断结论。
- 可审计同步记录可追溯。

### 7.2 U4 validation

- 两个菜单可见并能进入正确域。
- 原菜单无回归。
- 扩展逻辑主要位于 `extensions/domain-shell`。

### 7.3 U5 validation

- `wechat` 与 `trade` 示例均可通过 JSON 解析和 schema 校验。
- 高风险动作确认语义一致。
- 幂等重放行为一致。

## 8. Milestones

1. M1 (U2): 同步策略与演练模板落地。
2. M2 (U4): 扩展点白名单与路由骨架实施清单冻结。
3. M3 (U5): 协议文档 + 示例 + schema 冻结。

## 9. Risks and Mitigations

- 风险：仓库无前端源码，U4 无法立刻编码。
  - 缓解：先完成白名单和接线策略，源码到位后按清单执行。
- 风险：协议字段漂移导致联调返工。
  - 缓解：先冻结 v1 最小必填字段，变更走版本策略。
- 风险：上游冲突高频出现。
  - 缓解：冲突分级 + 核心冲突阈值阻断。

## 10. Open Questions (carry-forward)

1. 域入口后续是否要引入租户级可见性。
2. 确认 token 的有效期和撤销窗口。
3. `machineCode` 枚举范围与扩展规则。

## 11. Next Step

本设计经你确认后，下一步进入 writing-plans，将本设计转为分步骤实施计划，并在 `ae-work` 中按 U2 -> U4 -> U5 顺序执行。
