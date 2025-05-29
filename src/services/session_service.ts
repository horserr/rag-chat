import { rag_http } from "./http_common";
import type { AxiosInstance } from "axios";
import type { SessionDto } from "../models/session";
import type { PaginatedResult, Result } from "../models/result";

export class SessionService {
  http: AxiosInstance;
  constructor(token: string) {
    // Use the token to create an HTTP client instance
    this.http = rag_http(token);
  }
  async get_sessions(
    page: number,
    page_size: number = 20
  ): Promise<PaginatedResult<SessionDto[]>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await this.http.get("session", {
        params: {
          page: page,
          page_size: page_size,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  }
  async delete_session(id: number): Promise<Result<unknown>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await this.http.delete("session/" + id);
      return response.data;
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  }
  async new_session(): Promise<Result<SessionDto>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await this.http.post("session");
      return response.data;
    } catch (error) {
      console.error("Error creating new session:", error);
      throw error;
    }
  }
  async put_session(id: number, title: string): Promise<Result<SessionDto>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await this.http.put("session/" + id, {
        title: title,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  }
}
