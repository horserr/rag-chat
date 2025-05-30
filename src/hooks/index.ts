// Authentication hooks
export { useAuthStatus } from "./auth/useAuthStatus";
export { useLogin } from "./auth/useLogin";
export { useAuthNavigation } from "./auth/useAuthNavigation";

// Session management hooks
export { useSessionCreation } from "./session/useSessionCreation";
export { useSessionList } from "./session/useSessionList";
export { useSessionOperations } from "./session/useSessionOperations";
export { useActiveSession } from "./session/useActiveSession";

// Chat hooks
export { useMessages } from "./chat/useMessages";
export { useMessageSending } from "./chat/useMessageSending";
export { useChatSession } from "./chat/useChatSession";

// Common utility hooks
export { useRetry } from "./common/useRetry";
export { useErrorHandling } from "./common/useErrorHandling";

// Legacy exports for backward compatibility (can be removed after migration)
export { useAuthStatus as useAuthCheck } from "./auth/useAuthStatus";
export { useAuthNavigation as useLoginWithNavigation } from "./auth/useAuthNavigation";
export { useSessionList as useSessions } from "./session/useSessionList";
export { useSessionCreation as useCreateSession } from "./session/useSessionCreation";
export { useDeleteSession } from "./useDeleteSession";
export { useChatSession as useChat } from "./chat/useChatSession";
export { useChatSession as useChatQuery } from "./chat/useChatSession";
