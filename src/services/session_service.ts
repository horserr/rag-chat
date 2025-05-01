import {rag_http} from "./http_common.ts";
import {LoginDto} from "../models/auth.ts";
import { AxiosInstance } from "axios";
import { SessionDto } from "../models/session.ts";
import { PaginatedResult } from "../models/result.ts";
import { data } from "react-router-dom";

export class SessionService {
    http : AxiosInstance

    constructor(token: string) {
        this.http = rag_http(token)
        // console.log(token)
    }

    async get_sessions(page: number, page_size: number = 20) : Promise<PaginatedResult<SessionDto[]>> {
        try {
            const response = await this.http.get("/session", {params: {
                "page": page,
                "page_size": page_size
            }});
            return response.data
        } catch(error) {
            console.error(error);
            throw error
        }
    }

    async delete_session(id: number) {
        try {
            const response = await this.http.delete("/session/" + id);
            return response.data
        } catch(error) {
            console.error(error);
            throw error
        }
    }

    async new_session() {
        try {
            const response = await this.http.post("/session");
            return response.data
        } catch(error) {
            console.error(error);
            throw error
        }
    }
    
    async put_session(id: number, content: string) {
        try {
            const response = await this.http.put("/session/" + id, {
                "title": content
            });
            return response.data
        } catch(error) {
            console.error(error);
            throw error
        }
    }
}