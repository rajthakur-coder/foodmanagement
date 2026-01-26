



import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../components/app/store";
import { useCustomerSocket } from "../../../services/useCustomerSocket";
import StatusBadge from "../../../components/Common/StatusBadge";
import nofound from "../assets/Images/nofound2.png";
import dayjs from "dayjs";
import { updateOrderStatusInHistory } from "../../../features/orders/ordersSlice";

interface OrderHistoryProps {
  customerId: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ customerId }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orderHistory);

  // 🔹 Connect socket for live updates
  useCustomerSocket(customerId);

  useEffect(() => {
    console.log("Order history updated:", orders);
  }, [orders]);

  return (
    <div className="min-h-fit mb-16 dark:bg-[#1F2937] p-4">
      <h2 className="text-xl font-bold mb-4 text-center dark:text-gray-100">
        Your Orders
      </h2>

      {!orders.length ? (
        <div className="text-center">
          <img src={nofound} alt="No orders" className="w-60 mx-auto" />
          <p className="mt-2 text-gray-500">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNo}
              className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 border dark:border-gray-700"
            >
              <div className="flex justify-between mb-2">
                <p className="font-bold">Order #{order.orderNo}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-3">
                <span>Status:</span>
                <StatusBadge
                  status={
                    ["Pending", "Cancelled"].includes(order.status)
                      ? "Inactive"
                      : "Active"
                  }
                  displayText={order.status}
                />
              </div>

              {/* Items */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.portion}`}
                    className="flex justify-between py-2"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="text-right font-bold text-red-600 mt-2">
                Total: ₹
                {order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

