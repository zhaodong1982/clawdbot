# 解决 'Context overflow' (上下文溢出) 错误

该方案概述了通过实现预判式压缩和优化上下文窗口配置来防止上下文溢出错误的技术方案。

## 拟定的变更

### OpenClaw [核心执行层]

#### [修改] [run.ts](file:///Users/zhaodong/gemini/moltbot/src/agents/pi-embedded-runner/run.ts)
- 实现预判式压缩：在调用模型之前，检查提示词的估算 Token 数是否接近模型的限制（例如：> 80%）。
- 如果接近限制，立即触发 `compactEmbeddedPiSessionDirect` 进行强制压缩。

### OpenClaw [配置层]

#### [修改] [openclaw.json](file:///Users/zhaodong/gemini/openclaw/openclaw.json)
- 为 `google/gemini-3-flash-preview` 和 `google/gemini-3-pro-preview` 显式设置 `contextWindow: 1048576` (100万 Token)。

### OpenClaw [工具层]

#### [修改] [web-fetch.ts](file:///Users/zhaodong/gemini/moltbot/src/agents/tools/web-fetch.ts)
- 将 `DEFAULT_FETCH_MAX_CHARS` 降低至 `20,000`，以防止单个工具输出过大塞满窗口。

## 验证计划

### 手动验证
1. **同步并重启**：将代码同步到 `openclaw` 并重新构建镜像。
2. **压力测试**：在 Telegram Bot 中粘贴一段非常长的文本（例如 5万+ 字符），验证它是否会自动压缩并响应，而不是直接报错。
3. **配置检查**：验证 `openclaw.json` 正确反映了更大的上下文窗口。
