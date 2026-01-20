// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { useGetOrdersListMutation } from "../../../features/createorder/ordersApi";
// import StatusBadge from "../../../components/Common/StatusBadge"; 




// const OrderHistory = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<any[]>([]); // ✅ OrderRecord hata diya
//   const [getOrdersList, { isLoading, error }] = useGetOrdersListMutation();

//   document.title = "Order History";
//   const today = dayjs().format("YYYY-MM-DD");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await getOrdersList({
//           offset: 0,
//           limit: 50,
//           order_no: "",
//           status: "",
//           payment_status: "",
//           payment_method: "",
//           channel: "",
//           delivery_type: "",
//           start_date: today,
//           end_date: today,
//           min_amount: "",
//           max_amount: "",
//         }).unwrap();

//         console.log("API response:", res);
//         if (res.success) setOrders(res.data);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//       }
//     };

//     fetchOrders();
//   }, [getOrdersList, today]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>Loading orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>Error fetching orders.</p>
//       </div>
//     );
//   }

//   if (!orders.length) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen  rounded-lg bg-surface-card">
//         <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
//           No Orders Today
//         </h2>
//         <p className="mb-4 text-center text-gray-500 dark:text-gray-400">
//           You haven’t placed any orders today.
//         </p>
//         <button
//           onClick={() => navigate("/menu")}
//           className="px-5 py-2 font-semibold text-white transition bg-green-600 rounded-full shadow hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
//         >
//           Start Ordering
//         </button>
//       </div>
//     );
//   }

//   const totalAmount = orders.reduce(
//     (sum, order) =>
//       sum +
//       order.items.reduce(
//         (itemSum, item) => itemSum + Number(item.total_price) * item.quantity,
//         0
//       ),
//     0
//   );

//   return (
//     <div className="min-h-screen   dark:bg-[#1F2937] pb-16 lg:pb-0  rounded-lg">
   

//       <div className="bg-white shadow-md p-2 dark:bg-gray-900 sm:p-3">

//    <h3 className="mb-3 mt-3 text-lg font-bold text-center text-gray-900 dark:text-gray-100 sm:text-xl md:text-2xl">
//         Order History
//       </h3>

// {orders.map((order) => (
//   <div
//     key={order.order_details.id}
//     className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 mb-4 border border-gray-200 dark:border-gray-700 transition hover:shadow-lg"
//   >
//     {/* Header: Order No, Serial, Date */}
//     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
//       <div>
//         <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
//           Order No: {order.order_details.serial_no}
//         </p>
       
//       </div>
//       <p className="text-gray-500 dark:text-gray-400">
//         Date: {dayjs(order.order_details.created_at).format("DD MMM YYYY, hh:mm A")}
//       </p>
//     </div>

//     {/* Status and Payment Badges */}
// <div className="mb-3 border p-2 rounded-lg bg-surface-body">
//   {/* Status */}
//   <div className="flex justify-between items-center mb-2">
//     <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
//     <StatusBadge
//       status={order.order_details.status === "Pending" ? "Inactive" : "Active"}
//       displayText={order.order_details.status}
//     />
//   </div>

//   {/* Payment */}
//   <div className="flex justify-between items-center">
//     <span className="font-semibold text-gray-700 dark:text-gray-300">Payment:</span>
//     <StatusBadge
//       status={order.order_details.payment_status === "Unpaid" ? "Inactive" : "Active"}
//       displayText={order.order_details.payment_status}
//     />
//   </div>
// </div>


// {/* Customer & Table */}
// <div className="flex flex-col items-center mb-3">
//   {order.customer_details.name && (
//     <p className="text-gray-700 dark:text-gray-300">
//       Customer: {order.customer_details.name}
//     </p>
//   )}
//   <p className="text-gray-700 dark:text-gray-300">
//     Table: {order.order_details.delivery_type === "dine_in" ? "Dine In" : order.order_details.delivery_type}
//   </p>
// </div>


//     {/* Items List */}
//     <div className="divide-y divide-gray-200 dark:divide-gray-700">
//       {order.items.map((item: any) => (
//         <div
//           key={`${item.id}-${item.variant}`}
//           className="flex justify-between py-2"
//         >
//           <span className="text-gray-800 dark:text-gray-200">
//             {item.name} ({item.variant}) × {item.quantity}
//           </span>
//           <span className="font-semibold text-gray-900 dark:text-gray-100">
//             ₹{Number(item.total_price) * item.quantity}
//           </span>
//         </div>
//       ))}
//     </div>

 
//   </div>
// ))}


//         <div className="space-y-1 text-right dark:text-gray-200">
//           <p className="font-bold text-red-600 text-md sm:text-lg dark:text-red-400">
//             Total Amount: ₹{totalAmount}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderHistory;










import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import { useGetOrdersListQuery } from "../../../features/createorder/ordersApi";
import StatusBadge from "../../../components/Common/StatusBadge";
import Skeleton from "../../../components/Common/Skeleton";

import CustomDatePicker from "../../../components/Common/DateAndTime";
import CustomSelect from "../../../components/Common/CustomSelect";
import nofound from "../../../assets/Images/nofound2.png";


import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "./orderFilters";

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  document.title = "Order History";

  /* ================= FILTER STATES ================= */
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  /* ================= API PAYLOAD ================= */
  const payload = {
    offset: 0,
    limit: 50,
    order_no: "",
    status,
    payment_status: paymentStatus,
    payment_method: "",
    channel: "",
    delivery_type: "",
    start_date: startDate ? startDate.format("YYYY-MM-DD") : "",
    end_date: endDate ? endDate.format("YYYY-MM-DD") : "",
    min_amount: "",
    max_amount: "",
  };

  /* ================= API ================= */
  const { data, isLoading, error } = useGetOrdersListQuery(payload);

  const orders = data?.data ?? [];

  /* ================= STATES ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen p-5">
        <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={150} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error fetching orders.</p>
      </div>
    );
  }

  /* ================= TOTAL ================= */
  const totalAmount = orders.reduce(
    (sum: number, order: any) =>
      sum +
      order.items.reduce(
        (itemSum: number, item: any) =>
          itemSum + Number(item.total_price) * item.quantity,
        0
      ),
    0
  );

  return (
    <div className="min-h-fit mb-16  dark:bg-[#1F2937]">
      <div className="bg-white pt-4 lg:pt-8 dark:bg-gray-900 p-3 shadow-md rounded-lg">

        {/* ================= FILTER BAR ================= */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-4">
          <CustomDatePicker
            label="Start Date"
            value={startDate}
            onChange={(val) => setStartDate(val ? dayjs(val) : null)}
          />

          <CustomDatePicker
            label="End Date"
            value={endDate}
            onChange={(val) => setEndDate(val ? dayjs(val) : null)}
          />

          <CustomSelect
            label="Order Status"
            value={status}
            options={ORDER_STATUS_OPTIONS}
            onChange={(val) => setStatus(String(val))}
          />

          <CustomSelect
            label="Payment Status"
            value={paymentStatus}
            options={PAYMENT_STATUS_OPTIONS}
            onChange={(val) => setPaymentStatus(String(val))}
          />
        </div>

        {/* ================= HEADER ================= */}
        <h3 className="mb-2 text-lg  font-bold text-center dark:text-gray-100">
          Order History
        </h3>

        {/* ================= EMPTY ================= */}

        {!orders.length && (
          <div className="text-center">
  <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-4">
              <img
                src={nofound} // imported image
                alt="No items found"
                className="w-60 lg:w-60"
              />
            </div>           
             <button
              onClick={() => navigate("/menu")}
              className="px-6 py-2 mt-4 mb-4 bg-green-600 text-white rounded-full"
            >
              Start Ordering
            </button>
          </div>
        )}
        {/* ================= ORDERS ================= */}
        {orders.map((order: any) => (
          <div
            key={order.order_details.id}
            className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 mb-4 border dark:border-gray-700"
          >
            <div className="flex justify-between mb-2">
              <p className="font-bold">
                Order #{order.order_details.serial_no}
              </p>
              <p className="text-sm text-gray-500">
                {dayjs(order.order_details.created_at).format(
                  "DD MMM YYYY, hh:mm A"
                )}
              </p>
            </div>

            <div className="border rounded-lg p-2 mb-3">
              <div className="flex justify-between mb-1">
                <span>Status</span>
                <StatusBadge
                  status={
                    order.order_details.status === "Pending"
                      ? "Inactive"
                      : "Active"
                  }
                  displayText={order.order_details.status}
                />
              </div>

              <div className="flex justify-between">
                <span>Payment</span>
                <StatusBadge
                  status={
                    order.order_details.payment_status === "Unpaid"
                      ? "Inactive"
                      : "Active"
                  }
                  displayText={order.order_details.payment_status}
                />
              </div>
            </div>

            <div className="divide-y">
              {order.items.map((item: any) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex justify-between py-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{Number(item.total_price) * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ================= TOTAL ================= */}
        {!!orders.length && (
          <div className="text-right font-bold text-red-600">
            Total Amount: ₹{totalAmount}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
