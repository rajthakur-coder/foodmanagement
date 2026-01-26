// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// /* ---------- TYPES ---------- */
// export interface OrderItem {
//   item_icon: string;
//   id: number; // food_item_id
//   name: string;
//   price: number;
//   quantity: number;
//   portion: "full" | "half";
//   image?: string;
// }

// export interface OrderRecord {
//   items: OrderItem[];
//   tableNumber: string;
//   customerName?: string;
//   createdAt: string;
//   orderNo?: string;
// }

// /* ---------- STATE ---------- */
// interface OrdersState {
//   items: OrderItem[];
//   orderHistory: OrderRecord[];
//   currentBill?: OrderRecord;
// }

// const initialState: OrdersState = {
//   items: [],
//   orderHistory: [],
// };

// /* ---------- SLICE ---------- */
// const ordersSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {
//     addToOrders: (state, action: PayloadAction<OrderItem>) => {
//       const existing = state.items.find(
//         (i) =>
//           i.id === action.payload.id &&
//           i.portion === action.payload.portion
//       );

//       if (existing) {
//         existing.quantity += action.payload.quantity;
//       } else {
//         state.items.push(action.payload);
//       }
//     },

//     updateQuantity: (
//       state,
//       action: PayloadAction<{
//         id: number;
//         portion: "full" | "half";
//         quantity: number;
//       }>
//     ) => {
//       const item = state.items.find(
//         (i) =>
//           i.id === action.payload.id &&
//           i.portion === action.payload.portion
//       );
//       if (item) item.quantity = action.payload.quantity;
//     },

//     removeFromOrders: (
//       state,
//       action: PayloadAction<{
//         id: number;
//         portion: "full" | "half";
//       }>
//     ) => {
//       state.items = state.items.filter(
//         (i) =>
//           !(
//             i.id === action.payload.id &&
//             i.portion === action.payload.portion
//           )
//       );
//     },

//     clearOrders: (state) => {
//       state.items = [];
//     },

//     savePlacedOrder: (
//       state,
//       action: PayloadAction<OrderRecord>
//     ) => {
//       state.orderHistory.push(action.payload);
//       state.currentBill = action.payload;
//       state.items = [];
//     },
//   },
// });

// export const {
//   addToOrders,
//   updateQuantity,
//   removeFromOrders,
//   clearOrders,
//   savePlacedOrder,
// } = ordersSlice.actions;

// export default ordersSlice.reducer;




import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ---------- TYPES ---------- */
export interface OrderItem {
  item_icon: string;
  id: number;
  variantId: number;
  name: string;
  price: number;
  quantity: number;
  portion: "full" | "half";
  image?: string;
}

export interface OrderRecord {
  items: OrderItem[];
  tableNumber: string;
  customerName?: string;
  createdAt: string;
  orderNo?: string;
  status: string;
}

/* ---------- STATE ---------- */
interface OrdersState {
  items: OrderItem[];
  orderHistory: OrderRecord[];
  currentBill?: OrderRecord;
}

/* ---------- INITIAL STATE ---------- */
const initialState: OrdersState = {
  items: JSON.parse(localStorage.getItem("cart_items") || "[]"),
  orderHistory: [],
};

/* ---------- SLICE ---------- */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    /* ================= CART ================= */
    addToOrders: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.items.find(
        (i) => i.variantId === action.payload.variantId
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ variantId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.variantId === action.payload.variantId
      );
      if (item) item.quantity = action.payload.quantity;

      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    removeFromOrders: (
      state,
      action: PayloadAction<{ variantId: number }>
    ) => {
      state.items = state.items.filter(
        (i) => i.variantId !== action.payload.variantId
      );

      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    clearOrders: (state) => {
      state.items = [];
      localStorage.removeItem("cart_items");
    },

    /* ================= ORDER HISTORY ================= */

    // 🔥 NEW: API → Redux
    setOrderHistory: (state, action: PayloadAction<OrderRecord[]>) => {
      state.orderHistory = action.payload;
    },

    savePlacedOrder: (state, action: PayloadAction<OrderRecord>) => {
      state.orderHistory.push(action.payload);
      state.currentBill = action.payload;
      state.items = [];
      localStorage.removeItem("cart_items");
    },

    // 🔥 Socket update
    updateOrderStatusInHistory: (
      state,
      action: PayloadAction<{ order_no: string; to_status: string }>
    ) => {
      const { order_no, to_status } = action.payload;
      const order = state.orderHistory.find(
        (o) => o.orderNo === order_no
      );
      if (order) {
        order.status = to_status;
      }
    },
  },
});

/* ---------- EXPORTS ---------- */
export const {
  addToOrders,
  updateQuantity,
  removeFromOrders,
  clearOrders,
  savePlacedOrder,
  setOrderHistory,              // ✅ NEW
  updateOrderStatusInHistory,
} = ordersSlice.actions;

export default ordersSlice.reducer;































// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface OrderItem {
//   item_icon: string;
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   portion: "full" | "half";
//   image?: string;
// }

// export interface OrderRecord {
//   items: OrderItem[];
//   tableNumber: string;
//   customerName?: string;
//   createdAt: string;
//   orderNo: string; // camelCase matches Redux
//   status: string;
// }

// interface OrdersState {
//   items: OrderItem[];
//   orderHistory: OrderRecord[];
//   currentBill?: OrderRecord;
// }

// const initialState: OrdersState = {
//   items: JSON.parse(localStorage.getItem("cart_items") || "[]"),
//   orderHistory: [],
// };

// const ordersSlice = createSlice({
//   name: "orders",
//   initialState,
//   reducers: {
//     addToOrders: (state, action: PayloadAction<OrderItem>) => {
//       const existing = state.items.find(
//         (i) => i.id === action.payload.id && i.portion === action.payload.portion
//       );
//       if (existing) existing.quantity += action.payload.quantity;
//       else state.items.push(action.payload);
//       localStorage.setItem("cart_items", JSON.stringify(state.items));
//     },

//     updateQuantity: (
//       state,
//       action: PayloadAction<{ id: number; portion: "full" | "half"; quantity: number }>
//     ) => {
//       const item = state.items.find(
//         (i) => i.id === action.payload.id && i.portion === action.payload.portion
//       );
//       if (item) item.quantity = action.payload.quantity;
//       localStorage.setItem("cart_items", JSON.stringify(state.items));
//     },

//     removeFromOrders: (
//       state,
//       action: PayloadAction<{ id: number; portion: "full" | "half" }>
//     ) => {
//       state.items = state.items.filter(
//         (i) => !(i.id === action.payload.id && i.portion === action.payload.portion)
//       );
//       localStorage.setItem("cart_items", JSON.stringify(state.items));
//     },

//     clearOrders: (state) => {
//       state.items = [];
//       localStorage.removeItem("cart_items");
//     },

//     savePlacedOrder: (state, action: PayloadAction<OrderRecord>) => {
//       state.orderHistory.push(action.payload);
//       state.currentBill = action.payload;
//       state.items = [];
//       localStorage.removeItem("cart_items");
//     },

//     updateOrderStatusInHistory: (
//       state,
//       action: PayloadAction<{ order_no: string; to_status: string }>
//     ) => {
//       const { order_no, to_status } = action.payload;
//       const order = state.orderHistory.find((o) => o.orderNo === order_no);
//       if (order) order.status = to_status;
//     },
//   },
// });

// export const {
//   addToOrders,
//   updateQuantity,
//   removeFromOrders,
//   clearOrders,
//   savePlacedOrder,
//   updateOrderStatusInHistory,
// } = ordersSlice.actions;

// export default ordersSlice.reducer;

