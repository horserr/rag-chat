import axios, { AxiosInstance } from "axios";

const baseAuthURL = "/auth/";
const baseRagURL = "/rag/";

export const auth_http = axios.create({
  baseURL: baseAuthURL,
  headers: {
    "Content-Type": "application/json",
  }
});

export function rag_http(token : string) : AxiosInstance { 
  return axios.create({
  baseURL: baseRagURL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  }
})
}