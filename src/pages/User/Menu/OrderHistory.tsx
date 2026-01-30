import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import Cookies from "js-cookie";
import { RiVolumeUpFill } from "react-icons/ri";

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
import nofound from "../../../assets/Images/nofound2.png";

import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "./orderFilters";

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { showLoader, hideLoader } = useGlobalLoader();
  const isDark = theme === "dark";

  const { unlockAudio } = useCustomerSocket();
  const [initiateGroupPayment, { isLoading: isPaying }] = useInitiateGroupPaymentMutation();

  // --- Sound States ---
  const [hasEverEnabled, setHasEverEnabled] = useState(() => {
    return localStorage.getItem("customer_sound_pref") === "enabled";
  });
  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);

  // --- Filter States ---
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

  const { data, isLoading, isFetching } = useGetOrdersListQuery(payload);
  const orders = useSelector((state: RootState) => state.orders.orderHistory);

  // --- Calculate Grand Total (Sirf Unpaid Orders ka) ---
  const { grandTotal, hasUnpaidOrders } = useMemo(() => {
    const unpaid = orders.filter((o: any) => o.paymentStatus.toLowerCase() !== "paid");
    const total = unpaid.reduce((sum, o) => sum + Number(o.netAmount), 0);
    return { grandTotal: total, hasUnpaidOrders: unpaid.length > 0 };
  }, [orders]);

  // --- Handlers ---
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

  // --- Effects ---
  useEffect(() => {
    if (isFetching) showLoader();
    else hideLoader();
  }, [isFetching, showLoader, hideLoader]);

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

  // Silent Unlock Audio
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

  // 1. Loading State
  if (isLoading && !data) {
    return (
      <div className={`min-h-screen p-5 pt-24 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
        <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={150} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-40 pt-20 p-4 transition-colors duration-300 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
      
      {/* 🔊 Sound Banner */}
      {!hasEverEnabled && orders.length > 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-blue-700 text-white flex justify-between items-center shadow-lg">
          <div className="flex-1">
            <p className="text-sm font-bold">Turn on order sounds?</p>
            <p className="text-[10px] opacity-90">Get notified when food is ready!</p>
          </div>
          <button onClick={handleEnableSound} className="bg-white text-blue-700 px-4 py-2 rounded-xl text-xs font-black">
            ENABLE
          </button>
        </div>
      )}

      {/* Filter Section */}
      <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl border ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-100"}`}>
        <CustomDatePicker label="Start" value={startDate} onChange={(val) => setStartDate(val ? dayjs(val) : null)} />
        <CustomDatePicker label="End" value={endDate} onChange={(val) => setEndDate(val ? dayjs(val) : null)} />
        <CustomSelect label="Status" value={status} options={ORDER_STATUS_OPTIONS} onChange={(val) => setStatus(val.toString())} />
        <CustomSelect label="Payment" value={paymentStatus} options={PAYMENT_STATUS_OPTIONS} onChange={(val) => setPaymentStatus(val.toString())} />
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center mt-12">
          <img src={nofound} className="w-40 mx-auto opacity-40 grayscale" alt="No Orders" />
          <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No orders found</p>
          <button onClick={() => navigate("/menu")} className="mt-6 bg-[#3FA90C] text-white px-8 py-3 rounded-xl font-bold">Start Ordering</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.orderNo} className={`rounded-2xl p-4 border shadow-sm ${isDark ? "bg-[#1F2937] border-gray-700 text-gray-100" : "bg-white border-gray-100 text-gray-900"}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-[#3FA90C] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Table {order.tableNumber}</span>
                  <h3 className="font-black text-lg mt-1">Order #{order.serialNo}</h3>
                  <p className="text-[10px] opacity-60">{dayjs(order.createdAt).format("DD MMM YYYY | hh:mm A")}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status === "Pending" ? "Inactive" : "Active"} displayText={order.status} />
                  <p className={`text-[11px] mt-2 font-bold ${order.paymentStatus.toLowerCase() === 'paid' ? 'text-green-500' : 'text-rose-500'}`}>
                    {order.paymentStatus.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className={`rounded-xl p-3 mb-4 border ${isDark ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm mb-2 last:mb-0 font-bold">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-[10px] font-bold opacity-50">Total Amount</p>
                <p className="text-lg font-black">₹{order.netAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FIXED BOTTOM BAR (POORE TABLE KA TOTAL) */}
      {hasUnpaidOrders && (
        <div className="fixed bottom-20 left-4 right-4 z-50">
          <div className={`p-4 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border flex items-center justify-between transition-all ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200"}`}>
            <div>
              <p className={`text-[10px] font-bold uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>Unpaid Grand Total</p>
              <p className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>₹{grandTotal}</p>
            </div>
            <button 
              onClick={handleViewBill}
              disabled={isPaying}
              className="bg-[#3FA90C] hover:bg-[#358d0a] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 active:scale-95"
            >
              {isPaying ? "Wait..." : "VIEW FINAL BILL"}
            </button>
          </div>
        </div>
      )}

      {/* Floating Sound Icon */}
      {isSessionUnlocked && (
        <div className="fixed top-16 right-3 p-2 bg-green-500/10 rounded-full">
          <RiVolumeUpFill size={14} className="text-green-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;















// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import dayjs, { Dayjs } from "dayjs";
// import { RiVolumeUpFill, RiVolumeMuteFill } from "react-icons/ri";

// import { useGetOrdersListQuery } from "../../../features/createorder/ordersApi";
// import { setOrderHistory } from "../../../features/orders/ordersSlice";
// import { useCustomerSocket } from "../../../services/useCustomerSocket";
// import { useTheme } from "../../../components/context/ThemeContext";
// import { useGlobalLoader } from "../../../components/ui/GlobalLoader"; 

// import type { RootState } from "../../../components/app/store";
// import StatusBadge from "../../../components/Common/StatusBadge";
// import Skeleton from "../../../components/Common/Skeleton";
// import CustomDatePicker from "../../../components/Common/DateAndTime";
// import CustomSelect from "../../../components/Common/CustomSelect";
// import nofound from "../../../assets/Images/nofound2.png";

// import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "./orderFilters";

// const OrderHistory: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { theme } = useTheme();
//   const { showLoader, hideLoader } = useGlobalLoader();
//   const isDark = theme === "dark";

//   // Hook se unlock function lein
//   const { unlockAudio } = useCustomerSocket();

//   // 1. Check karein ki kya user ne life mein kabhi enable kiya tha
//   const [hasEverEnabled, setHasEverEnabled] = useState(() => {
//     return localStorage.getItem("customer_sound_pref") === "enabled";
//   });

//   const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);

//   // Sound Enable Handler
//   const handleEnableSound = useCallback(() => {
//     unlockAudio();
//     setHasEverEnabled(true);
//     setIsSessionUnlocked(true);
//     localStorage.setItem("customer_sound_pref", "enabled");
//   }, [unlockAudio]);

//   // 2. SILENT UNLOCK: Agar pehle enable kiya tha, toh page par kahin bhi click hote hi unlock kar do
//   useEffect(() => {
//     if (hasEverEnabled && !isSessionUnlocked) {
//       const silentUnlock = () => {
//         unlockAudio();
//         setIsSessionUnlocked(true);
//         console.log("🔊 Silent Audio Unlock Successful");
//         window.removeEventListener("click", silentUnlock);
//         window.removeEventListener("touchstart", silentUnlock);
//       };
//       window.addEventListener("click", silentUnlock);
//       window.addEventListener("touchstart", silentUnlock);
//       return () => {
//         window.removeEventListener("click", silentUnlock);
//         window.removeEventListener("touchstart", silentUnlock);
//       };
//     }
//   }, [hasEverEnabled, isSessionUnlocked, unlockAudio]);

//   // --- API & Filter Logic (Same as before) ---
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

//   useEffect(() => {
//     if (isFetching) showLoader();
//     else hideLoader();
//     return () => hideLoader();
//   }, [isFetching, showLoader, hideLoader]);

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
//         customerNote: o.order_details?.customer_note || "",
//         deliveryType: o.order_details?.delivery_type || "dine_in",
//         items: o.items || [],
//       }));
//       dispatch(setOrderHistory(mapped));
//     }
//   }, [data, dispatch]);

//   const orders = useSelector((state: RootState) => state.orders.orderHistory);

//   if (isLoading && !data) {
//     return (
//       <div className={`min-h-screen p-5 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
//         <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={180} />
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen pb-20 pt-20 p-4 transition-colors duration-300 ${isDark ? "bg-[#111827]" : "bg-gray-50"}`}>
      
//       {/* 🔊 BANNER: Sirf un users ko dikhega jinhone kabhi enable nahi kiya */}
//       {!hasEverEnabled && orders && orders.length > 0 && (
//         <div className="mb-4 p-4 rounded-2xl bg-blue-700 text-white flex justify-between items-center shadow-lg animate-bounce-subtle">
//           <div>
//             <p className="text-sm font-bold">Turn on order sounds?</p>
//             <p className="text-[10px] opacity-90">Get notified when your food is ready!</p>
//           </div>
//           <button 
//             onClick={handleEnableSound}
//             className="bg-white text-[#3FA90C] px-4 py-2 rounded-xl text-xs font-black shadow-sm"
//           >
//             ENABLE
//           </button>
//         </div>
//       )}

//       {/* FILTER SECTION */}
//       <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl border ${isDark ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-100"}`}>
//         <CustomDatePicker label="Start" value={startDate} onChange={(val) => setStartDate(val ? dayjs(val) : null)} />
//         <CustomDatePicker label="End" value={endDate} onChange={(val) => setEndDate(val ? dayjs(val) : null)} />
//         <CustomSelect label="Status" value={status} options={ORDER_STATUS_OPTIONS} onChange={(val) => setStatus(val.toString())} />
//         <CustomSelect label="Payment" value={paymentStatus} options={PAYMENT_STATUS_OPTIONS} onChange={(val) => setPaymentStatus(val.toString())} />
//       </div>

//       {/* ORDERS LIST */}
//       {!orders || orders.length === 0 ? (
//         <div className="text-center mt-12">
//           <img src={nofound} className="w-40 mx-auto opacity-40 grayscale" alt="No Orders" />
//           <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>No orders found</p>
//           <button onClick={() => navigate("/menu")} className="mt-6 bg-[#3FA90C] text-white px-8 py-3 rounded-xl font-bold shadow-lg">Start Ordering</button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order: any) => (
//             <div key={order.orderNo} className={`rounded-2xl p-4 border shadow-sm ${isDark ? "bg-[#1F2937] border-gray-700 text-gray-100" : "bg-white border-gray-100 text-gray-900"}`}>
//               {/* Order content stays the same as your previous design */}
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <span className="bg-[#3FA90C] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">Table {order.tableNumber}</span>
//                   <h3 className="font-black text-lg mt-1">Order #{order.serialNo}</h3>
//                   <p className="text-[10px] opacity-60">{dayjs(order.createdAt).format("DD MMM YYYY | hh:mm A")}</p>
//                 </div>
//                 <div className="text-right">
//                   <StatusBadge status={order.status === "Pending" ? "Inactive" : "Active"} displayText={order.status} />
//                   <p className={`text-[11px] mt-2 font-bold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-rose-500'}`}>{order.paymentStatus.toUpperCase()}</p>
//                 </div>
//               </div>
              
//               <div className={`rounded-xl p-3 mb-4 border ${isDark ? "bg-[#111827] border-gray-800" : "bg-gray-50 border-gray-100"}`}>
//                 {order.items.map((item: any, idx: number) => (
//                   <div key={idx} className="flex justify-between text-sm mb-2 last:mb-0 font-bold">
//                     <span>{item.quantity}x {item.name}</span>
//                     <span>₹{item.total_price}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className={`flex justify-between items-center pt-4 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}>
//                 <p className="text-[10px] font-bold opacity-50">Total Bill Amount</p>
//                 <p className={`text-2xl font-black ${isDark ? "text-green-400" : "text-green-700"}`}>₹{order.netAmount}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Floating Sound Icon (Session Active) */}
//       {isSessionUnlocked && (
//         <div className="fixed top-16 right-3 p-2  rounded-full ">
//           <RiVolumeUpFill size={8} className="animate-pulse" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;