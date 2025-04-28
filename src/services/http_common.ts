import axios from "axios";

const baseURL = "/auth/";

export const http = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

