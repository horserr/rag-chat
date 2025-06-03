# Hooks 重构迁移指南

## 概述

按照单一职责原则重构了 hooks 结构，将原来的大型 hooks 拆分为更小、更专注的 hooks。

## 新的文件结构

```
src/hooks/
├── index.ts              # 统一导出文件
├── auth/                 # 认证相关
│   ├── useAuthStatus.ts  # 认证状态检查
│   ├── useLogin.ts       # 登录功能
│   └── useAuthNavigation.ts # 认证导航
├── session/              # 会话管理
│   ├── useSessionCreation.ts # 会话创建
│   ├── useSessionList.ts     # 会话列表
│   ├── useSessionOperations.ts # 会话操作
│   └── useActiveSession.ts   # 活跃会话管理
├── chat/                 # 聊天功能
│   ├── useMessages.ts        # 消息管理
│   ├── useMessageSending.ts  # 消息发送
│   └── useChatSession.ts     # 聊天会话集成
└── common/               # 通用逻辑
    ├── useRetry.ts       # 重试逻辑
    └── useErrorHandling.ts # 错误处理
```

## 迁移映射

### 原 useAuth.ts → 拆分为：

- `useLogin()` → `auth/useLogin.ts`
- `useAuthCheck()` → `auth/useAuthStatus.ts`
- `useLoginWithNavigation()` → `auth/useAuthNavigation.ts`

### 原 useSessionManager.ts → 拆分为：

- 会话创建逻辑 → `session/useActiveSession.ts`
- 错误处理逻辑 → `common/useErrorHandling.ts`
- 重试逻辑 → `common/useRetry.ts`

### 原 useSessions.ts → 重新组织为：

- `useSessions()` → `session/useSessionList.ts`
- `useCreateSession()` → `session/useSessionCreation.ts`
- `useDeleteSession()` → `session/useSessionOperations.ts`

### 原 useChat.ts 和 useChatQuery.ts → 合并重构为：

- 消息数据管理 → `chat/useMessages.ts`
- 消息发送 → `chat/useMessageSending.ts`
- 聊天集成 → `chat/useChatSession.ts`

## 使用示例

### 认证相关

```typescript
// 之前
import { useAuthCheck, useLoginWithNavigation } from '../hooks/useAuth';

// 现在
import { useAuthStatus, useAuthNavigation } from '../hooks';

const { data: authData } = useAuthStatus();
const { loginWithNavigation } = useAuthNavigation();
```

### 会话管理

```typescript
// 之前
import { useSessionManager } from '../hooks/useSessionManager';

// 现在
import { useActiveSession } from '../hooks';

const { sessionId, isLoading, createSession } = useActiveSession();
```

### 聊天功能

```typescript
// 之前
import { useChat } from '../hooks/useChat';

// 现在
import { useChatSession } from '../hooks';

const { messages, sendMessage, setSession } = useChatSession();
```

## 兼容性

为了向后兼容，在 `hooks/index.ts` 中提供了旧的导出名称，但建议逐步迁移到新的命名方式。

## 优势

1. **单一职责**：每个 hook 只负责一个具体功能
2. **可复用性**：小粒度的 hooks 更容易在不同场景下复用
3. **可测试性**：独立的 hooks 更容易进行单元测试
4. **可维护性**：逻辑分离使代码更易于理解和维护
5. **组合性**：可以灵活组合不同的 hooks 来满足特定需求

## 后续步骤

1. 更新现有组件以使用新的 hooks
2. 逐步移除旧的 hook 文件
3. 移除兼容性导出
4. 编写测试用例
