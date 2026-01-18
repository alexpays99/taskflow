import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const IS_DEV = __DEV__;

const Colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

class Logger {
  constructor() {
    this.enabled = IS_DEV;
  }

  private enabled: boolean;

  // Enable or disable logging
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // General log
  log(message: string, data?: unknown) {
    if (!this.enabled) return;
    console.log(`${Colors.cyan}[LOG]${Colors.reset} ${message}`, data ?? "");
  }

  // Info
  info(message: string, data?: unknown) {
    if (!this.enabled) return;
    console.log(`${Colors.blue}[INFO]${Colors.reset} ${message}`, data ?? "");
  }

  // Warning
  warn(message: string, data?: unknown) {
    if (!this.enabled) return;
    console.log(`${Colors.yellow}[WARN]${Colors.reset} ${message}`, data ?? "");
  }

  // Error
  error(message: string, data?: unknown) {
    if (!this.enabled) return;
    console.log(`${Colors.red}[ERROR]${Colors.reset} ${message}`, data ?? "");
  }

  // HTTP Request
  request(config: InternalAxiosRequestConfig) {
    if (!this.enabled) return;
    const lines = [
      "",
      "┌──────────────────────────────────────────────────────────────────",
      `│ 🚀 REQUEST: ${config.method?.toUpperCase()} ${config.url}`,
    ];

    if (config.params) {
      lines.push(`│ 📦 Params: ${JSON.stringify(config.params)}`);
    }

    if (config.data) {
      const bodyLines = JSON.stringify(config.data, null, 2).split("\n");
      lines.push(`│ 📤 Body: ${bodyLines[0]}`);
      bodyLines.slice(1).forEach((line) => lines.push(`│        ${line}`));
    }

    lines.push(
      "└──────────────────────────────────────────────────────────────────",
      "",
    );

    console.log(lines.join("\n"));
  }

  // HTTP Response
  response(response: AxiosResponse) {
    if (!this.enabled) return;
    const lines = [
      "",
      "┌──────────────────────────────────────────────────────────────────",
      `│ ✅ RESPONSE: ${response.status} ${response.config.url}`,
    ];

    if (response.data) {
      const dataLines = JSON.stringify(response.data, null, 2).split("\n");
      lines.push(`│ 📥 Data: ${dataLines[0]}`);
      dataLines.slice(1).forEach((line) => lines.push(`│        ${line}`));
    }

    lines.push(
      "└──────────────────────────────────────────────────────────────────",
      "",
    );

    console.log(lines.join("\n"));
  }

  // HTTP Error
  httpError(error: AxiosError) {
    if (!this.enabled) return;
    const lines = [
      "",
      "┌──────────────────────────────────────────────────────────────────",
      `│ ❌ ERROR: ${error.response?.status || "Network Error"} ${error.config?.url}`,
      `│ 💬 Message: ${error.message}`,
    ];

    if (error.response?.data) {
      const dataLines = JSON.stringify(error.response.data, null, 2).split(
        "\n",
      );
      lines.push(`│ 📥 Data: ${dataLines[0]}`);
      dataLines.slice(1).forEach((line) => lines.push(`│        ${line}`));
    }

    lines.push(
      "└──────────────────────────────────────────────────────────────────",
      "",
    );

    console.log(lines.join("\n"));
  }
}

// Singleton instance
export const logger = new Logger();
