import axios, {
  InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Define types for API responses
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}

// Create a custom Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Queue of requests to retry after token refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

// Process the queue of failed requests
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      // Update the Authorization header with the new token
      if (token && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${token}`;
      }
      request.resolve(apiClient(request.config));
    }
  });

  // Reset the queue
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get the token from localStorage or cookies
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth-token") : null;

    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Any status code within the range of 2xx causes this function to trigger
    return response.data;
  },
  // async (error: AxiosError<ApiError>): Promise<any> => {
  //   if (
  //     error.config?.url &&
  //     (error.config.url.includes("/auth/login") ||
  //       error.config.url.includes("/auth/register"))
  //   ) {
  //     return Promise.reject(error);
  //   }
  //   const originalRequest = error.config as AxiosRequestConfig & {
  //     _retry?: boolean;
  //   };

  //   // If the error is not 401 or the request has already been retried, reject
  //   if (error.response?.status !== 401 || originalRequest._retry) {
  //     return Promise.reject(error);
  //   }

  //   // Mark the request as retried to prevent infinite loops
  //   originalRequest._retry = true;

  //   // If a token refresh is already in progress, add this request to the queue
  //   if (isRefreshing) {
  //     return new Promise((resolve, reject) => {
  //       failedQueue.push({ resolve, reject, config: originalRequest });
  //     });
  //   }

  //   isRefreshing = true;

  //   try {
  //     // Get the refresh token from localStorage
  //     const refreshToken = localStorage.getItem("refresh-token");

  //     if (!refreshToken) {
  //       throw new Error("No refresh token available");
  //     }

  //     // Call the refresh token endpoint
  //     const response = await axios.post<TokenResponse>(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
  //       { refreshToken },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         // Don't use the interceptors for this request to avoid infinite loops
  //         baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  //       }
  //     );

  //     const { token, refreshToken: newRefreshToken } = response.data;

  //     // Store the new tokens
  //     localStorage.setItem("auth-token", token);
  //     localStorage.setItem("refresh-token", newRefreshToken);

  //     // Update the Authorization header for the original request
  //     if (originalRequest.headers) {
  //       originalRequest.headers.Authorization = `Bearer ${token}`;
  //     }

  //     // Process any queued requests with the new token
  //     processQueue(null, token);

  //     // Retry the original request with the new token
  //     return apiClient(originalRequest);
  //   } catch (refreshError) {
  //     // Process the queue with the error
  //     processQueue(refreshError as AxiosError);

  //     // Handle refresh token failure - log out the user
  //     localStorage.removeItem("auth-token");
  //     localStorage.removeItem("refresh-token");
  //     localStorage.removeItem("user");

  //     // Dispatch a custom event that the auth context can listen for
  //     if (typeof window !== "undefined") {
  //       window.dispatchEvent(new CustomEvent("auth:tokenExpired"));

  //       // Redirect to login page
  //       window.location.href = "/login?expired=true";
  //     }

  //     return Promise.reject(refreshError);
  //   } finally {
  //     isRefreshing = false;
  //   }
  // }
);

// Function to check if a token is expired
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    // JWT tokens are in format: header.payload.signature
    // const payload = token.split(".")[1];
    // // Decode the base64 payload
    // const decodedPayload = JSON.parse(atob(payload));
    // // Check if the token is expired
    // return decodedPayload.exp * 1000 < Date.now();
    return true;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export default apiClient;
