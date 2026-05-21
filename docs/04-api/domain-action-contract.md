# Domain Action Contract v1

## 1. Purpose

统一 `wechat` 与 `trade` 两个业务域的对话动作调用协议，保证动作语义一致、确认链路一致、幂等行为一致。

## 2. Request Envelope

必填字段：

- `version`: 协议版本，当前固定 `v1`
- `domain`: `wechat | trade`
- `intent`: 用户意图标识
- `action`: 动作标识
- `payload`: 动作参数对象
- `requiresConfirmation`: 是否需要确认（高风险写操作必须 `true`）
- `idempotencyKey`: 幂等键（前端生成并透传）

建议字段：

- `clientRequestId`: 客户端请求追踪号
- `timestamp`: 客户端发起时间

## 3. Response Envelope

- `status`: `pending_confirmation | confirmed | rejected | succeeded | failed`
- `humanMessage`: 面向用户的可读消息
- `machineCode`: 机器可识别状态或错误码
- `traceId`: 全链路追踪 ID
- `confirmationToken`: 待确认凭证（仅 `pending_confirmation` 必填）
- `result`: 成功结果（`succeeded` 时返回）
- `error`: 失败详情（`failed/rejected` 时返回）

## 4. Two-Phase Confirmation

阶段 A（请求写操作）：

1. 用户在对话内发起高风险写操作。
2. 系统返回 `pending_confirmation` 与 `confirmationToken`。

阶段 B（确认执行）：

1. 用户在对话内确认。
2. 系统执行动作并返回 `succeeded` 或 `failed`。
3. 用户取消或超时未确认返回 `rejected`。

## 5. Idempotency

- 同一 `idempotencyKey` 的重复请求不得导致重复写入。
- 幂等命中应返回可识别结果（例如 `machineCode=IDEMPOTENT_REPLAY`）。

## 6. Domain Rules

- `domain=wechat`：用于公众号相关动作。
- `domain=trade`：用于外贸相关动作。
- 不允许跨域凭据调用对方域的写操作。

## 7. Minimum Validation Requirements

- `wechat` 与 `trade` 至少各有 1 条 `pending_confirmation` 示例。
- 至少 1 条幂等重放示例。
- 示例 JSON 可被解析并通过 schema 校验。