

import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { logout, setGlobalLoggingOut } from "../../features/auth/authSlice";
import type { RootState } from "../../components/app/store";

// Common raw baseQuery (typed)
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  prepareHeaders: (headers, { getState }) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced baseQuery with 401 handling (strictly typed)
export const appBaseQuery: BaseQueryFn<
  string | FetchArgs,                     // request type
  unknown,                                // response type
  FetchBaseQueryError                     // error type
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {

    // Set global flag before logout
    api.dispatch(setGlobalLoggingOut(true));

    // Short delay for smoother UX
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    // Trigger logout and redirect
    api.dispatch(logout());
    window.location.href = "/login";
  }

  return result;
};
