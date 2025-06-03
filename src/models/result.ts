export interface Result<T = string> {
    status_code: number;
    message: string;
    data: T;
}

export interface PageInfo {
    size: number;
    total: number;
    pages: number;
    page_number: number;
}

export interface PaginatedResult<T> {
    status_code: number;
    message: string;
    data: T;
    page_info: PageInfo;
}
