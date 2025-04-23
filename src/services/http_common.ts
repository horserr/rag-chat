import axios from "axios";

const baseURL = "/api/";

export const http = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

