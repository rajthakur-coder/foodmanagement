import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "./socket";
import { updateOrderStatusInHistory } from "../features/orders/ordersSlice";

export const useCustomerSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ Customer socket connected:", socket.id);

      // ✅ CORRECT JOIN
      socket.emit("joinRoom", { type: "Customer" });
    });

    socket.on("orderStatusUpdated", (payload) => {
      console.log("📦 orderStatusUpdated:", payload);

      dispatch(
        updateOrderStatusInHistory({
          order_no: payload.order_no,
          to_status: payload.to_status,
        })
      );
    });

    socket.on("disconnect", () =>
      console.log("🔴 Customer socket disconnected")
    );

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [dispatch]);
};
