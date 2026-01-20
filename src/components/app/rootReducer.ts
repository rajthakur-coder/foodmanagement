import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import { authApi } from "../../features/auth/authApi";

import { menuApi } from "../../features/menu/menuApi";
import ordersReducer from "../../features/orders/ordersSlice"
import { ordersApi } from "../../features/createorder/ordersApi";

 // ✅ import new paymentApi

export const rootReducer = combineReducers({
    orders: ordersReducer, // ✅ IMPORTANT

  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,

 [menuApi.reducerPath]: menuApi.reducer,
   [ordersApi.reducerPath]: ordersApi.reducer,


});

export type RootState = ReturnType<typeof rootReducer>;
