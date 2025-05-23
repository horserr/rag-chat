export interface MessageDto {
    id: number;
    role: "User" | "Assistant";
    content: string;
    created_at: string;
    session_id: number;
}
