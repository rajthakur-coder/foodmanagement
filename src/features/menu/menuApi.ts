// src/features/menu/menuApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../../components/app/api";

export interface Variant {
  variant_id: number;
  name: string;
  portion_type: string;
  sku: string | null;
  price: number;
  cost_price: number | null;
  is_available: boolean;
  stock_control: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  type: "Veg" | "NonVeg";
  rating: string;
  rating_count: number;
  is_featured: boolean;
  is_visible: boolean;
  sequence: number;
  images: [];
  variants: Variant[];
  addon_groups: any[];
  combos: any[];
  min_price: number | null;
  max_price: number | null;
}

export interface MenuCategory {
  category_icon: string;
  category_id: number;
  category_name: string;
  sequence: number;
  items: MenuItem[];
}

export interface MenuResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: MenuCategory[];
  };
}

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: appBaseQuery,
  tagTypes: ["Menu"],

  endpoints: (builder) => ({
    getMenu: builder.query<MenuResponse, { restaurant_id: string }>({
      query: (body) => ({
        url: "/menu",
        method: "POST",
        body,
      }),
      providesTags: ["Menu"],
    }),
  }),
});

export const { useGetMenuQuery } = menuApi;
