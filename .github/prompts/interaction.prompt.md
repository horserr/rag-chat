---
mode: "agent"
---

根据你的代码库，当前前后端交互主要集中在**登录**和**Chat**页面，涉及的 API 主要如下：

---

## 1. 登录相关 API

**文件**：src/services/auth_service.ts

- **登录**
  - **方法**：POST
  - **路径**：`/login`
  - **请求体**：`{ username: string, password: string }`
  - **响应**：包含 token 的对象（通常为 `{ token: string }`）

---

## 2. Chat 相关 API

**文件**：src/services/message_service.ts

- **获取消息列表**

  - **方法**：GET
  - **路径**：`/session/{sessionId}/message`
  - **参数**：
    - `page`（可选，分页）
    - `page_size`（可选，默认 20）
  - **响应**：`{ data: MessageDto[], ... }`

- **发送消息**

  - **方法**：POST
  - **路径**：`/session/{sessionId}/message`
  - **请求体**：`{ content: string }`
  - **响应**：新消息对象

- **流式发送消息（AI 回复流式）**

  - **方法**：fetch（流式接口）
  - **路径**：`/rag/session/{sessionId}/message`
  - **请求体**：`{ content: string }`
  - **响应**：流式返回 AI 回复内容

- **删除消息**

  - **方法**：DELETE
  - **路径**：`/session/{sessionId}/message/{messageId}`
  - **响应**：操作结果

- **更新消息**
  - **方法**：PUT
  - **路径**：`/session/{sessionId}/message/{messageId}`
  - **请求体**：`{ content: string }`
  - **响应**：更新后的消息对象

---

## 3. 认证与 Token

- 登录成功后，前端会将 token 存储，并在后续请求中通过 header（如 `Authorization: Bearer <token>`）携带。

---

### 总结

| 功能        | 方法   | 路径                                       | 说明             |
| ----------- | ------ | ------------------------------------------ | ---------------- |
| 登录        | POST   | `/login`                                   | 用户登录         |
| 获取消息    | GET    | `/session/{sessionId}/message`             | 获取会话消息     |
| 发送消息    | POST   | `/session/{sessionId}/message`             | 发送用户消息     |
| AI 流式回复 | POST   | `/rag/session/{sessionId}/message`         | 获取 AI 流式回复 |
| 删除消息    | DELETE | `/session/{sessionId}/message/{messageId}` | 删除消息         |
| 更新消息    | PUT    | `/session/{sessionId}/message/{messageId}` | 更新消息内容     |
