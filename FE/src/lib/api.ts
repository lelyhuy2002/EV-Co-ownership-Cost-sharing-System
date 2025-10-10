// API configuration and services
// Prefer env var if provided; fallback to localhost for development
const API_BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL)
    ? String(process.env.NEXT_PUBLIC_API_BASE_URL)
    : 'http://localhost:8080';

// Allow overriding endpoint paths to match backend repo without code edits
const LOGIN_PATH = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_LOGIN_PATH) || '/api/auth/login';
const REGISTER_PATH = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_REGISTER_PATH) || '/api/auth/register';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  // optional fields your BE may accept; keep minimal for student level
  username?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
}

export class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError(
          'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.',
          0
        );
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }

  // Generic helpers for common methods
  async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...init });
  }

  async post<T, B = unknown>(endpoint: string, body?: B, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...init });
  }

  async put<T, B = unknown>(endpoint: string, body?: B, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...init });
  }

  async del<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...init });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse, LoginRequest>(LOGIN_PATH, credentials);
  }

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse, RegisterRequest>(REGISTER_PATH, payload);
  }
}

// Create and export API service instance
export const apiService = new ApiService(API_BASE_URL);
