import apiClient from "../axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  bio?: string;
  notifications: boolean;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  time?: string;
  language?: string;
}

class UserService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      data
    );
    return response.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/register",
      data
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>("/api/users/me");
    return response.data;
  }

  async updateUserProfile(data: UserFormData): Promise<User> {
    const response = await apiClient.put<User>("/api/users/profile", data);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // Use a direct axios call to avoid interceptors
    const response = await apiClient.post<RefreshTokenResponse>(
      "/api/auth/refresh",
      { refreshToken }
    );
    return response.data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ valid: boolean }>(
        "/api/auth/validate-token",
        { token }
      );
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}

export const userService = new UserService();
