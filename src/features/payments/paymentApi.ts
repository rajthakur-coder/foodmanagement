import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../../components/app/api";

/* ===== Request Types ===== */
export interface GroupPaymentRequest {
  customer_id: number;
  restaurant_id: number;
  provider: string;
  method: string;
}

/* ===== Response Types ===== */
export interface GroupPayment {
  id: number;
  order_id: number;
  amount: string;
}

export interface GroupPaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    group_txn_id: string;
    total_amount: number;
    payments: GroupPayment[];
  };
}

/* ===== API Slice ===== */
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: appBaseQuery,
  endpoints: (builder) => ({
    initiateGroupPayment: builder.mutation<
      GroupPaymentResponse,
      GroupPaymentRequest
    >({
      query: (body) => ({
        url: "/payments/group",
        method: "POST",
        body,
      }),
    }),
  }),
});

/* ===== Hooks ===== */
export const {
  useInitiateGroupPaymentMutation,
} = paymentApi;
