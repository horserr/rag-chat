import { rag_http } from "../api";
import type { AxiosInstance } from "axios";
import type { MessageDto } from "../../models/message";
import type { PaginatedResult, Result } from "../../models/result";

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
      return onStreamUpdate
        ? await this.sendStreamingMessage(content, onStreamUpdate)
        : await this.sendNonStreamingMessage(content);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Send a non-streaming message using axios
   * @param content The message content to send
   * @returns Result containing the created message
   */
  private async sendNonStreamingMessage(content: string): Promise<Result<MessageDto>> {
    const response = await this.http.post(
      `session/${this.sessionId}/message`,
      { content }
    );
    return response.data;
  }

  /**
   * Send a streaming message using fetch API
   * @param content The message content to send
   * @param onStreamUpdate Callback for streaming updates
   * @returns Result containing the created message
   */
  private async sendStreamingMessage(
    content: string,
    onStreamUpdate: (content: string) => void
  ): Promise<Result<MessageDto>> {
    const response = await this.createStreamingRequest(content);
    const reader = this.getStreamReader(response);

    const { accumulatedContent, messageId } = await this.processStreamChunks(
      reader,
      onStreamUpdate
    );

    return this.createStreamingResult(messageId, accumulatedContent);
  }

  /**
   * Create the streaming fetch request
   * @param content The message content to send
   * @returns The fetch response
   */
  private async createStreamingRequest(content: string): Promise<Response> {
    const response = await fetch(`/rag/session/${this.sessionId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      this.handleStreamingError(response);
    }

    return response;
  }

  /**
   * Handle streaming request errors
   * @param response The fetch response
   */
  private handleStreamingError(response: Response): never {
    if (response.status === 401) {
      console.error("Authentication token expired or invalid");
      window.location.href = "/login";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  /**
   * Get the stream reader from the response
   * @param response The fetch response
   * @returns The stream reader
   */
  private getStreamReader(response: Response): ReadableStreamDefaultReader<Uint8Array> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get stream reader");
    }
    return reader;
  }

  /**
   * Process all stream chunks
   * @param reader The stream reader
   * @param onStreamUpdate Callback for streaming updates
   * @returns Object containing accumulated content and message ID
   */
  private async processStreamChunks(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onStreamUpdate: (content: string) => void
  ): Promise<{ accumulatedContent: string; messageId: number }> {
    let accumulatedContent = "";
    let messageId = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunkStr = new TextDecoder().decode(value);
      console.log("Received chunk:", chunkStr);

      if (chunkStr.includes("connecting")) {
        console.info("Connection established for streaming");
        continue;
      }

      try {
        const chunkResult = this.parseJsonChunks(chunkStr, onStreamUpdate, accumulatedContent);
        accumulatedContent = chunkResult.accumulatedContent;
        if (chunkResult.messageId) {
          messageId = chunkResult.messageId;
        }
      } catch (error) {
        console.error("Error processing chunk:", error);
      }
    }

    return { accumulatedContent, messageId };
  }

  /**
   * Parse consecutive JSON objects from a chunk string
   * @param chunkStr The chunk string containing JSON objects
   * @param onStreamUpdate Callback for streaming updates
   * @param currentAccumulated Current accumulated content
   * @returns Object with updated accumulated content and message ID
   */
  private parseJsonChunks(
    chunkStr: string,
    onStreamUpdate: (content: string) => void,
    currentAccumulated: string
  ): { accumulatedContent: string; messageId?: number } {
    let accumulatedContent = currentAccumulated;
    let messageId: number | undefined;
    let remainingChunk = chunkStr;

    while (remainingChunk.length > 0) {
      remainingChunk = remainingChunk.trim();

      if (!remainingChunk || remainingChunk === "connecting") {
        break;
      }

      const jsonEndIndex = this.findJsonObjectEnd(remainingChunk);
      if (jsonEndIndex === -1) {
        break;
      }

      const jsonStr = remainingChunk.substring(0, jsonEndIndex + 1);
      const parseResult = this.handleStreamingResponse(jsonStr, onStreamUpdate, accumulatedContent);

      if (parseResult) {
        accumulatedContent = parseResult.accumulatedContent;
        if (parseResult.messageId) {
          messageId = parseResult.messageId;
        }
      }

      remainingChunk = remainingChunk.substring(jsonEndIndex + 1);
    }

    return { accumulatedContent, messageId };
  }

  /**
   * Find the end index of a JSON object in a string
   * @param str The string to search
   * @returns The end index of the JSON object, or -1 if not found
   */
  private findJsonObjectEnd(str: string): number {
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\") {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            return i;
          }
        }
      }
    }

    return -1;
  }

  /**
   * Handle a single streaming response object
   * @param jsonStr The JSON string to parse
   * @param onStreamUpdate Callback for streaming updates
   * @param currentAccumulated Current accumulated content
   * @returns Object with updated content and message ID, or null if parsing failed
   */
  private handleStreamingResponse(
    jsonStr: string,
    onStreamUpdate: (content: string) => void,
    currentAccumulated: string
  ): { accumulatedContent: string; messageId?: number } | null {
    try {
      const data = JSON.parse(jsonStr);      // Handle streaming chunk with data
      if (this.isStreamingChunk(data)) {
        const dataObj = data as Record<string, unknown>;
        const updatedContent = currentAccumulated + String(dataObj.data);
        onStreamUpdate(updatedContent);
        console.log("Received chunk data:", dataObj.data);
        return { accumulatedContent: updatedContent };
      }

      // Handle complete message object (backward compatibility)
      if (this.isCompleteMessage(data)) {
        const dataObj = data as Record<string, unknown>;
        const messageObj = dataObj.message as Record<string, unknown>;
        const aiContent = String(messageObj.a_i_message);
        const updatedContent = currentAccumulated + aiContent;
        onStreamUpdate(updatedContent);

        return {
          accumulatedContent: updatedContent,
          messageId: Number(messageObj.id)
        };
      }

      return null;
    } catch (parseError) {
      console.warn("Failed to parse JSON object:", jsonStr, parseError);
      return null;
    }
  }
  /**
   * Check if the data is a streaming chunk
   * @param data The parsed JSON data
   * @returns True if it's a streaming chunk
   */
  private isStreamingChunk(data: unknown): boolean {
    return typeof data === 'object' &&
           data !== null &&
           'status_code' in data &&
           (data as Record<string, unknown>).status_code === 200 &&
           'message' in data &&
           (data as Record<string, unknown>).message === "chunk received" &&
           'data' in data &&
           Boolean((data as Record<string, unknown>).data);
  }  /**
   * Check if the data is a complete message object
   * @param data The parsed JSON data
   * @returns True if it's a complete message
   */
  private isCompleteMessage(data: unknown): boolean {
    return typeof data === 'object' &&
           data !== null &&
           'message' in data &&
           typeof (data as Record<string, unknown>).message === 'object' &&
           (data as Record<string, unknown>).message !== null &&
           "a_i_message" in ((data as Record<string, unknown>).message as Record<string, unknown>);
  }

  /**
   * Create the final result for streaming requests
   * @param messageId The message ID
   * @param accumulatedContent The accumulated content
   * @returns The result object
   */
  private createStreamingResult(
    messageId: number,
    accumulatedContent: string
  ): Result<MessageDto> {
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
