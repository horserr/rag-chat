import {auth_http} from "./http_common.ts";
import {LoginDto} from "../models/auth.ts";

export class AuthService {
    async login(loginDto: LoginDto) {
        try {
            const response = await auth_http.post("/login", loginDto);
            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    } 
}