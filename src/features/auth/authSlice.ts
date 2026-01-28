

// src/features/auth/authSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Reuse the role type defined in authApi or redefine here if not importing
export type UserRole = "PlatformAdmin" | "RestaurantStaff" | "Guest";

// Interfaces
export interface User {
  name: string;
  email: string; // Changed from 'username' to 'email' as per JSON
  // Updated Role Type
  role: UserRole;
  restaurant_info: boolean | null; // Added
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  expiresAt: string | null;
  isGlobalLoggingOut: boolean;
}

export interface LoginPayload {
  token: string;
  // User interface now includes all necessary fields
  user: User; 
  expires_at: string;
}

// --- Load initial state from storage ---
const storedToken: string | null = Cookies.get("customertoken") || null;

interface StoredAuthData {
  user: User;
  expires_at: string;
}

const storedAuthData: StoredAuthData | null = (() => {
  try {
    const data = localStorage.getItem("authUser");
    return data ? (JSON.parse(data) as StoredAuthData) : null;
  } catch {
    return null;
  }
})();

// --- Initial state ---
const initialState: AuthState = {
  token: storedToken,
  user: storedAuthData?.user || null,
  expiresAt: storedAuthData?.expires_at || null,
  isAuthenticated: !!storedToken && !!storedAuthData?.user,
  loading: false,
  error: null,
  isGlobalLoggingOut: false,
};

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      const { token, user, expires_at } = action.payload;
      
      // user object now correctly contains name, email, role, and restaurant_info_verified
      state.token = token;
      state.user = user; 
      state.isAuthenticated = true;
      state.loading = false;
      state.expiresAt = expires_at;

      localStorage.setItem(
        "authUser",
        JSON.stringify({ user, expires_at })
      );
    },

    setGlobalLoggingOut(state, action: PayloadAction<boolean>) {
      state.isGlobalLoggingOut = action.payload;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.isGlobalLoggingOut = false;
      state.expiresAt = null;

  Cookies.remove("customertoken"); // ✅ correct cookie name
      localStorage.removeItem("authUser");
      localStorage.setItem("logout", Date.now().toString());
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, logout, setError, setGlobalLoggingOut } =
  authSlice.actions;

export default authSlice.reducer;