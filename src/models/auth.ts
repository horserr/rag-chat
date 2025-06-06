interface LoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    name: string;
    verification_code: string;
}

interface VerificationCodeDto {
    email: string;
}

interface VerificationCodeResponse {
    success: boolean;
    message: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    user_id?: string;
}

export type {
    LoginDto,
    RegisterDto,
    VerificationCodeDto,
    VerificationCodeResponse,
    RegisterResponse
};
