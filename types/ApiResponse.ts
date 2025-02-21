export interface ApiResponse {
  status: boolean;
  message: string;
  result?: Record<string, any> | Record<string, any>[];
}
