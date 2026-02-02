import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../components/Common/Button";
import { RiFileList3Line, RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useTheme } from "../../../components/context/ThemeContext"; // Theme hook add kiya
import { ToasterUtils } from "../../../components/ui/toast";

const ViewBillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Theme access
  const isDark = theme === "dark";

  // OrderHistory se bheja gaya data nikalna
  const billData = location.state?.billData;

  // Agar direct koi is page par aaye bina data ke, toh wapas bhej do
  if (!billData) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? "bg-[#111827]" : "bg-[#F8F9FA]"}`}>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-4`}>No bill data found. Please Order.</p>
<Button text="Go Back" onClick={() => navigate("/menu")} />      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-32 ${isDark ? "bg-[#111827]" : "bg-[#F8F9FA]"}`}>
      
      {/* Header Area */}
      <div className={`px-5 pt-16 pb-8 rounded-b-[3rem] shadow-sm transition-colors ${isDark ? "bg-[#1F2937]" : "bg-white"}`}>
        <h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Summary</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] px-2 py-1 rounded-md font-mono ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            ID: {billData.group_txn_id}
          </span>
        </div>

        <div className="mt-8 flex justify-between items-end">
          <div>
            <p className={`${isDark ? "text-gray-500" : "text-gray-400"} text-xs font-bold uppercase tracking-widest`}>Total Payable</p>
            <p className={`text-4xl font-black mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
              ₹{billData.total_amount}
            </p>
          </div>
          <div className={`${isDark ? "bg-[#3FA90C]/20" : "bg-[#3FA90C]/10"} p-3 rounded-2xl`}>
            <RiFileList3Line size={24} className="text-[#3FA90C]" />
          </div>
        </div>
      </div>

      {/* Orders List from API Response */}
      <div className="p-5 mt-4">
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Included Orders ({billData.payments.length})
        </h3>
        
        <div className="space-y-3">
          {billData.payments.map((payment: any) => (
            <div 
              key={payment.id} 
              className={`p-5 rounded-[1.5rem] shadow-sm flex justify-between items-center border active:scale-[0.98] transition-all ${
                isDark 
                ? "bg-[#1F2937] border-gray-700 shadow-none" 
                : "bg-white border-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${isDark ? "bg-gray-800 text-gray-500" : "bg-gray-50 text-gray-400"}`}>
                  #{payment.order_id}
                </div>
                <div>
                  <p className={`font-bold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>Order Details</p>
                  <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>TXN ID: {payment.id}</p>
                </div>
              </div>
              <p className={`font-black ${isDark ? "text-white" : "text-gray-900"}`}>₹{payment.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary calculation Box */}
      <div className="px-5 mt-6 pb-12">
        <div className={`p-6 rounded-[2rem] shadow-xl relative overflow-hidden ${isDark ? "bg-[#000000] border border-gray-800" : "bg-gray-900"}`}>
          <div className="relative z-10">
            <div className="flex justify-between text-sm opacity-70 mb-2 text-white">
              <span>Subtotal</span>
              <span>₹{billData.total_amount}</span>
            </div>
            <div className="flex justify-between text-sm opacity-70 mb-4 text-white">
              <span>Taxes & Charges</span>
              <span>₹0.00</span>
            </div>
            <div className="h-[1px] bg-white/10 w-full mb-4" />
            <div className="flex justify-between items-center text-white">
              <span className="font-bold">Grand Total</span>
              <span className="text-2xl font-black text-[#3FA90C]">₹{billData.total_amount}</span>
            </div>
          </div>
          {/* Background Decoration */}
          <div className="absolute -right-4 -bottom-4 opacity-10 text-white">
            <RiMoneyRupeeCircleFill size={100} />
          </div>
        </div>
      </div>

      {/* Footer Payment Button */}
      <div className={`fixed bottom-16 left-0 right-0 p-6 border-t rounded-t-[2.5rem] shadow-lg transition-colors ${
        isDark ? "bg-[#1F2937] border-gray-800" : "bg-white border-gray-100"
      }`}>
        <Button
          text="PROCEED TO PAY"
          width="100%"
          size="md"
          color="primary"
          onClick={() => ToasterUtils.info("Please proceed to the counter for Cash payment.")}
        />
      </div>
    </div>
  );
};

export default ViewBillPage;