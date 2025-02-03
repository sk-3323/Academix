export interface ApiResponse {
  success: boolean;
  message: string;
  result?: Record<string, any> | Record<string, any>[];
}
