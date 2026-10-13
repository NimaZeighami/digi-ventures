type LogLevel = "info" | "warn" | "error" | "debug";

const SENSITIVE_KEYS = ["password", "token", "session", "secret", "authorization", "cookie"];

function maskSensitiveData(data: any): any {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(maskSensitiveData);

  const masked: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      masked[key] = "[REDACTED]";
    } else if (typeof val === "object" && val !== null) {
      masked[key] = maskSensitiveData(val);
    } else {
      masked[key] = val;
    }
  }
  return masked;
}

function logMessage(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? maskSensitiveData(context) : undefined,
  };
  const str = JSON.stringify(entry);
  if (level === "error") {
    console.error(str);
  } else if (level === "warn") {
    console.warn(str);
  } else {
    console.log(str);
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, any>) => logMessage("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => logMessage("warn", msg, ctx),
  error: (msg: string, ctx?: Record<string, any>) => logMessage("error", msg, ctx),
  debug: (msg: string, ctx?: Record<string, any>) => {
    if (process.env.NODE_ENV !== "production") {
      logMessage("debug", msg, ctx);
    }
  },
};
