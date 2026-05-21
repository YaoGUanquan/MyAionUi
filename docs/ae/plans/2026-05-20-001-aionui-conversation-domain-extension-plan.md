---
type: plan
status: drafted
date: 2026-05-20
title: aionui-conversation-domain-extension
origin: user-request-2026-05-20
originFingerprint: "公众号与外贸统一为对话驱动，新增侧边栏入口并持续跟进官方更新"
---

# Plan: aionui-conversation-domain-extension

## Source

- 用户输入（2026-05-20）：
  - 基于 `iOfficeAI/AionUi` 二次开发。
  - 新功能以“新增侧边栏菜单 + 新页面”为主，不改官方既有功能。
  - 公众号与外贸都采用“对话驱动业务动作”的统一模式。
  - 需要兼顾官方持续更新同步。
- 上游参考：`https://github.com/iOfficeAI/AionUi`（本计划不直接改上游代码，仅规划落地路径）。

## Scope

- In Scope:
  - 在 AionUi 中新增两个业务域入口：`公众号`、`外贸`。
  - 两个入口都进入“域化对话上下文”，通过对话触发业务动作。
  - 设计统一业务网关协议（同一协议覆盖公众号与外贸）。
  - 设计安全与审计机制（确认、鉴权、幂等、日志）。
  - 设计“薄壳 Fork + 上游同步”升级策略。
- Out of Scope:
  - 不在本计划阶段实现具体公众号平台 SDK 细节。
  - 不在本计划阶段实现具体外贸平台 SDK/ERP 对接细节。
  - 不在本计划阶段实现生产级发布流程自动化（仅给出方案与验收条件）。

## Decisions

- D1: 采用“薄壳扩展”原则。
  - 仅在导航、路由、域会话装配层改动。
  - 业务动作编排与执行放到外部 Go 控制面（业务网关）。
- D2: 公众号与外贸统一为“对话驱动域”。
  - 对用户呈现为两个菜单；对系统呈现为同一调用协议 + 不同 domain。
- D3: 写操作强制确认。
  - 发布文章、上架商品、删除商品等写动作必须二次确认。
- D4: 上游同步以 `upstream/main` 周期性 Rebase/Merge 为主。
  - 自研改动收敛在最少文件，降低冲突面。

## Risks

- R1: 上游导航/路由结构调整导致扩展点失效。
- R2: 对话误触发高风险写操作（误发布、误删除）。
- R3: 多业务域共享网关时，权限隔离设计不当会造成越权。
- R4: 当前仓库未包含完整 AionUi 应用源码，部分文件路径需在引入上游源码后最终确认。

## Implementation Units

### U1 - 建立需求基线与验收口径

- Goal:
  - 把“公众号/外贸统一对话驱动”的需求转成可验证条目，避免后续口径漂移。
- Requirements covered:
  - 统一对话驱动（公众号与外贸一致）。
  - 新增侧边栏入口而非改官方旧功能。
- Depends on:
  - 无。
- Files:
  - `docs/ae/brainstorms/2026-05-20-conversation-domain-requirements.md`
  - `docs/ae/plans/2026-05-20-001-aionui-conversation-domain-extension-plan.md`
- Approach:
  - 固化术语：`domain`、`action`、`confirmation`、`idempotencyKey`、`auditLog`。
  - 给出最小可验收业务流：
    - 公众号：生成文章 -> 推送草稿箱。
    - 外贸：查询商品 -> 上架商品。
- Tests:
  - 文档一致性检查（术语是否单义）。
- Validation:
  - 评审通过后，不再出现“公众号是页面流程还是对话流程”的歧义。
- Rollback signals:
  - 若评审中出现多种冲突定义，暂停技术实施，先回到需求澄清。
- Deferred to implementation:
  - 具体 API 字段命名与错误码定义。

### U2 - 上游同步与分支策略落地

- Goal:
  - 建立可持续跟进 AionUi 官方更新的分支模型。
- Requirements covered:
  - 二开同时跟进官方更新。
- Depends on:
  - U1。
- Files:
  - `docs/02-design/upstream-sync-strategy.md`
  - `.git/config`（远端配置，执行时生效）
- Approach:
  - 约定分支：
    - `upstream/main`：官方镜像基线。
    - `main`：你的可发布线。
    - `feature/domain-*`：功能开发线。
  - 约定同步节奏：每周一次上游同步 + 冲突审计记录。
- Tests:
  - 进行一次空变更同步演练，验证流程可执行。
- Validation:
  - 能明确回答“当前发布版本落后上游多少提交、冲突在哪些文件”。
- Rollback signals:
  - 若一次同步出现大面积核心冲突，回退到“更薄壳”的改动边界。
- Deferred to implementation:
  - 自动化同步脚本（如 CI 机器人）。

### U3 - 前端扩展点清单与最小改动边界

- Goal:
  - 确认侧边栏、路由、会话初始化的最小改动文件集合。
- Requirements covered:
  - 新增菜单与页面，不侵入既有功能。
- Depends on:
  - U2（需要有完整上游源码工作树）。
- Files:
  - `docs/02-design/aionui-extension-points.md`
  - `src/renderer/**`（待上游源码到位后锁定具体文件）
- Approach:
  - 输出“允许改动白名单文件”与“禁止改动核心文件”列表。
  - 所有新增逻辑优先放 `src/renderer/extensions/` 目录下。
- Tests:
  - 代码审查检查：改动文件是否全部落在白名单内。
- Validation:
  - 单次功能开发 PR 中，核心路径改动行数占比低于约定阈值（例如 <20%）。
- Rollback signals:
  - 若每个功能都频繁触碰核心会话引擎文件，说明扩展边界设计失败。
- Deferred to implementation:
  - 白名单校验脚本。

### U4 - 域化路由与菜单骨架

- Goal:
  - 新增 `公众号`、`外贸` 菜单及对应域页面入口。
- Requirements covered:
  - 侧边栏新增入口。
  - 每个入口进入对话驱动域。
- Depends on:
  - U3。
- Files:
  - `src/renderer/extensions/domain-shell/domain-menu.ts`
  - `src/renderer/extensions/domain-shell/domain-routes.tsx`
  - `src/renderer/extensions/domain-shell/DomainLandingPage.tsx`
- Approach:
  - 菜单只负责切换 domain 上下文，不承载业务动作按钮。
  - 页面作为“域会话容器”，复用原对话 UI 能力。
- Tests:
  - 路由单测：进入 `wechat` 与 `trade` 页面时 domain 参数正确。
- Validation:
  - 点击两个菜单均能进入对应域会话，且不会影响原生菜单行为。
- Rollback signals:
  - 若新增菜单导致原菜单状态错乱或路由冲突，回滚到仅保留隐藏入口调试模式。
- Deferred to implementation:
  - 菜单图标、排序与权限显示策略。

### U5 - 统一对话动作协议（Domain Action Contract）

- Goal:
  - 定义一个协议同时承载公众号与外贸动作调用。
- Requirements covered:
  - 两个业务都通过对话驱动。
- Depends on:
  - U1。
- Files:
  - `docs/04-api/domain-action-contract.md`
  - `docs/04-api/examples/domain-action-examples.json`
- Approach:
  - 协议核心字段：
    - `domain`, `intent`, `action`, `payload`, `requiresConfirmation`, `idempotencyKey`。
  - 统一回执字段：
    - `status`, `humanMessage`, `machineCode`, `traceId`。
- Tests:
  - 文档示例校验（JSON schema 校验）。
- Validation:
  - 同一协议下可表达“推送公众号草稿”和“外贸上架商品”。
- Rollback signals:
  - 若为适配某域不得不添加大量域特有顶层字段，说明协议抽象失败。
- Deferred to implementation:
  - schema 版本迁移策略。

### U6 - Go 业务网关与连接器分层

- Goal:
  - 将对话动作执行从 AionUi 抽离到 Go 控制面。
- Requirements covered:
  - 对话触发业务动作。
  - 后续可扩展更多业务域。
- Depends on:
  - U5。
- Files:
  - `docs/02-design/domain-gateway-architecture.md`
  - `docs/04-api/gateway-openapi.yaml`
- Approach:
  - 分层：
    - Adapter（AionUi 请求适配）
    - Orchestrator（意图到动作编排）
    - Connector（公众号/外贸平台 API 调用）
  - AionUi 只调用网关，不直连业务平台。
- Tests:
  - 网关契约测试（请求/响应字段、错误码、超时与重试）。
- Validation:
  - 业务平台替换时，AionUi 无需改动。
- Rollback signals:
  - 若前端需要直接调用平台 API 才能完成核心流程，说明分层失效。
- Deferred to implementation:
  - 连接器重试熔断细节。

### U7 - 身份鉴权与密钥模型

- Goal:
  - 建立“账号唯一标识/密钥”与域级权限控制模型。
- Requirements covered:
  - 基于账号唯一标识或密钥执行业务动作。
- Depends on:
  - U6。
- Files:
  - `docs/02-design/auth-and-key-model.md`
  - `docs/04-api/auth-flow.md`
- Approach:
  - 使用短时 token + refresh 机制。
  - token 绑定 `userId + domain + scopes`。
  - 对高风险动作要求二次确认签名。
- Tests:
  - 鉴权单测：跨域 token 拒绝、过期 token 拒绝、权限不足拒绝。
- Validation:
  - 外贸 token 无法调用公众号动作；反之亦然。
- Rollback signals:
  - 若出现跨域越权调用样例，立即冻结写操作能力。
- Deferred to implementation:
  - KMS/HSM 托管密钥方案。

### U8 - 写操作确认与幂等保障

- Goal:
  - 防止误触发发布/上架/删除，防止重复执行。
- Requirements covered:
  - 通过对话执行高风险业务动作。
- Depends on:
  - U5, U7。
- Files:
  - `docs/02-design/write-safety-policy.md`
  - `docs/04-api/confirmation-protocol.md`
- Approach:
  - 写操作两阶段：
    - 阶段1：生成“待确认动作卡片”。
    - 阶段2：用户确认后执行。
  - 所有写操作必须携带 `idempotencyKey`。
- Tests:
  - 重放测试：同 key 重试不应重复写入。
  - 误操作测试：未确认请求不得执行。
- Validation:
  - 可证明“用户未确认时不会发布/上架/删除”。
- Rollback signals:
  - 若出现重复上架/重复发布，先关闭自动执行仅保留建议模式。
- Deferred to implementation:
  - 批量操作确认 UX。

### U9 - 审计与可观测性

- Goal:
  - 建立对话动作全链路追踪与审计证据。
- Requirements covered:
  - 对话驱动业务动作的可追责性。
- Depends on:
  - U6, U8。
- Files:
  - `docs/02-design/audit-observability.md`
  - `docs/05-reports/domain-action-audit-template.md`
- Approach:
  - 每个动作生成 `traceId`，关联用户、domain、action、结果码。
  - 区分业务失败与系统失败，便于回放。
- Tests:
  - 日志字段完整性检查。
- Validation:
  - 任意一条发布/上架动作都能追溯到会话与确认证据。
- Rollback signals:
  - 若审计链路无法闭环，暂停高风险写动作上线。
- Deferred to implementation:
  - 统一日志平台接入细节。

### U10 - 公众号 PoC（对话驱动）

- Goal:
  - 验证公众号域最小可用闭环。
- Requirements covered:
  - 公众号通过对话驱动，而非页面流程驱动。
- Depends on:
  - U4-U9。
- Files:
  - `docs/04-api/poc-wechat-flow.md`
  - `docs/07-test-data/wechat-poc-cases.json`
- Approach:
  - 最小闭环：
    - 用户对话请求文章 -> 生成候选内容 -> 确认 -> 推送草稿箱。
- Tests:
  - 三类用例：正常流、未确认拒绝流、重复请求幂等流。
- Validation:
  - PoC 演示时可稳定完成“生成并入草稿箱”。
- Rollback signals:
  - 若平台接口不稳定导致成功率低于阈值，先仅保留内容生成不落地。
- Deferred to implementation:
  - 自动配图、定时发布等增强能力。

### U11 - 外贸 PoC（对话驱动）

- Goal:
  - 验证外贸域最小可用闭环。
- Requirements covered:
  - 外贸通过对话驱动调用业务系统。
- Depends on:
  - U4-U9。
- Files:
  - `docs/04-api/poc-trade-flow.md`
  - `docs/07-test-data/trade-poc-cases.json`
- Approach:
  - 最小闭环：
    - 查询商品 -> 生成上架参数建议 -> 确认 -> 上架执行。
- Tests:
  - 三类用例：正常流、权限不足流、重复上架幂等流。
- Validation:
  - PoC 演示可完成“查询并上架”，并有完整 traceId。
- Rollback signals:
  - 若误上架风险不可控，改为“仅生成执行建议，不直接执行”。
- Deferred to implementation:
  - 批量上下架与库存联动。

### U12 - 上游升级回归与发布门禁

- Goal:
  - 形成“每次同步上游后可复用”的回归门禁。
- Requirements covered:
  - 持续跟进官方更新且不破坏新增域功能。
- Depends on:
  - U10, U11。
- Files:
  - `docs/05-reports/upstream-sync-regression-checklist.md`
  - `docs/ae/gates/domain-extension-release-gate.md`
- Approach:
  - 回归最小集：
    - 原生会话可用。
    - 公众号域入口与流程可用。
    - 外贸域入口与流程可用。
  - 门禁按“阻断项/告警项”分级。
- Tests:
  - 手工验收清单 + 自动冒烟接口检查。
- Validation:
  - 同步上游后 1 小时内可完成回归并给出发布结论。
- Rollback signals:
  - 若同步后阻断项失败，回退到上一个可发布标签。
- Deferred to implementation:
  - 全自动 CI/CD 门禁。

## Validation Plan

- 文档阶段（当前）:
  - 完成 U1-U12 的评审，锁定术语、边界、PoC 验收口径。
- PoC 阶段:
  - 先做 U10 与 U11 的最小闭环，证明统一协议可行。
- 工程化阶段:
  - 建立 U12 门禁并执行至少 2 次上游同步演练。
- 判定标准:
  - 公众号与外贸均可“纯对话驱动”完成至少 1 条写入链路。
  - 上游同步后可在可控时间内完成回归并出结论。

## Rollback / Recovery

- 代码层回滚:
  - 所有域扩展改动收敛在 `extensions` 目录与少量壳层接入文件，便于局部回退。
- 功能层降级:
  - 高风险写动作可一键降级为“建议模式（不执行）”。
- 发布层回退:
  - 使用最近一个通过 U12 门禁的发布标签进行回滚。
- 数据层恢复:
  - 写操作记录必须带 `traceId + idempotencyKey`，用于补偿和审计。

## Handoff

- 推荐下一步 1：进入 `ae-brainstorm`，把 U1 中的需求条目细化为“必须/可选/暂缓”。
- 推荐下一步 2：进入 `ae-plan` 第二轮，补齐“上游源码到位后的精确文件清单”。
- 推荐下一步 3：进入 `ae-work` 时只执行 U2 + U4 + U5 的最小技术骨架，不一次性铺开全部单元。
