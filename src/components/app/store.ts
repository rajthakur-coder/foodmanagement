import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "../../features/auth/authApi";
import { menuApi } from "../../features/menu/menuApi";
import { ordersApi } from "../../features/createorder/ordersApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
        menuApi.middleware,
         ordersApi.middleware,

    ),
  devTools: import.meta.env.MODE !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
