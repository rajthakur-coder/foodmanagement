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



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";

import { useGetOrdersListQuery } from "../../../features/createorder/ordersApi";
import { setOrderHistory } from "../../../features/orders/ordersSlice";
import { useCustomerSocket } from "../../../services/useCustomerSocket";
import { useTheme } from "../../../components/context/ThemeContext";

import type { RootState } from "../../../components/app/store";
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
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  document.title = "Order History";
  useCustomerSocket();

  /* ================= FILTER STATES ================= */
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  const payload = {
    offset: 0,
    limit: 50,
    status,
    payment_status: paymentStatus,
    start_date: startDate?.format("YYYY-MM-DD"),
    end_date: endDate?.format("YYYY-MM-DD"),
  };

  const { data, isLoading, error } = useGetOrdersListQuery(payload);

  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((o: any) => ({
        orderNo: o.order_details?.order_no || "",
        serialNo: o.order_details?.serial_no || 0,
        status: o.order_details?.status || "Pending",
        paymentStatus: o.order_details?.payment_status || "Unpaid",
        createdAt: o.order_details?.created_at,
        tableNumber: o.table_details?.table_number || "N/A",
        netAmount: o.order_details?.net_amount || "0",
        customerNote: o.order_details?.customer_note || "",
        deliveryType: o.order_details?.delivery_type || "dine_in",
        items: o.items || [],
      }));
      dispatch(setOrderHistory(mapped));
    }
  }, [data, dispatch]);

  const orders = useSelector((state: RootState) => state.orders.orderHistory);

  if (isLoading) {
    return (
      <div className={`min-h-screen p-5 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
        <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={180} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 p-4 transition-colors duration-300 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
      
      {/* ================= FILTER SECTION ================= */}
      <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl shadow-sm border transition-colors ${
        isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-100"
      }`}>
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
          label="Status"
          value={status}
          options={ORDER_STATUS_OPTIONS}
          onChange={(val) => setStatus(val.toString())}
        />
        <CustomSelect
          label="Payment"
          value={paymentStatus}
          options={PAYMENT_STATUS_OPTIONS}
          onChange={(val) => setPaymentStatus(val.toString())}
        />
      </div>

      {/* ================= ORDERS LIST ================= */}
      {!orders || orders.length === 0 ? (
        <div className="text-center mt-12">
          <img src={nofound} className="w-40 mx-auto opacity-40 grayscale" alt="No Orders" />
          <p className={`mt-4 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>No orders found</p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-6 bg-[#3FA90C] text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        orders.map((order: any) => (
          <div 
            key={order.orderNo} 
            className={`rounded-2xl p-4 mb-5 border shadow-sm transition-all ${
              isDark ? "bg-[#1F2937] border-gray-700 text-gray-100" : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="bg-[#3FA90C] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                     Table {order.tableNumber}
                   </span>
                  
                </div>
                <h3 className="font-black text-lg leading-tight">Order #{order.serialNo}</h3>
                <p className={`text-[10px] opacity-70`}>
                  {order.createdAt ? dayjs(order.createdAt).format("DD MMM YYYY | hh:mm A") : "---"}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge 
                  status={order.status === "Pending" ? "Inactive" : "Active"} 
                  displayText={order.status || "Pending"} 
                />
                <p className={`text-[11px] mt-2 font-black tracking-tighter ${
                  order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-rose-500'
                }`}>
                  {(order.paymentStatus || "Unpaid").toUpperCase()}
                </p>
              </div>
            </div>

            {/* Items Summary Section */}
            <div className={`rounded-xl p-3 mb-4 border ${isDark ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm mb-2 last:mb-0">
                    <div className="flex-1 pr-4">
                      <p className="font-bold leading-tight">
                        {item.quantity}x <span className="font-semibold ml-1">{item.name}</span>
                      </p>
                      <p className={`text-[10px] opacity-60`}>
                        {item.variant} • ₹{item.unit_price}
                      </p>
                    </div>
                    <p className="font-bold text-right">₹{item.total_price}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs opacity-50 text-center italic">No items available</p>
              )}
            </div>

            {/* Note Section */}
            {order.customerNote && (
              <div className={`mb-4 p-2.5 rounded-lg border-l-4 text-[11px] leading-relaxed italic ${
                isDark ? "bg-orange-950/20 border-orange-600 text-orange-200" : "bg-orange-50 border-orange-400 text-orange-800"
              }`}>
                <span className="font-bold not-italic">Note:</span> {order.customerNote}
              </div>
            )}

            {/* Bill Footer */}
            <div className={`flex justify-between items-center pt-4 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Total Bill Amount</p>
                <p className={`text-[11px] font-medium capitalize flex items-center gap-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                   <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                   {order.deliveryType ? order.deliveryType.replace('_', ' ') : 'Dine In'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black ${isDark ? "text-green-400" : "text-green-700"}`}>
                  ₹{order.netAmount}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;