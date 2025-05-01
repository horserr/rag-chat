import { rag_http } from "./http_common.ts";
import { AxiosInstance } from "axios";
import { MessageDto } from "../models/message.ts";
import { PaginatedResult, Result } from "../models/result.ts";

export class MessageService {
    http: AxiosInstance;
    sessionId: number;

    constructor(token: string, sessionId: number) {
        this.http = rag_http(token);
        this.sessionId = sessionId;
    }

    async get_messages(page: number, page_size: number = 20): Promise<PaginatedResult<MessageDto[]>> {
        try {
            const response = await this.http.get(`/session/${this.sessionId}/message`, {
                params: {
                    "page": page,
                    "page_size": page_size
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw error;
        }
    }
}
