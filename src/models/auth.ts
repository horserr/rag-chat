interface LoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    name: string;
}

export type { LoginDto, RegisterDto };
