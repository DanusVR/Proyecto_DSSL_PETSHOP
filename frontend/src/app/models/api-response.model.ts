export interface ApiResponse<T> {
    success: boolean;
    count?: number;
    mensaje?: string;
    data: T;
    error?: any;
}
