# VS Code Launch 配置管理

## 概述

为了避免 `launch.json` 中的重复配置，我们创建了一个配置生成系统。

## 文件说明

- `launch-config.js` - 配置生成脚本，包含所有重复配置的模板
- `launch.json` - 自动生成的调试配置文件（不要直接编辑）
- `tasks.json` - VS Code 任务配置，包含各种构建和开发任务

## 调试配置说明

### 🌐 Web 调试配置
- **🚀 Launch with Dev Server** - 自动启动开发服务器并调试
- **🔗 Attach to Running Server** - 连接到已运行的开发服务器
- **🌐 Launch (Server Required)** - 需要手动启动服务器的调试模式
- **🏗️ Launch Build Preview** - 调试构建后的生产版本

### 🧪 Node.js 调试配置
- **🧪 Debug Jest Tests** - 调试所有 Jest 测试
- **🧪 Debug Current Jest Test** - 调试当前文件的测试
- **🔌 Debug API Test Script** - 调试 API 测试脚本
- **📦 Debug Package Scripts** - 调试 npm 脚本
- **🔧 Debug TypeScript Compilation** - 调试 TypeScript 编译过程
- **⚙️ Debug Launch Config Generator** - 调试配置生成器本身

## 可用任务

### 开发任务
- **start-dev-server** - 启动 Vite 开发服务器
- **build-and-preview** - 构建项目并启动预览服务器
- **generate-launch-config** - 重新生成 launch.json 配置

### 测试任务
- **test-all** - 运行所有测试
- **type-check** - TypeScript 类型检查
- **lint-check** - ESLint 代码质量检查

## 使用方法

### 修改配置

1. 编辑 `launch-config.js` 文件：
   - 修改 `baseConfig` 来更改所有 Web 配置共享的属性
   - 修改 `nodeBaseConfig` 来更改所有 Node.js 配置共享的属性
   - 修改 `commonRuntimeArgs` 来更改公共运行时参数
   - 在 `configurations` 数组中添加、删除或修改具体配置

2. 重新生成 `launch.json`：
   ```bash
   # 使用 npm 脚本
   npm run generate:launch

   # 或使用 VS Code 任务
   Ctrl+Shift+P -> Tasks: Run Task -> generate-launch-config

   # 或直接运行脚本
   cd .vscode
   node launch-config.js
   ```

### 配置结构

#### Web 基础配置 (baseConfig)
```javascript
{
  type: "msedge",
  url: "http://localhost:5173",
  webRoot: "${workspaceFolder}",
  smartStep: true,
  sourceMaps: true,
  skipFiles: ["<node_internals>/**", "**/node_modules/**"],
}
```

#### Node.js 基础配置 (nodeBaseConfig)
```javascript
{
  type: "node",
  cwd: "${workspaceFolder}",
  console: "integratedTerminal",
  skipFiles: ["<node_internals>/**"],
}
```

#### 公共运行时参数 (commonRuntimeArgs)
```javascript
[
  "--disable-web-security",
  "--disable-features=VizDisplayCompositor"
]
```

### 添加新配置

在 `configurations` 数组中添加新的配置对象：

```javascript
// Web 调试配置
{
  ...baseConfig,
  request: "launch", // 或 "attach"
  name: "新 Web 配置名称",
  // 其他特定配置...
}

// Node.js 调试配置
{
  ...nodeBaseConfig,
  request: "launch",
  name: "新 Node.js 配置名称",
  program: "${workspaceFolder}/path/to/script.js",
  // 其他特定配置...
}
```

## 快速开始

1. **启动开发环境**：
   - 按 `F5` 或选择 "🚀 Launch with Dev Server"
   - 这会自动启动开发服务器并打开浏览器调试

2. **调试测试**：
   - 选择 "🧪 Debug Jest Tests" 来调试所有测试
   - 选择 "🧪 Debug Current Jest Test" 来调试当前文件的测试

3. **调试 API**：
   - 编辑 `src/test_api.js` 中的 token
   - 选择 "🔌 Debug API Test Script" 来调试 API 连接

4. **调试生产构建**：
   - 选择 "🏗️ Launch Build Preview" 来调试构建后的应用

## 优势

1. **消除重复**：所有共同的配置都在基础模板中定义
2. **多类型支持**：支持 Web 和 Node.js 两种调试类型
3. **易于维护**：只需在一个地方修改共同配置
4. **类型安全**：JavaScript 可以提供更好的错误检查
5. **可扩展**：轻松添加新的配置模板或变量
6. **任务集成**：与 VS Code 任务系统完全集成

## 注意事项

- 不要直接编辑 `launch.json`，所有修改都会在重新生成时丢失
- 修改配置后记得运行生成脚本
- API 测试配置需要替换实际的认证 token
- 一些配置可能需要根据项目具体情况调整路径或参数
