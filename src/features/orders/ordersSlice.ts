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
  id: number; // food_item_id
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
}

/* ---------- STATE ---------- */
interface OrdersState {
  items: OrderItem[];
  orderHistory: OrderRecord[];
  currentBill?: OrderRecord;
}

// ✅ Initialize items from localStorage
const initialState: OrdersState = {
  items: JSON.parse(localStorage.getItem("cart_items") || "[]"),
  orderHistory: [],
};

/* ---------- SLICE ---------- */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToOrders: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.portion === action.payload.portion
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // ✅ Update localStorage
      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        portion: "full" | "half";
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.portion === action.payload.portion
      );
      if (item) item.quantity = action.payload.quantity;

      // ✅ Update localStorage
      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    removeFromOrders: (
      state,
      action: PayloadAction<{
        id: number;
        portion: "full" | "half";
      }>
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.id === action.payload.id &&
            i.portion === action.payload.portion
          )
      );

      // ✅ Update localStorage
      localStorage.setItem("cart_items", JSON.stringify(state.items));
    },

    clearOrders: (state) => {
      state.items = [];
      // ✅ Clear localStorage
      localStorage.removeItem("cart_items");
    },

    savePlacedOrder: (
      state,
      action: PayloadAction<OrderRecord>
    ) => {
      state.orderHistory.push(action.payload);
      state.currentBill = action.payload;
      state.items = [];
      // ✅ Clear localStorage after order placed
      localStorage.removeItem("cart_items");
    },
  },
});

export const {
  addToOrders,
  updateQuantity,
  removeFromOrders,
  clearOrders,
  savePlacedOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
