import axios from "axios";
import type { AxiosInstance } from "axios";

const baseAuthURL = "/auth/";
const baseRagURL = "/rag/";
const evalPromptURL = "/api/prompt/";
const evalRagURL = "/api/rag/";

export const auth_http = axios.create({
  baseURL: baseAuthURL,
  headers: {
    "Content-Type": "application/json",
  }
});

export function rag_http(token: string): AxiosInstance {
  return axios.create({
    baseURL: baseRagURL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
}

export const eval_prompt_http = axios.create({
  baseURL: evalPromptURL,
  headers: {
    "Content-Type": "application/json",
  }
});

export const eval_rag_http = axios.create({
  baseURL: evalRagURL,
  headers: {
    "Content-Type": "application/json",
  }
});
