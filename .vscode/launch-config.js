/**
 * Launch Configuration Generator
 * 这个脚本用于生成 launch.json，避免重复配置
 * 运行 node .vscode/launch-config.js 来重新生成 launch.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 基础配置模板
const baseConfig = {
  type: "msedge",
  url: "http://localhost:5173",
  webRoot: "${workspaceFolder}",
  smartStep: true,
  sourceMaps: true,
  skipFiles: ["<node_internals>/**", "**/node_modules/**"],
};

// 公共运行时参数
const commonRuntimeArgs = [
  "--disable-web-security",
  "--disable-features=VizDisplayCompositor",
];

// Node.js 基础配置模板
const nodeBaseConfig = {
  type: "node",
  cwd: "${workspaceFolder}",
  console: "integratedTerminal",
  skipFiles: ["<node_internals>/**"],
};

// 配置定义
const configurations = [
  // === Web 调试配置 ===
  {
    ...baseConfig,
    request: "launch",
    name: "🚀 Launch with Dev Server",
    userDataDir: "${workspaceFolder}/.vscode/msedge",
    timeout: 30000,
    preLaunchTask: "start-dev-server",
    runtimeArgs: [
      ...commonRuntimeArgs,
      "--allow-running-insecure-content",
      "--inprivate",
    ],
  },
  {
    ...baseConfig,
    request: "attach",
    name: "🔗 Attach to Running Server",
    // attach 配置不需要 userDataDir, timeout, preLaunchTask, runtimeArgs
  },
  {
    ...baseConfig,
    request: "launch",
    name: "🌐 Launch (Server Required)",
    userDataDir: "${workspaceFolder}/.vscode/msedge",
    timeout: 30000,
    runtimeArgs: commonRuntimeArgs,
  },
  {
    ...baseConfig,
    request: "launch",
    name: "🏗️ Launch Build Preview",
    url: "http://localhost:4173",
    userDataDir: "${workspaceFolder}/.vscode/msedge-preview",
    timeout: 30000,
    preLaunchTask: "build-and-preview",
    runtimeArgs: commonRuntimeArgs,
  },

  // === Node.js 调试配置 ===
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "🧪 Debug Jest Tests",
    program: "${workspaceFolder}/node_modules/.bin/jest",
    args: ["--runInBand", "--no-cache", "--watchAll=false"],
    env: {
      NODE_ENV: "test",
    },
  },
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "🧪 Debug Current Jest Test",
    program: "${workspaceFolder}/node_modules/.bin/jest",
    args: ["--runInBand", "--no-cache", "${relativeFile}"],
    env: {
      NODE_ENV: "test",
    },
  },
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "🔌 Debug API Test Script",
    program: "${workspaceFolder}/src/test_api.js",
    args: ["YOUR_TOKEN_HERE"], // 用户需要替换为实际的 token
    env: {
      NODE_ENV: "development",
    },
  },
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "📦 Debug Package Scripts",
    program: "${workspaceFolder}/node_modules/.bin/npm",
    args: ["run", "${input:npmScript}"],
  },

  // === TypeScript 调试配置 ===
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "🔧 Debug TypeScript Compilation",
    program: "${workspaceFolder}/node_modules/.bin/tsc",
    args: ["--noEmit", "--incremental"],
    env: {
      NODE_ENV: "development",
    },
  },

  // === 配置生成器调试 ===
  {
    ...nodeBaseConfig,
    request: "launch",
    name: "⚙️ Debug Launch Config Generator",
    program: "${workspaceFolder}/.vscode/launch-config.js",
  },
];

// 输入变量定义
const inputs = [
  {
    id: "npmScript",
    description: "选择要调试的 npm 脚本",
    type: "pickString",
    options: [
      "dev",
      "build",
      "lint",
      "preview",
      "test",
      "test:api",
      "test:unit",
      "test:integration",
      "generate:launch",
    ],
  },
];

// 生成完整的 launch.json 结构
const launchConfig = {
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  version: "0.2.0",
  configurations,
  inputs,
};

// 写入 launch.json 文件
const launchJsonPath = path.join(__dirname, "launch.json");
const content = JSON.stringify(launchConfig, null, 2);

fs.writeFileSync(launchJsonPath, content);

console.log("✅ launch.json 已重新生成");
console.log("📝 所有重复配置已通过基础模板统一管理");
