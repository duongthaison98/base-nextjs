"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  userService,
  type User,
  type LoginRequest,
} from "@/lib/api/services/user-service";
import { isTokenExpired } from "@/lib/api/axios";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to refresh the user session
  const refreshSession = async (): Promise<boolean> => {
    try {
      // Get the current token
      const token = localStorage.getItem("auth-token");

      // If no token or token is expired, try to refresh
      if (!token || isTokenExpired(token)) {
        const refreshToken = localStorage.getItem("refresh-token");

        if (!refreshToken) {
          return false;
        }

        // Call the refresh token API
        const response = await userService.refreshToken(refreshToken);

        // Save the new tokens
        localStorage.setItem("auth-token", response.accessToken);
        localStorage.setItem("refresh-token", response.refreshToken);

        // Get the user data with the new token
        const userData = await userService.getCurrentUser();
        setUser(userData);

        return true;
      }

      return true;
    } catch (error) {
      console.error("Session refresh failed:", error);
      return false;
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem("auth-token");

        if (token) {
          // Check if token is expired
          if (isTokenExpired(token)) {
            // Try to refresh the session
            const refreshed = await refreshSession();

            if (!refreshed) {
              // If refresh failed, clear auth data
              localStorage.removeItem("auth-token");
              localStorage.removeItem("refresh-token");
              localStorage.removeItem("user");
              setUser(null);
            }
          } else {
            // Token is valid, get the current user
            const userData = await userService.getCurrentUser();
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear any invalid tokens
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for token expired events from axios interceptor
    const handleTokenExpired = () => {
      setUser(null);
      router.push("/login?expired=true");
    };

    window.addEventListener("auth:tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("auth:tokenExpired", handleTokenExpired);
    };
  }, [router]);

  const login = async (data: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await userService.login(data);
      const resUser = await userService.getCurrentUser();
      // Save tokens and user data
      localStorage.setItem("auth-token", response.accessToken);
      localStorage.setItem("refresh-token", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(resUser));

      setUser(resUser);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local storage regardless of API success
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
