export interface Result<T> {
    status_code: number;
    message: string;
    data: T
}

export interface PageInfo {
    size: 0,
    total: 0,
    pages: 0,
    page_number: 0
}

export interface PaginatedResult<T> extends Result<T> {
    page_info : PageInfo
}