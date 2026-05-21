# AionUi Extension Points for Domain Shell

## 1. Objective

定义 U4 的改动边界，确保域入口功能仅在壳层扩展，不侵入核心会话引擎。

## 2. White-list (Allowed)

- `src/renderer/extensions/domain-shell/**`
- 导航注入文件（待源码到位后定位）
- 路由注册文件（待源码到位后定位）

说明：除上述白名单外，不允许直接改动其他前端核心路径。

## 3. Black-list (Disallowed in U4)

- 会话引擎核心文件
- 框架启动与基础运行时核心路径
- 与域入口无关的全局 UI 结构文件

## 4. Integration Rule

- 菜单层仅负责 domain 选择：`wechat` / `trade`。
- 路由层仅负责 domain 上下文接线。
- 业务动作编排与执行不在 U4 内实现。

## 5. Change Control

- 任何超出白名单的改动，必须先更新本文件并经过设计复核。
- 若出现原生菜单回归或路由冲突，立即降级为“隐藏入口 + 日志模式”。

## 6. Current Limitation

当前仓库缺少 `src/renderer` 源码目录，本文件为接线前置设计文档。待源码到位后补充：

- 精确导航接线文件路径
- 精确路由接线文件路径
- 最终执行顺序与回归测试点