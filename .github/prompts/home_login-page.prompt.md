---
mode: "agent"
---

## 1. 首页设计 (Homepage Design)
- **目标**: 创建一个美观且具有吸引力的首页，引导用户登录。
- **功能要求**:
  - 使用 `icon.png` 突出品牌形象。
  - 添加文字说明平台功能（参考 `requirements.md`）。
  - 添加适当的动效吸引用户。
- **交互**:
  - 点击左上角的品牌图标跳转到首页。
  - 已登录用户无需重新登录，可直接进入 `chat` 或 `eval` 界面。

---

## 2. 登录界面设计 (Login Page Design)
- **目标**: 实现邮箱账号登录功能。
- **功能要求**:
  - 向后端发送请求获取 `token`。
  - 登录成功后跳转到 `chat` 或 `evaluation` 界面。
- **限制**:
  - 暂不支持注册功能。

---

## 3. Chat 页面功能 (Chat Page Features)
- **目标**: 增强 `chat` 页面功能。
- **功能要求**:
  - 实现对话回复功能。
  - 支持历史记录的添加、浏览和管理。
- **参考**:
  - 使用 `front-end` 项目中的 API 调用。

---

## 4. API 交互与代理配置 (API Interaction and Proxy Configuration)
- **目标**: 与后端服务器通信。
- **功能要求**:
  - 配置 `vite.config.ts` 的代理，目标服务器为 `home.si-qi.wang`。
- **示例配置**:
  ```ts
  server: {
      proxy: {
        "/auth": {
          target: "https://home.si-qi.wang",
          changeOrigin: true,
        },
        "/rag": {
          target: "https://home.si-qi.wang",
          changeOrigin: true,
        },
        "/api/prompt": {
          target: "https://home.si-qi.wang",
          changeOrigin: true,
        },
        "/api/rag": {
          target: "https://home.si-qi.wang",
          changeOrigin: true,
        },
      },
    },
  ```
- 备注：如果使用上面的config, chatpage的url可能需要更改，也就是要更改route 规则。

---

## 5. 页面停留与跳转规则 (Page Navigation Rules)
- **目标**: 提供流畅的用户体验。
- **规则**:
  - 已登录且 `token` 未过期的用户直接进入 `chat` 或 `eval` 界面（根据上次退出的界面）。
  - 点击左上角品牌图标跳转到首页。
  - 支持用户在 `chat`、`eval` 和 `homepage` 界面退出登录。

---

## 6. 页面切换动效 (Page Transition Animations)
- **目标**: 增强页面切换的视觉效果。
- **要求**:
  - 为页面切换添加动效（如从 `homepage` 到 `login`，从 `login` 到 `chat`）。
  - 可使用 `MUI` 自带动效或 `motion` 库（需安装）。
