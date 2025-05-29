import { auth_http } from "./http_common";
import { LoginDto } from "../models/auth";
import { Result } from "../models/result";

export class AuthService {    async login(loginDto: LoginDto): Promise<Result<{ token: string }>> {
        try {
            // Remove leading slash since baseURL already includes it
            const response = await auth_http.post("login", loginDto);
            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }
}
