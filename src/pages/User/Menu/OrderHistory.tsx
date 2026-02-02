// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import dayjs, { Dayjs } from "dayjs";
// import Cookies from "js-cookie";
// import { RiVolumeUpFill, RiSearchLine, RiEqualizerLine } from "react-icons/ri";

// import { useGetOrdersListQuery } from "../../../features/createorder/ordersApi";
// import { setOrderHistory } from "../../../features/orders/ordersSlice";
// import { useCustomerSocket } from "../../../services/useCustomerSocket";
// import { useTheme } from "../../../components/context/ThemeContext";
// import { useGlobalLoader } from "../../../components/ui/GlobalLoader"; 
// import { useInitiateGroupPaymentMutation } from "../../../features/payments/paymentApi";

// import type { RootState } from "../../../components/app/store";
// import StatusBadge from "../../../components/Common/StatusBadge";
// import Skeleton from "../../../components/Common/Skeleton";
// import CustomDatePicker from "../../../components/Common/DateAndTime";
// import CustomSelect from "../../../components/Common/CustomSelect";
// import { ToasterUtils } from "../../../components/ui/toast";
// import nofound from "../../../assets/Images/nofound2.png";

// import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "./orderFilters";

// const OrderHistory: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { theme } = useTheme();
//   const { showLoader, hideLoader } = useGlobalLoader();
//   const isDark = theme === "dark";

//   const { unlockAudio } = useCustomerSocket();
//   const [initiateGroupPayment, { isLoading: isPaying }] = useInitiateGroupPaymentMutation();

//   const [hasEverEnabled, setHasEverEnabled] = useState(() => {
//     return localStorage.getItem("customer_sound_pref") === "enabled";
//   });
//   const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
  
//   const [showFilters, setShowFilters] = useState(false);
//   // TAB STATE: 'pending' or 'completed'
//   const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

//   const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
//   const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
//   const [status, setStatus] = useState<string>("");
//   const [paymentStatus, setPaymentStatus] = useState<string>("");

//   const payload = {
//     offset: 0,
//     limit: 50,
//     status,
//     payment_status: paymentStatus,
//     start_date: startDate?.format("YYYY-MM-DD"),
//     end_date: endDate?.format("YYYY-MM-DD"),
//   };

//   const { data, isLoading, isFetching } = useGetOrdersListQuery(payload);
//   const orders = useSelector((state: RootState) => state.orders.orderHistory);

//   // Tab Filtering Logic
// // Tab Filtering Logic - FIXED to prevent .toLowerCase() crash
//   const filteredOrders = useMemo(() => {
//     if (activeTab === "completed") {
//       // Use optional chaining (?.) and provide a fallback string
//       return orders.filter((o: any) => (o.status || "").toLowerCase() === "completed");
//     } else {
//       // Pending me Completed ke alawa sab dikhega
//       return orders.filter((o: any) => (o.status || "").toLowerCase() !== "completed");
//     }
//   }, [orders, activeTab]);

//   const { grandTotal, hasUnpaidOrders } = useMemo(() => {
//     const unpaid = orders.filter(
//       (o: any) => (o.paymentStatus ?? "").toLowerCase() !== "paid"
//     );
//     const total = unpaid.reduce((sum, o) => sum + Number(o.netAmount), 0);
//     return { grandTotal: total, hasUnpaidOrders: unpaid.length > 0 };
//   }, [orders]);

//   const handleEnableSound = useCallback(() => {
//     unlockAudio();
//     setHasEverEnabled(true);
//     setIsSessionUnlocked(true);
//     localStorage.setItem("customer_sound_pref", "enabled");
//   }, [unlockAudio]);

//   const handleViewBill = async () => {
//     const token = Cookies.get("customertoken");
//     if (!token) {
//       navigate("/auth/customer/login");
//       return;
//     }

//     const restaurantId = sessionStorage.getItem("restaurant_id");
//     if (!restaurantId) {
//       ToasterUtils.error("Invalid session. Please scan QR again.");
//       return;
//     }

//     try {
//       showLoader();
//       const res = await initiateGroupPayment({
//         customer_id: 1, 
//         restaurant_id: Number(restaurantId),
//         provider: "Cash",
//         method: "Cash",
//       }).unwrap();

//       ToasterUtils.success("Final Bill Generated");
//       navigate("/view-bill", { state: { billData: res.data } });
//     } catch (error) {
//       ToasterUtils.error("Failed to generate bill");
//     } finally {
//       hideLoader();
//     }
//   };
// // OrderHistory.tsx mein ise update karein
// useEffect(() => {
//   if (isFetching) {
//     showLoader();
//   } else {
//     hideLoader();
//   }

//   // Cleanup function: Jab user page se bahar jaye toh loader band ho jaye
//   return () => {
//     hideLoader();
//   };
// }, [isFetching, showLoader, hideLoader]);

//   useEffect(() => {
//     if (data?.data) {
//       const mapped = data.data.map((o: any) => ({
//         orderNo: o.order_details?.order_no || "",
//         serialNo: o.order_details?.serial_no || 0,
//         status: o.order_details?.status || "Pending",
//         paymentStatus: o.order_details?.payment_status || "Unpaid",
//         createdAt: o.order_details?.created_at,
//         tableNumber: o.table_details?.table_number || "N/A",
//         netAmount: o.order_details?.net_amount || "0",
//         items: o.items || [],
//       }));
//       dispatch(setOrderHistory(mapped));
//     }
//   }, [data, dispatch]);

//   useEffect(() => {
//     if (hasEverEnabled && !isSessionUnlocked) {
//       const silentUnlock = () => {
//         unlockAudio();
//         setIsSessionUnlocked(true);
//         window.removeEventListener("click", silentUnlock);
//       };
//       window.addEventListener("click", silentUnlock);
//       return () => window.removeEventListener("click", silentUnlock);
//     }
//   }, [hasEverEnabled, isSessionUnlocked, unlockAudio]);

//   if (isLoading && !data) {
//     return (
//       <div className={`min-h-screen p-5 pt-24 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
//         <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={150} />
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen pb-40 lg:pb-28 pt-20 p-4 transition-colors duration-300 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
      
//       {!hasEverEnabled && orders.length > 0 && (
//         <div className="mb-4 p-4 rounded-2xl bg-blue-700 text-white flex justify-between items-center shadow-lg">
//           <div className="flex-1">
//             <p className="text-sm font-bold">Turn on order sounds?</p>
//             <p className="text-[10px] opacity-90">Get notified when food is ready!</p>
//           </div>
//           <button onClick={handleEnableSound} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-xs font-black">
//             ENABLE
//           </button>
//         </div>
//       )}

//       {/* HEADER WITH FILTERS */}
//       <div className="flex justify-between items-center mb-6 px-1">
//         <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-gray-800"}`}>Order History</h2>
//         <div className="flex gap-4">
//           <RiEqualizerLine 
//             size={22} 
//             className={`${showFilters ? "text-blue-500" : (isDark ? "text-gray-400" : "text-gray-600")} cursor-pointer`} 
//             onClick={() => setShowFilters(!showFilters)}
//           />
//         </div>
//       </div>

//       {/* FILTER BOX */}
//       {showFilters && (
//         <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-100"}`}>
//           <CustomDatePicker label="Start" value={startDate} onChange={(val) => setStartDate(val ? dayjs(val) : null)} />
//           <CustomDatePicker label="End" value={endDate} onChange={(val) => setEndDate(val ? dayjs(val) : null)} />
//           <CustomSelect label="Status" value={status} options={ORDER_STATUS_OPTIONS} onChange={(val) => setStatus(val.toString())} />
//           <CustomSelect label="Payment" value={paymentStatus} options={PAYMENT_STATUS_OPTIONS} onChange={(val) => setPaymentStatus(val.toString())} />
//         </div>
//       )}

//       {/* TABS SECTION */}
//       <div className={`flex p-1 mb-6 rounded-xl ${isDark ? "bg-[#1F2937]" : "bg-gray-200/50"}`}>
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${
//             activeTab === "pending"
//               ? "bg-[#3FA90C] text-white shadow-md"
//               : `text-gray-500 ${isDark ? "hover:text-gray-300" : "hover:text-gray-700"}`
//           }`}
//         >
//           PENDING
//         </button>
//         <button
//           onClick={() => setActiveTab("completed")}
//           className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${
//             activeTab === "completed"
//               ? "bg-[#3FA90C] text-white shadow-md"
//               : `text-gray-500 ${isDark ? "hover:text-gray-300" : "hover:text-gray-700"}`
//           }`}
//         >
//           COMPLETED
//         </button>
//       </div>

//       {filteredOrders.length === 0 ? (
//         <div className="text-center mt-12">
//           <img src={nofound} className="w-40 mx-auto opacity-40 grayscale" alt="No Orders" />
//           <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//             No {activeTab} orders found
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredOrders.map((order: any) => (
//             <div key={order.orderNo} className={`rounded-2xl p-4 border shadow-sm ${isDark ? "bg-[#1F2937] border-gray-700 text-gray-100" : "bg-white border-gray-100 text-gray-900"}`}>
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <span className="bg-[#3FA90C] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Table {order.tableNumber}</span>
//                   <h3 className="font-black text-lg mt-1">Order #{order.serialNo}</h3>
//                   <p className="text-[10px] opacity-60">{order.createdAt ? dayjs(order.createdAt).format("DD MMM YYYY | hh:mm A") : "-"}</p>
//                 </div>
//                 <div className="text-right">
//                   <StatusBadge status={order.status === "Pending" ? "Inactive" : "Active"} displayText={order.status} />
//                   <p className={`text-[11px] mt-2 font-bold ${
//                     (order.paymentStatus ?? "").toLowerCase() === 'paid'
//                       ? 'text-green-500'
//                       : 'text-rose-500'
//                   }`}>
//                     {order.paymentStatus?.toUpperCase() ?? "N/A"}
//                   </p>
//                 </div>
//               </div>
              
//               <div className={`rounded-xl p-3 mb-4 border ${isDark ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
//               <div className={`rounded-xl p-3 mb-4 border ${isDark ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
//   {order.items?.map((item: any, idx: number) => (
//     <div key={idx} className="mb-2 last:mb-0">
//       <div className="flex justify-between text-sm font-bold">
//         <div className="flex flex-col">
//           <span>{item.quantity}x {item.name}</span>
//           {/* Variant (Full/Half) Display */}
//           {item.variant && (
//             <span className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//               ({item.variant})
//             </span>
//           )}
//         </div>
//         <span>₹{item.total_price}</span>
//       </div>
//     </div>
//   ))}
// </div>
//               </div>

//               <div className="flex justify-between items-center pt-2">
//                 <p className="text-[10px] font-bold opacity-50">Total Amount</p>
//                 <p className="text-lg font-black">₹{order.netAmount}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//     {hasUnpaidOrders && (
//         <div className="fixed lg:bottom-5 bottom-[70px] left-0 right-0 z-50 px-4 pointer-events-none">
//           <div className={`max-w-4xl mx-auto p-4 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border flex items-center justify-between transition-all pointer-events-auto ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200"}`}>
//             <div>
//               <p className={`text-[8px] font-bold uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>Unpaid Grand Total</p>
//               <p className={`text-xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>₹{grandTotal}</p>
//             </div>
//             <button 
//               onClick={handleViewBill}
//               disabled={isPaying}
//               className="bg-[#3FA90C] hover:bg-[#358d0a] text-white px-8 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 active:scale-95"
//             >
//               {isPaying ? "Wait..." : "VIEW FINAL BILL"}
//             </button>
//           </div>
//         </div>
//       )}

//       {isSessionUnlocked && (
//         <div className="fixed top-20 right-12 p-2 bg-green-500/10 rounded-full">
//           <RiVolumeUpFill size={14} className="text-green-500 animate-pulse" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;


























import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";
import { RiVolumeUpFill, RiEqualizerLine } from "react-icons/ri";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"; // LayoutGroup added for smoothness

import { useGetOrdersListQuery } from "../../../features/createorder/ordersApi";
import { setOrderHistory } from "../../../features/orders/ordersSlice";
import { useCustomerSocket } from "../../../services/useCustomerSocket";
import { useTheme } from "../../../components/context/ThemeContext";
import { useGlobalLoader } from "../../../components/ui/GlobalLoader"; 
import { useInitiateGroupPaymentMutation } from "../../../features/payments/paymentApi";

import type { RootState } from "../../../components/app/store";
import StatusBadge from "../../../components/Common/StatusBadge";
import Skeleton from "../../../components/Common/Skeleton";
import CustomDatePicker from "../../../components/Common/DateAndTime";
import CustomSelect from "../../../components/Common/CustomSelect";
import { ToasterUtils } from "../../../components/ui/toast";
import nofound from "../../../assets/Images/nofound.png";

import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "./orderFilters";

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { showLoader, hideLoader } = useGlobalLoader();
  const isDark = theme === "dark";

  const { unlockAudio } = useCustomerSocket();
  const [initiateGroupPayment, { isLoading: isPaying }] = useInitiateGroupPaymentMutation();

  const [hasEverEnabled, setHasEverEnabled] = useState(() => {
    return localStorage.getItem("customer_sound_pref") === "enabled";
  });
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  const payload = useMemo(() => ({
    offset: 0,
    limit: 50,
    status,
    payment_status: paymentStatus,
    start_date: startDate?.format("YYYY-MM-DD"),
    end_date: endDate?.format("YYYY-MM-DD"),
  }), [status, paymentStatus, startDate, endDate]);

  const { data, isLoading, isFetching } = useGetOrdersListQuery(payload);
  const orders = useSelector((state: RootState) => state.orders.orderHistory);

  const filteredOrders = useMemo(() => {
    if (activeTab === "completed") {
      return orders.filter((o: any) => (o.status || "").toLowerCase() === "completed");
    } else {
      return orders.filter((o: any) => (o.status || "").toLowerCase() !== "completed");
    }
  }, [orders, activeTab]);

  const { grandTotal, hasUnpaidOrders } = useMemo(() => {
    const unpaid = orders.filter(
      (o: any) => (o.paymentStatus ?? "").toLowerCase() !== "paid"
    );
    const total = unpaid.reduce((sum, o) => sum + Number(o.netAmount), 0);
    return { grandTotal: total, hasUnpaidOrders: unpaid.length > 0 };
  }, [orders]);

  const handleEnableSound = useCallback(() => {
    unlockAudio();
    setHasEverEnabled(true);
    setIsSessionUnlocked(true);
    localStorage.setItem("customer_sound_pref", "enabled");
  }, [unlockAudio]);

  const handleViewBill = async () => {
    const token = Cookies.get("customertoken");
    if (!token) {
      navigate("/auth/customer/login");
      return;
    }
    const restaurantId = sessionStorage.getItem("restaurant_id");
    if (!restaurantId) {
      ToasterUtils.error("Invalid session. Please scan QR again.");
      return;
    }
    try {
      showLoader();
      const res = await initiateGroupPayment({
        customer_id: 1, 
        restaurant_id: Number(restaurantId),
        provider: "Cash",
        method: "Cash",
      }).unwrap();
      ToasterUtils.success("Final Bill Generated");
      navigate("/view-bill", { state: { billData: res.data } });
    } catch (error) {
      ToasterUtils.error("Failed to generate bill");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (isFetching) showLoader(); else hideLoader();
  }, [isFetching]);

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
        items: o.items || [],
      }));
      dispatch(setOrderHistory(mapped));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (hasEverEnabled && !isSessionUnlocked) {
      const silentUnlock = () => {
        unlockAudio();
        setIsSessionUnlocked(true);
        window.removeEventListener("click", silentUnlock);
      };
      window.addEventListener("click", silentUnlock);
      return () => window.removeEventListener("click", silentUnlock);
    }
  }, [hasEverEnabled, isSessionUnlocked, unlockAudio]);

  if (isLoading && !data) {
    return (
      <div className={`min-h-screen p-5 pt-24 ${isDark ? "bg-[#111827]" : "bg-white"}`}>
        <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={150} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-40 lg:pb-28 pt-20 p-4 transition-colors duration-500 ${isDark ? "bg-[#111827]" : "bg-[#F7F7F7]"}`}>
      
      {/* Sound Notification Alert */}
      {!hasEverEnabled && orders.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-2xl bg-blue-600 text-white flex justify-between items-center shadow-lg shadow-blue-500/20"
        >
          <div className="flex-1">
            <p className="text-sm font-bold">Order updates chahiye?</p>
            <p className="text-[11px] opacity-80">Enable sounds to get food alerts.</p>
          </div>
          <button onClick={handleEnableSound} className="bg-white text-blue-600 px-5 py-2 rounded-xl text-xs font-black shadow-sm active:scale-90 transition-transform">
            ENABLE
          </button>
        </motion.div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>My Orders</h2>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-full transition-all duration-300 ${showFilters ? "bg-blue-600 text-white rotate-90" : (isDark ? "bg-gray-800 text-gray-400" : "bg-white shadow-md text-gray-600")}`}
        >
          <RiEqualizerLine size={20} />
        </motion.button>
      </div>

      {/* FILTER BOX - Optimized Animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="overflow-hidden"
          >
            <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl border ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200 shadow-sm"}`}>
              <CustomDatePicker label="Start Date" value={startDate} onChange={(val) => setStartDate(val ? dayjs(val) : null)} />
              <CustomDatePicker label="End Date" value={endDate} onChange={(val) => setEndDate(val ? dayjs(val) : null)} />
              <CustomSelect label="Order Status" value={status} options={ORDER_STATUS_OPTIONS} onChange={(val) => setStatus(val.toString())} />
              <CustomSelect label="Payment" value={paymentStatus} options={PAYMENT_STATUS_OPTIONS} onChange={(val) => setPaymentStatus(val.toString())} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABS - Pill Style with Layout Animation */}
      <div className={`relative flex p-1.5 mb-8 rounded-2xl ${isDark ? "bg-[#1F2937]" : "bg-gray-200/60"}`}>
        {["pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`relative flex-1 py-3 text-xs font-black rounded-xl transition-colors duration-300 z-10 ${
              activeTab === tab ? "text-[#3FA90C]" : "text-gray-500"
            }`}
          >
            {tab === "pending" ? "ACTIVE ORDERS" : "COMPLETE ORDERS"}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ORDERS LIST - Smooth List Transition */}
      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-20"
            >
              <img src={nofound} className="w-32 mx-auto opacity-20 grayscale" alt="No Orders" />
              <p className={`mt-4 font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                No {activeTab} orders found
              </p>
            </motion.div>
          ) : (
            filteredOrders.map((order: any) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={order.orderNo} 
                className={`relative rounded-3xl overflow-hidden border transition-shadow ${isDark ? "bg-[#1F2937] border-gray-700 shadow-xl" : "bg-white border-gray-100 shadow-md shadow-gray-200/50"}`}
              >
                {/* Header section */}
                <div className="p-4 border-b border-dashed border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="flex flex-col items-center justify-center bg-[#3FA90C]/10 border border-[#3FA90C]/20 w-12 h-12 rounded-2xl">
                        <span className="text-[8px] font-black text-[#3FA90C] leading-none uppercase">Table</span>
                        <span className="text-base font-black text-[#3FA90C] leading-none">{order.tableNumber}</span>
                      </div>
                      <div>
                        <h3 className={`font-black text-base ${isDark ? "text-white" : "text-gray-900"}`}>Order #{order.serialNo}</h3>
                        <p className="text-[10px] font-medium opacity-50 uppercase tracking-wider">
                          {order.createdAt ? dayjs(order.createdAt).format("DD MMM • hh:mm A") : "-"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status === "Pending" ? "Inactive" : "Active"} displayText={order.status} />
                    </div>
                  </div>
                </div>
                
                {/* Items List */}
                <div className="p-4 bg-transparent">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center mb-2 last:mb-0">
                      <div className="flex items-center gap-2">
                         <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${isDark ? "border-gray-600 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                          {item.quantity}
                         </span>
                         <div>
                          <p className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>{item.name}</p>
                          {item.variant && <span className="text-[10px] text-gray-400 font-medium">({item.variant})</span>}
                         </div>
                      </div>
                      <span className={`text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>₹{item.total_price}</span>
                    </div>
                  ))}
                </div>

                {/* Footer section */}
                <div className={`p-4 flex justify-between items-center ${isDark ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      (order.paymentStatus ?? "").toLowerCase() === 'paid' ? 'text-green-500' : 'text-rose-500'
                    }`}>
                      {order.paymentStatus ?? "UNPAID"}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total:</span>
                    <span className="text-lg font-black text-[#3FA90C]">₹{order.netAmount}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* FLOATING ACTION BUTTON */}
      <AnimatePresence>
        {hasUnpaidOrders && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed lg:bottom-5 bottom-[70px] left-0 right-0 z-50 px-4"
          >
            <div className={`max-w-4xl mx-auto p-3 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border flex items-center justify-between transition-all ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="pl-2">
                <p className={`text-[12px] font-black  tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>Sub Total</p>
                <p className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>₹{grandTotal}</p>
              </div>
              <button 
                onClick={handleViewBill}
                disabled={isPaying}
                className="bg-[#3FA90C] hover:bg-[#358d0a] text-white px-5 py-2 rounded-2xl font-black text-sm shadow-xl shadow-green-500/30 active:scale-95 transition-all disabled:opacity-70"
              >
                {isPaying ? "PROCESSING..." : "VIEW FINAL BILL"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSessionUnlocked && (
        <div className="fixed top-20 right-0 p-1 bg-green-500/20 rounded-full backdrop-blur-md">
          <RiVolumeUpFill size={8} className="text-green-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;