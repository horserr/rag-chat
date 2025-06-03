# 🚀 快速使用指南

## 立即开始调试

### 1. Web 应用调试
```
按 F5 → 选择 "🚀 Launch with Dev Server"
```
自动启动开发服务器并在浏览器中打开调试模式

### 2. 测试调试
```
F5 → 选择 "🧪 Debug Jest Tests"
```
调试所有测试用例

### 3. API 调试
```
1. 编辑 src/test_api.js，替换 YOUR_TOKEN_HERE
2. F5 → 选择 "🔌 Debug API Test Script"
```

## 重新生成配置

### 方法1：npm 脚本
```bash
npm run generate:launch
```

### 方法2：VS Code 任务
```
Ctrl+Shift+P → Tasks: Run Task → generate-launch-config
```

### 方法3：直接运行
```bash
cd .vscode && node launch-config.js
```

## 常用任务

| 任务 | 描述 |
|------|------|
| start-dev-server | 启动开发服务器 |
| build-and-preview | 构建并预览 |
| test-all | 运行所有测试 |
| type-check | TypeScript 检查 |
| lint-check | 代码质量检查 |

## 调试配置概览

### 🌐 Web 类型
- 🚀 Launch with Dev Server
- 🔗 Attach to Running Server
- 🌐 Launch (Server Required)
- 🏗️ Launch Build Preview

### 🧪 Node.js 类型
- 🧪 Debug Jest Tests
- 🧪 Debug Current Jest Test
- 🔌 Debug API Test Script
- 📦 Debug Package Scripts
- 🔧 Debug TypeScript Compilation
- ⚙️ Debug Launch Config Generator

## 💡 提示

- 所有配置都是自动生成的，不要直接编辑 launch.json
- 修改配置请编辑 launch-config.js
- 使用 inputs 可以让调试配置更加灵活
