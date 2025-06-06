import { auth_http } from "../api";
import type {
  LoginDto,
  RegisterDto,
  VerificationCodeDto,
  VerificationCodeResponse,
  RegisterResponse
} from "../../models/auth";
import type { Result } from "../../models/result";

export class AuthService {
  async login(loginDto: LoginDto): Promise<Result<string>> {
    try {
      // Remove leading slash since baseURL already includes it
      const response = await auth_http.post("login", loginDto);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async sendVerificationCode(verificationDto: VerificationCodeDto): Promise<Result<VerificationCodeResponse>> {
    try {
      const response = await auth_http.post("verify_code", verificationDto);
      return response.data;
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<Result<RegisterResponse>> {
    try {
      const response = await auth_http.post("user", registerDto);
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  }
}
