# React Query ESLint 插件配置说明

## 已配置的规则

项目中已成功配置了 `@tanstack/eslint-plugin-query` 插件，包含以下规则：

### 1. `@tanstack/query/exhaustive-deps` (error)
**作用**: 确保 queryKey 中包含所有在 queryFn 中使用的依赖项

**示例**:
```typescript
// ❌ 错误 - userId 在 queryFn 中使用但未在 queryKey 中声明
const { data } = useQuery({
  queryKey: ["user"],
  queryFn: () => fetchUser(userId), // userId 缺失
});

// ✅ 正确
const { data } = useQuery({
  queryKey: ["user", userId], // 包含所有依赖
  queryFn: () => fetchUser(userId),
});
```

### 2. `@tanstack/query/no-rest-destructuring` (warn)
**作用**: 防止对 useQuery 结果进行剩余属性解构，避免不必要的重新渲染

**示例**:
```typescript
// ❌ 警告 - 会导致过多的重新渲染
const { data, ...rest } = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
});

// ✅ 正确 - 分别获取需要的属性
const query = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
});
const { data, isLoading, error } = query;
```

### 3. `@tanstack/query/stable-query-client` (error)
**作用**: 确保 QueryClient 实例在组件外部创建，保持稳定性

**示例**:
```typescript
// ❌ 错误 - 在组件内部创建 QueryClient
function Component() {
  const queryClient = new QueryClient(); // 每次渲染都会创建新实例
}

// ✅ 正确 - 在应用层面创建并通过 Provider 提供
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 应用内容 */}
    </QueryClientProvider>
  );
}
```

## 配置位置

ESLint 配置文件: `eslint.config.js`

```javascript
import tanstackQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  // ... 其他配置
  {
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/stable-query-client': 'error',
    },
  },
)
```

## 运行 ESLint

```bash
# 检查所有文件
npm run lint

# 检查特定文件
npx eslint src/hooks/useChatQuery.ts

# 自动修复可修复的问题
npm run lint -- --fix
```

## 好处

1. **防止性能问题**: 确保 queryKey 依赖完整，避免缓存失效问题
2. **避免过度渲染**: 防止不当的解构操作导致的性能下降
3. **代码一致性**: 强制使用 React Query 最佳实践
4. **错误预防**: 在开发时就发现潜在问题

## 项目中的应用

插件已经在你的项目中正常工作，会自动检查以下文件中的 React Query 使用：

- `src/hooks/useChatQuery.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useSessions.ts`
- `src/hooks/auth/useAuthStatus.ts`
- `src/hooks/auth/useLogin.ts`
- `src/hooks/session/useSessionList.ts`
- `src/hooks/session/useSessionCreation.ts`
- `src/hooks/session/useSessionOperations.ts`
- `src/hooks/chat/useMessages.ts`
- `src/hooks/chat/useMessageSending.ts`

所有这些 hooks 都会自动接受 React Query ESLint 规则的检查，确保代码质量和性能。
