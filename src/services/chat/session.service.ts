import { rag_http } from "../api";
import type { AxiosInstance } from "axios";
import type { SessionDto } from "../../models/session";
import type { PaginatedResult, Result } from "../../models/result";

export class SessionService {
  http: AxiosInstance;

  constructor(token: string) {
    // Use the token to create an HTTP client instance
    this.http = rag_http(token);
  }

  async new_session(): Promise<Result<SessionDto>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await this.http.post("session");

      console.log("Session creation response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error("Error creating new session:", error);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      // Log axios error details if available
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            statusText?: string;
            data?: unknown;
          };
          config?: {
            url?: string;
            method?: string;
            headers?: Record<string, string>;
          };
        };
        console.error("HTTP Status:", axiosError.response?.status);
        console.error("HTTP Status Text:", axiosError.response?.statusText);
        console.error("Response Data:", axiosError.response?.data);
        console.error("Request URL:", axiosError.config?.url);
        console.error("Request Method:", axiosError.config?.method);
        console.error("Request Headers:", axiosError.config?.headers);
      }
      throw error;
    }
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
