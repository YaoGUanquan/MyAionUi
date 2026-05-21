---
type: plan
status: drafted
date: 2026-05-21
title: domain-extension-u2-u4-u5-execution
origin: docs/ae/brainstorms/2026-05-20-conversation-domain-requirements.md
originFingerprint: "U2+U4+U5 最小技术骨架：上游同步策略 + 域入口骨架 + 统一动作协议"
---

# Plan: domain-extension-u2-u4-u5-execution

## Source

- 需求来源：
  - `docs/ae/brainstorms/2026-05-20-conversation-domain-requirements.md`
  - `docs/ae/plans/2026-05-20-001-aionui-conversation-domain-extension-plan.md`
- 用户指令（2026-05-21）：
  - 继续原计划下一步。
  - 将 U2、U4、U5 转为精确执行清单（文件级改动、里程碑、验证命令）。

## Scope

- In Scope:
  - U2：形成可执行的上游同步与分支策略文档与检查清单。
  - U4：形成域菜单/路由骨架的文件级实施清单与接入步骤。
  - U5：形成统一 Domain Action Contract 文档与示例 JSON。
  - 为后续 `ae-work` 准备“按步骤可执行”的最小链路。
- Out of Scope:
  - 不在本计划阶段编写产品代码或提交业务实现。
  - 不在本计划阶段落地 U6+（网关实现、鉴权系统、审计系统）。
  - 不在本计划阶段补全外部平台 SDK 对接。

## Decisions

- D1: 本轮采用“先文档定边界，再代码最小实现”。
- D2: U2/U4/U5 按顺序推进，前一单元的结论作为后一单元输入。
- D3: 先保证可验证性，再追求自动化；无法立即自动化的项明确“缺失证明”。
- D4: 当前仓库未发现 `src/renderer`，U4 先输出“定位规则 + 改动白名单草案”，待上游源码到位后执行落地。

## Risks

- R1: 仓库缺少 AionUi 前端源码，导致 U4 只能完成预案，不能完成代码级验收。
- R2: 上游远端未配置或分支命名不一致，导致 U2 同步命令需要临场修正。
- R3: U5 协议字段若未先约束版本策略，后续网关联调易出现破坏性变更。
- R4: 文档先行但无执行校验，可能出现“计划可读但不可跑”的落差。

## Implementation Units

### U2 - 上游同步与分支策略执行清单

- Goal:
  - 将“持续跟进官方更新”落为可重复执行步骤，并生成检查证据。
- Requirements covered:
  - RQ-M09（支持上游持续同步策略）
  - RQ-M08（薄壳扩展边界）
- Depends on:
  - U1 需求基线已完成。
- Files:
  - `docs/02-design/upstream-sync-strategy.md`（新增）
  - `docs/05-reports/upstream-sync-check-template.md`（新增）
  - `docs/00-process/active/2026-05-21-upstream-sync-drill.md`（执行记录，新增）
- Approach:
  - 步骤 1：确认远端与分支基线。
  - 步骤 2：定义分支职责与同步节奏（周更/发版前同步）。
  - 步骤 3：定义冲突分类（壳层冲突/核心冲突）与处理策略。
  - 步骤 4：定义同步演练记录模板，固定输出字段。
  - 步骤 5：执行一次空变更同步演练并记录证据。
- Tests:
  - 命令（发现阶段）：
    - `git remote -v`
    - `git branch -a`
  - 命令（同步阶段）：
    - `git fetch upstream`
    - `git rev-list --left-right --count upstream/main...main`
    - `git diff --name-only upstream/main...main`
  - 命令（记录阶段）：
    - `git log --oneline --decorate -n 20`
- Validation:
  - 可回答以下问题且有文档证据：
    - 当前 `main` 落后 `upstream/main` 多少提交。
    - 冲突集中在哪些路径。
    - 本次是否允许进入 U4/U5 代码实现。
- Rollback signals:
  - 若核心路径冲突占比超阈值（例如 >20%），暂停功能推进，先收缩扩展点。
- Deferred to implementation:
  - 自动化同步脚本与 CI 定时巡检。

### U4 - 域菜单与路由骨架执行清单

- Goal:
  - 输出可直接开工的“文件白名单 + 改动顺序 + 验证命令”。
- Requirements covered:
  - RQ-M01（新增域入口）
  - RQ-M02（进入域化对话上下文）
  - RQ-M08（薄壳改动边界）
- Depends on:
  - U2 分支与同步策略明确。
  - 仓库中存在可编辑的 AionUi 前端源码。
- Files:
  - `docs/02-design/aionui-extension-points.md`（新增，锁定白名单）
  - `src/renderer/extensions/domain-shell/domain-menu.ts`（计划新增）
  - `src/renderer/extensions/domain-shell/domain-routes.tsx`（计划新增）
  - `src/renderer/extensions/domain-shell/DomainLandingPage.tsx`（计划新增）
  - `src/renderer/extensions/domain-shell/README.md`（计划新增）
- Approach:
  - 步骤 1：定位当前导航、路由、会话 domain 注入点。
  - 步骤 2：产出“允许改动文件白名单”和“禁止触碰核心文件清单”。
  - 步骤 3：以扩展目录承载新逻辑，壳层仅做最小接线。
  - 步骤 4：为 `wechat`、`trade` 定义统一路由参数映射。
  - 步骤 5：补充回归检查项，确保原菜单无回归。
- Tests:
  - 命令（源码定位）：
    - `rg --files src | rg "route|router|menu|sidebar|nav|conversation"`
    - `rg -n "menu|sidebar|route|domain" src`
  - 命令（类型与构建）：
    - `npm run build` 或项目既有构建命令
  - 命令（单测，如仓库已有）：
    - `npm test -- domain-routes`
- Validation:
  - 验收最小集：
    - 菜单出现 `公众号`、`外贸`。
    - 点击后 domain 参数分别为 `wechat`、`trade`。
    - 原有菜单导航行为不变。
  - 缺失证明：
    - 当前仓库尚未发现 `src/renderer`，需先引入/同步上游源码后执行上述验证。
- Rollback signals:
  - 出现原菜单错乱、路由冲突或会话上下文污染时，回退到“隐藏入口 + 日志模式”。
- Deferred to implementation:
  - 图标、排序、角色可见性策略（RQ-O01）。

### U5 - Domain Action Contract 执行清单

- Goal:
  - 产出可联调的统一协议文档与示例，覆盖公众号/外贸两域。
- Requirements covered:
  - RQ-M03（统一协议）
  - RQ-M04（确认字段）
  - RQ-M05（幂等键）
  - RQ-M07（追踪字段）
- Depends on:
  - U1 术语基线。
  - U4 明确 domain 路由映射。
- Files:
  - `docs/04-api/domain-action-contract.md`（新增）
  - `docs/04-api/examples/domain-action-examples.json`（新增）
  - `docs/04-api/domain-action-schema.json`（新增，建议）
- Approach:
  - 步骤 1：定义请求/响应最小必填字段与语义。
  - 步骤 2：定义确认阶段语义（待确认/已确认/拒绝）。
  - 步骤 3：定义错误模型（`machineCode`）与可观测字段（`traceId`）。
  - 步骤 4：提供公众号与外贸各 1 条成功示例，1 条拒绝示例。
  - 步骤 5：补充 schema 版本号策略（`version` 字段与兼容规则）。
- Tests:
  - 命令（JSON 合法性）：
    - `node -e "JSON.parse(require('fs').readFileSync('docs/04-api/examples/domain-action-examples.json','utf8')); console.log('ok')"`
  - 命令（Schema 校验，若仓库有 ajv）：
    - `npx ajv validate -s docs/04-api/domain-action-schema.json -d docs/04-api/examples/domain-action-examples.json`
  - 命令（字段覆盖检查）：
    - `rg -n "domain|action|requiresConfirmation|idempotencyKey|traceId" docs/04-api/domain-action-contract.md`
- Validation:
  - 同一结构可表达：
    - 公众号“生成文章并推送草稿箱（需确认）”
    - 外贸“查询商品并上架（需确认）”
  - 示例可通过 JSON 解析与 schema 校验。
- Rollback signals:
  - 若需要为某域新增大量顶层专有字段才能表达业务，停止扩展并重审协议抽象。
- Deferred to implementation:
  - 错误码枚举全集与跨版本迁移策略细节。

## Validation Plan

- 里程碑 M1（U2 完成）：
  - 输出同步策略文档与演练记录。
  - 通过标准：可量化“落后提交数 + 冲突路径 + 是否阻断后续开发”。
- 里程碑 M2（U4 预案完成）：
  - 输出扩展点白名单与骨架改动顺序。
  - 通过标准：当源码到位时，开发者可按清单直接实施，无需再做结构级设计。
- 里程碑 M3（U5 协议完成）：
  - 输出 contract + examples + schema。
  - 通过标准：公众号/外贸示例均通过格式校验，且字段语义一致。

## Rollback / Recovery

- 计划层回退：
  - 若出现关键前提缺失（例如无上游源码），保持本计划为 `drafted`，不推进代码实施。
- 执行层降级：
  - U4 先执行“文档化白名单”，延后代码接线。
  - U5 先冻结最小字段集，避免联调前频繁改协议。
- 同步层回退：
  - 上游同步冲突超阈值时，回到最近可发布标签并重做扩展边界审计。

## Handoff

- 推荐下一步 1：进入 `ae-work` 执行 U2 文档与同步演练，先拿到上游差异证据。
- 推荐下一步 2：确认并引入 AionUi 前端源码后，再执行 U4 文件级落地。
- 推荐下一步 3：并行输出 U5 协议文档与示例，作为后续网关联调契约基线。
