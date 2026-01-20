
// src/features/auth/authApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../../components/app/api";

// --- New Role Definition for consistency ---
export type UserRole = "PlatformAdmin" | "RestaurantStaff" | "Guest";

export interface LoginResponseData {
  success: any;
  data: any;
  message: string;
  // Mobile, Username, and statusCode are not present in your provided successful JSON response, 
  // but keeping them if your login flow needs them.
  mobile?: string | number; 
  username?: string; 
  statusCode: number;
  token: string;
  expires_at: string;
  user: {
    name: string;
    email: string; // Changed from 'username' to 'email' as per JSON
    // Updated Role Type
    role: UserRole;
    restaurant_info: boolean | null; // Added based on JSON structure
  };
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

export interface LoginRequest {
  username: string;
  password: string;
  latitude?: number;
  longitude?: number;
}

export interface LogoutRequest {
  all_device: boolean;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// --- authApi ---
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body: LoginRequest) => ({
        url: "/auth/customer/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    loginVerifyOtp: builder.mutation<
      LoginResponse,
      {
        username?: string;
        mobile_no?: string;
        otp: number | string;
        latitude?: number;
        longitude?: number;
      }
    >({
      query: (body) => ({
        url: "/auth/login/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (body: LogoutRequest) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: { verify: string; username?: string; mobile_no?: string };
      },
      { username?: string; mobile_no?: string }
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    verifyForgotPasswordOtp: builder.mutation<
      { success: boolean; statusCode: number; message: string; data: { token: string } },
      { username?: string; mobile_no?: string; otp: string }
    >({
      query: (body) => ({
        url: "/auth/forgot-password/verify-otp",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      { success: boolean; statusCode: number; message: string },
      { token: string; new_password: string; confirm_password: string }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
});

// --- Export hooks ---
export const {
  useLoginMutation,
  useLoginVerifyOtpMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;