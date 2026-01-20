

import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../../components/app/api";
import { createCrudEndpoints } from "../../components/app/apiHelpers";

// --- Request interfaces ---
export interface SendOtpRequest { mobile_no: string; }
export interface VerifyOtpRequest { mobile_no: string; mobileOtp: string | number; }
export interface RegisterUserWithTokenRequest { name: string; email?: string; password?: string; mobile_no: string; token: string; }
export interface UpdateUserProfileImageRequest { id: number | string; profile_image: File; }
export interface UserProfileUpdateRequest { key: string; value?: string | string[]; description?: string; type: string; uuid: string; enabled: boolean; }

// --- Response interfaces ---
export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

// --- Main API ---
export const userManagementApi = createApi({
  reducerPath: "userManagementApi",
  baseQuery: appBaseQuery,
  tagTypes: ["user", "admin-user","Guest"],

  endpoints: (builder) => {
    // Generic CRUD endpoints
    const userCrud = createCrudEndpoints<any, number | string>(builder, "user-management/users", { paginatedList: true });
    const adminUserCrud = createCrudEndpoints<any, number | string>(builder, "user-management/users", { paginatedList: true });

    return {
      // --- OTP & Registration ---
      sendOtp: builder.mutation<any, SendOtpRequest>({
        query: (body) => ({ url: `/user-management/register`, method: "POST", body }),
      }),
      verifyOtp: builder.mutation<{ token: string }, VerifyOtpRequest>({
        query: (body) => ({ url: `/user-management/verify-otp`, method: "POST", body }),
      }),
      registerUserWithToken: builder.mutation<any, RegisterUserWithTokenRequest>({
        query: (body) => ({ url: `/user-management/register-user`, method: "POST", body }),
      }),

      // --- User Profile ---
      getUserProfile: builder.query<UserProfileResponse, void>({
        query: () => ({ url: `/user-management/user-profile`, method: "GET" }),
        providesTags: ["user"],
      }),
      updateUserProfile: builder.mutation<UserProfileResponse, UserProfileUpdateRequest[]>({
        query: (body) => ({ url: `/user-management/user-profile/update`, method: "POST", body }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data?.success && data?.statusCode === 1) {
              dispatch(userManagementApi.util.invalidateTags([{ type: "user", id: "LIST" }]));
            }
          } catch {}
        },
      }),
      updateUserProfileImage: builder.mutation<UserProfileResponse, UpdateUserProfileImageRequest>({
        query: ({ id, profile_image }) => {
          const formData = new FormData();
          formData.append("profile_image", profile_image);
          return { url: `/user-management/user-profile-image/update`, method: "POST", body: formData };
        },
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data?.success && data?.statusCode === 1) {
              dispatch(userManagementApi.util.invalidateTags([{ type: "user", id: "LIST" }]));
            }
          } catch {}
        },
      }),
      changePassword: builder.mutation<any, { old_password: string; new_password: string; confirm_password: string }>({
        query: (body) => ({ url: `/user-management/change-password`, method: "POST", body }),
      }),

      // --- Admin User Balance ---
      getAdminUserBalance: builder.query<any, { userId: number | string }>({
        query: (body) => ({ url: `/user-management/admin/users/balance`, method: "POST", body }),
        providesTags: ["admin-user"],
      }),

      // --- Toggle Login OTP ---
      toggleLoginOtp: builder.mutation<any, { id?: number | string }>({
        query: ({ id }) => ({ url: `/user-management/login-otp-enable${id ? `?id=${id}` : ""}`, method: "GET" }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (data?.success && data?.statusCode === 1) {
              dispatch(userManagementApi.util.invalidateTags([
                { type: "user", id: "LIST" },
                { type: "admin-user", id: "LIST" },
              ]));
            }
          } catch {}
        },
      }),

      // --- Inject Generic CRUD endpoints ---
      ...userCrud,
      ...adminUserCrud,
    };
  },
});

// --- Hooks ---
export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterUserWithTokenMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useChangePasswordMutation,
  useToggleLoginOtpMutation,
  useGetAdminUserBalanceQuery,
  useGetListQuery: useGetUserListQuery,
  useGetByIdQuery: useGetUserByIdQuery,
  useGetListQuery: useGetAdminUserListQuery,
  useGetByIdQuery: useGetAdminUserByIdQuery,
} = userManagementApi as any;
