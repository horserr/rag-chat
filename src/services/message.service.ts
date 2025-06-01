import { rag_http } from "./api";
import type { AxiosInstance } from "axios";
import type { MessageDto } from "../models/message";
import type { PaginatedResult, Result } from "../models/result";

export class MessageService {
  http: AxiosInstance;
  sessionId: number;
  token: string;
  constructor(token: string, sessionId: number) {
    this.http = rag_http(token);
    this.sessionId = sessionId;
    this.token = token;
    // Don't add duplicate interceptors here - they're already in http_common.ts
  }

  /**
   * Get messages for a specific session with pagination
   * @param page Page number (0-based)
   * @param page_size Number of messages per page
   * @returns Paginated result containing an array of messages
   */
  async get_messages(
    page: number,
    page_size: number = 20
  ): Promise<PaginatedResult<MessageDto[]>> {
    try {
      // Note: the rag_http baseURL already includes "/rag/", so we don't need to include it here
      const response = await this.http.get(
        `session/${this.sessionId}/message`,
        {
          params: {
            page: page,
            page_size: page_size,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
  /**
   * Send a new message in the current session
   * @param content The message content to send
   * @param onStreamUpdate Optional callback for streaming updates
   * @returns Result containing the created message
   */
  async send_message(
    content: string,
    onStreamUpdate?: (content: string) => void
  ): Promise<Result<MessageDto>> {
    try {
      // If no streaming callback is provided, use regular request
      if (!onStreamUpdate) {
        const response = await this.http.post(
          `session/${this.sessionId}/message`,
          {
            content: content,
          }
        );
        return response.data;
      } // For streaming, we need to use fetch API directly
      // Use the correct URL that matches our proxy configuration
      const response = await fetch(`/rag/session/${this.sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ content }),
      }); // Check if response is ok
      if (!response.ok) {
        // Check for authentication errors
        if (response.status === 401) {
          console.error("Authentication token expired or invalid");
          // Redirect to login page
          window.location.href = "/login";
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the reader from the response body stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get stream reader");
      }

      let accumulatedContent = "";
      let messageId = 0;

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);

        // Process the chunk
        // The format is like: "connecting"\\{ ... }\\{ ... }
        const chunkStr = chunk.toString();
        console.log("Received chunk:", chunkStr);

        if (chunkStr.includes("connecting")) {
          // Skip the connecting message
          console.log("Connection established for streaming");
        }

        // Process the chunk - simple approach without regex
        try {
          // Split by double backslashes which separate the JSON objects
          const parts = chunkStr.split("\\\\");

          for (const part of parts) {
            const trimmedPart = part.trim();
            // Skip empty parts or the connecting message
            if (!trimmedPart || trimmedPart === "connecting") continue;

            try {
              // Try to parse the JSON directly
              const data = JSON.parse(trimmedPart);

              // Check if this is a valid message object
              if (data && data.message && "a_i_message" in data.message) {
                // Extract the AI message content (even if it's empty)
                const aiContent = data.message.a_i_message;

                // Store message ID if available
                if (data.message.id) {
                  messageId = data.message.id;
                }

                // Append to the accumulated content
                accumulatedContent += aiContent;

                // Call the callback with the updated content
                onStreamUpdate(accumulatedContent);

                console.log(
                  "Updated content length:",
                  accumulatedContent.length
                );
              }
            } catch (error) {
              console.warn("Failed to parse JSON part:", trimmedPart, error);
            }
          }
        } catch (error) {
          console.error("Error processing chunk:", error);
        }
      }

      // Return a placeholder result since we've been handling the stream
      return {
        status_code: 200,
        message: "Success",
        data: {
          id: messageId || Date.now(),
          role: "Assistant",
          content: accumulatedContent,
          created_at: new Date().toISOString(),
          session_id: this.sessionId,
        },
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Delete a specific message
   * @param messageId ID of the message to delete
   * @returns Result of the deletion operation
   */ async delete_message(messageId: number): Promise<Result<unknown>> {
    try {
      // Fixed path - removed leading slash since baseURL already has it
      const response = await this.http.delete(
        `session/${this.sessionId}/message/${messageId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  /**
   * Update a specific message
   * @param messageId ID of the message to update
   * @param content New content for the message
   * @returns Result containing the updated message
   */ async update_message(
    messageId: number,
    content: string
  ): Promise<Result<MessageDto>> {
    try {
      // Fixed path - removed leading slash since baseURL already has it
      const response = await this.http.put(
        `session/${this.sessionId}/message/${messageId}`,
        {
          content,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  }
}
