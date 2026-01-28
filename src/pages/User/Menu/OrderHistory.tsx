
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