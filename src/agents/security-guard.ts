import path from "node:path";

/**
 * 敏感文件黑名单
 * 禁止 AI 通过 read 或 exec 工具直接访问这些文件。
 */
const SENSITIVE_FILES = [
  "client_secret.json",
  "credentials.json",
  "openclaw.json",
  "moltbot.json",
  ".env",
  "id_rsa",
  "id_ed25519",
];

const SENSITIVE_DIR_NAMES = [".git", ".ssh", ".gnupg"];

/**
 * 检查路径是否涉及敏感文件
 */
export function isSensitivePath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  const baseName = path.basename(normalized).toLowerCase();

  // 检查文件名
  if (SENSITIVE_FILES.some((f) => baseName === f.toLowerCase())) {
    return true;
  }

  // 检查是否在敏感目录下
  const parts = normalized.split("/");
  if (parts.some((p) => SENSITIVE_DIR_NAMES.includes(p.toLowerCase()))) {
    return true;
  }

  return false;
}

/**
 * 扫描 shell 命令是否包含对敏感文件的访问（cat, grep, etc.）
 */
export function isDangerousCommand(command: string): boolean {
  const lower = command.toLowerCase();

  // 简单的正则扫描，防止通过 cat/grep/cp 等命令读取敏感文件
  return SENSITIVE_FILES.some((f) => {
    const pattern = new RegExp(
      `\\b(cat|grep|cp|mv|head|tail|vi|nano|less|more|strings|shred)\\s+.*\\b${f.replace(".", "\\.")}\\b`,
      "i",
    );
    return pattern.test(lower);
  });
}

/**
 * 统一的安全校验报错信息
 */
export function guardrailError(target: string): string {
  return `Security Violation: Access to sensitive file or path "${target}" is restricted for this session.`;
}
