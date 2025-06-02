import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { TokenService } from "./auth/token.service";

// Base URLs
const BASE_URLS = {
  AUTH: "/auth/",
  RAG: "/rag/",
  EVAL_PROMPT: "/api/prompt/",
  EVAL_RAG: "/api/rag/",
} as const;

// Common axios configuration
const commonConfig: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
};

// Auth HTTP client (no token required)
export const auth_http = axios.create({
  baseURL: BASE_URLS.AUTH,
  ...commonConfig,
});

// RAG HTTP client factory (requires token)
export function rag_http(token?: string): AxiosInstance {
  const authToken = token || TokenService.getToken();

  const instance = axios.create({
    baseURL: BASE_URLS.RAG,
    ...commonConfig,
    headers: {
      ...commonConfig.headers,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  // Add request interceptor to handle token updates
  instance.interceptors.request.use(
    (config) => {
      const currentToken = TokenService.getToken();
      if (currentToken && config.headers) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor to handle auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token might be expired, clear it
        TokenService.clearToken();
        // Redirect to login if we're not already there
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Evaluation HTTP clients
export const eval_prompt_http = axios.create({
  baseURL: BASE_URLS.EVAL_PROMPT,
  ...commonConfig,
});

// Evaluation HTTP clients
export const eval_rag_http = axios.create({
  baseURL: BASE_URLS.EVAL_RAG,
  ...commonConfig,
});
