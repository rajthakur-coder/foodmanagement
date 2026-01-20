/* ---------- GET ORDER LIST TYPES ---------- */
import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../../components/app/api";


export interface GetOrdersListRequest {
  offset: number;
  limit: number;
  order_no?: string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  channel?: string;
  delivery_type?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: string;
  max_amount?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  variant: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  addons: any[];
  options: any[];
}

export interface OrderRecord {
  order_details: {
    id: number;
    serial_no: number;
    order_no: string;
    status: string;
    payment_status: string;
    payment_method: string | null;
    channel: string | null;
    delivery_type: string;
    currency: string;
    total_amount: string;
    tax_amount: string | null;
    discount_amount: string | null;
    tips_amount: string | null;
    net_amount: string;
    created_at: string;
    updated_at: string;
  };
  restaurant_details: {
    uuid: number;
    name: string;
  };
  customer_details: {
    uuid: number;
    name: string | null;
    mobile_no: string;
  };
  items: OrderItem[];
}

export interface GetOrdersListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  recordsTotal: number;
  recordsFiltered: number;
  data: OrderRecord[];
}


/* ---------- API ---------- */
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({

    /* CREATE ORDER */
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    /* GET ORDERS LIST */
  /* GET ORDERS LIST */
/* GET ORDERS LIST */
getOrdersList: builder.query<
  GetOrdersListResponse,
  GetOrdersListRequest
>({
  query: (body) => ({
    url: "/orders/get-list",
    method: "POST", // POST allowed with query
    body,
  }),
  providesTags: ["Orders"],
}),



  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersListQuery,
} = ordersApi;
