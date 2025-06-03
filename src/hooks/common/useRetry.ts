import { useState, useCallback } from "react";

interface UseRetryOptions {
  maxRetries?: number;
  onMaxRetriesReached?: () => void;
}

export const useRetry = (options: UseRetryOptions = {}) => {
  const { maxRetries = 3, onMaxRetriesReached } = options;
  const [retryCount, setRetryCount] = useState(0);

  const shouldRetry = retryCount < maxRetries;
  const hasMaxRetriesReached = retryCount >= maxRetries;

  const incrementRetry = useCallback(() => {
    setRetryCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= maxRetries && onMaxRetriesReached) {
        onMaxRetriesReached();
      }
      return newCount;
    });
  }, [maxRetries, onMaxRetriesReached]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    retryCount,
    shouldRetry,
    hasMaxRetriesReached,
    incrementRetry,
    resetRetry,
  };
};
