/**
 * Supported locales for OpenClaw.
 */
export type OpenClawLocale = "en-US" | "zh-CN";

const translations: Record<OpenClawLocale, Record<string, string>> = {
  "en-US": {
    "status.version": "OpenClaw",
    "status.model": "Model",
    "status.usage": "Usage",
    "status.tokens": "Tokens",
    "status.cost": "Cost",
    "status.context": "Context",
    "status.compactions": "Compactions",
    "status.session": "Session",
    "status.runtime": "Runtime",
    "status.think": "Think",
    "status.activation": "Activation",
    "status.queue": "Queue",
    "status.media": "Media",
    "status.voice": "Voice",
    "status.updated": "updated",
    "status.no_activity": "no activity",
    "status.just_now": "just now",
    "status.minutes_ago": "m ago",
    "status.hours_ago": "h ago",
    "status.days_ago": "d ago",

    "context.title": "Context breakdown",
    "context.workspace": "Workspace",
    "context.bootstrap": "Bootstrap max/file",
    "context.sandbox": "Sandbox",
    "context.system_prompt": "System prompt",
    "context.files": "Injected workspace files",
    "context.skills": "Skills list",
    "context.tools": "Tool list",
    "context.tool_schemas": "Tool schemas (JSON)",
    "context.totals": "Session tokens (cached)",

    "context.chars": "chars",
    "context.tokens": "tokens",
    "context.raw": "raw",
    "context.injected": "injected",
    "context.missing": "MISSING",
    "context.truncated": "TRUNCATED",
    "context.ok": "OK",
    "context.shortcut":
      "Inline shortcut: a command token inside normal text (e.g. “hey /status”) that runs immediately (allowlisted senders only) and is stripped before the model sees the remaining message.",

    "status.media.ok": "ok",
    "status.media.none": "none",
    "status.media.off": "off",
    "status.media.denied": "denied",
    "status.media.skipped": "skipped",
    "status.voice.limit": "limit",
    "status.voice.summary": "summary",
    "status.reasoning": "Reasoning",

    "category.session": "Session",
    "category.options": "Options",
    "category.status": "Status",
    "category.management": "Management",
    "category.media": "Media",
    "category.skills": "Skills",
    "category.tools": "Tools",
    "category.docks": "Docks",
    "category.plugins": "Plugins",

    "title.help": "Help",
    "title.slash_commands": "Slash commands",
    "title.commands": "Commands",

    "prompt.language_instruction": "Please respond in English.",
  },
  "zh-CN": {
    "status.version": "OpenClaw",
    "status.model": "模型",
    "status.usage": "用量",
    "status.tokens": "Token",
    "status.cost": "费用",
    "status.context": "上下文",
    "status.compactions": "压缩次数",
    "status.session": "会话",
    "status.runtime": "运行环境",
    "status.think": "思考层级",
    "status.activation": "激活方式",
    "status.queue": "队列",
    "status.media": "媒体",
    "status.voice": "语音",
    "status.updated": "更新于",
    "status.no_activity": "无活动",
    "status.just_now": "刚刚",
    "status.minutes_ago": "分钟前",
    "status.hours_ago": "小时前",
    "status.days_ago": "天前",

    "context.title": "上下文详情",
    "context.workspace": "工作区",
    "context.bootstrap": "引导最大字符",
    "context.sandbox": "沙箱",
    "context.system_prompt": "系统提示词",
    "context.files": "已注入的工作区文件",
    "context.skills": "技能列表",
    "context.tools": "工具列表",
    "context.tool_schemas": "工具 Schema (JSON)",
    "context.totals": "会话 Token (缓存)",

    "context.chars": "字符",
    "context.tokens": "token",
    "context.raw": "原始",
    "context.injected": "注入",
    "context.missing": "丢失",
    "context.truncated": "截断",
    "context.ok": "正常",
    "context.shortcut":
      "内联快捷方式：在普通文本中的命令令牌（例如 “hey /status”），它会立即运行（仅限白名单发送者），并在模型看到剩余消息之前被剥离。",

    "status.media.ok": "正常",
    "status.media.none": "无",
    "status.media.off": "关闭",
    "status.media.denied": "拒绝",
    "status.media.skipped": "跳过",
    "status.voice.limit": "限制",
    "status.voice.summary": "摘要",
    "status.reasoning": "推理",

    "category.session": "会话",
    "category.options": "选项",
    "category.status": "状态",
    "category.management": "管理",
    "category.media": "媒体",
    "category.skills": "技能",
    "category.tools": "工具",
    "category.docks": "对接",
    "category.plugins": "插件",

    "title.help": "帮助",
    "title.slash_commands": "斜杠命令",
    "title.commands": "命令",

    "prompt.language_instruction": "请使用中文回复。",
  },
};

/**
 * Translates a key based on the provided locale.
 */
export function t(key: string, locale: OpenClawLocale = "en-US"): string {
  const dict = translations[locale] || translations["en-US"];
  return dict[key] || key;
}
