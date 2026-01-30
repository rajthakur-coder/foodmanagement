// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";
// import nofound from "../../../assets/Images/nofound.png";
// import { ToasterUtils } from "../../../components/ui/toast";
// import type { RootState, AppDispatch } from "../../../components/app/store";
// import {
//   updateQuantity,
//   removeFromOrders,
//   clearOrders,
//   savePlacedOrder,
// } from "../../../features/orders/ordersSlice";
// import Icon from "../../../components/ui/Icon";
// import { useCreateOrderMutation } from "../../../features/createorder/ordersApi";
// import Skeleton from "../../../components/Common/Skeleton";

// interface OrderItem {
//   id: string;
//   variantId: number;
//   name: string;
//   price: number;
//   quantity: number;
//   portion: "full" | "half";
//   image?: string;
//   addons?: any[];
//   options?: any[];
// }

// const OrderPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const orders = useSelector((state: RootState) => state.orders.items as OrderItem[]);
//   const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

//   const [orderNote, setOrderNote] = useState("");
//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [noteModalCanceled, setNoteModalCanceled] = useState(false); // ✅ new flag
//   const [createOrder, { isLoading }] = useCreateOrderMutation();

//   /* ================= QUANTITY ================= */
//   const handleQuantityChange = (variantId: number, delta: number) => {
//     const item = orders.find((o) => o.variantId === variantId);
//     if (!item) return;
//     const newQty = Math.max(1, item.quantity + delta);
//     dispatch(
//       updateQuantity({
//         variantId,
//         quantity: newQty,
//       })
//     );
//   };

//   /* ================= REMOVE / CLEAR ================= */
//   const handleRemove = (variantId: number) => {
//     dispatch(removeFromOrders({ variantId }));
//   };

//   const handleClearAll = () => dispatch(clearOrders());

//   /* ================= TOTAL ================= */
//   const totalAmount = orders.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   /* ================= PLACE ORDER ================= */
//   const handlePlaceOrderClick = () => {
//     const token = Cookies.get("customertoken");
//     if (!token) {
//       sessionStorage.setItem("post_login_redirect", location.pathname);
//       navigate("/auth/customer/login", { replace: true });
//       return;
//     }

//     // ✅ If user canceled the note modal before, place order directly
//     if (noteModalCanceled) {
//       handleConfirmOrder();
//     } else {
//       setIsNoteModalOpen(true);
//     }
//   };

//   const handleConfirmOrder = async () => {
//     if (orders.length === 0) return;

//     const restaurantId = sessionStorage.getItem("restaurant_id");
//     const tableId = sessionStorage.getItem("table_id");

//     if (!restaurantId) {
//       alert("Invalid session. Please scan QR again.");
//       return;
//     }

//     try {
//       const response = await createOrder({
//         restaurant_id: Number(restaurantId),
//         table_id: Number(tableId),
//         delivery_type: "dine_in",
//         note: orderNote,
//         items: orders.map((item) => ({
//           food_item_id: item.id,
//           variant_id: item.variantId,
//           quantity: item.quantity,
//           addons: item.addons || [],
//           options: item.options || [],
//         })),
//         tips_amount: 0,
//         discount_amount: 0,
//       }).unwrap();

//       dispatch(
//         savePlacedOrder({
//           items: orders,
//           tableNumber: tableId,
//           orderNo: response.data.order_no,
//           createdAt: new Date().toISOString(),
//         })
//       );

//       dispatch(clearOrders());
//       setOrderNote("");  
//       setIsNoteModalOpen(false);
//       setNoteModalCanceled(false); // reset flag after placing order
//       ToasterUtils.success("Order placed successfully");
//       navigate("/myOrder");
//     } catch (err) {
//       console.error(err);
//       ToasterUtils.error("Failed to place order");
//     }
//   };

//   /* ================= UI ================= */
//   if (!orders.length && isLoading) {
//     return (
//       <div className="min-h-screen p-4">
//         <Skeleton type="card" rows={3} cardPerRow={1} cardHeight={120} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-full p-4 bg-surface-card">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-bold dark:text-white">Cart</h2>
//         {orders.length > 0 && (
//           <button
//             onClick={handleClearAll}
//             className="px-3 py-1 text-sm font-semibold text-red-500 border border-red-500 rounded-lg"
//           >
//             Clear All
//           </button>
//         )}
//       </div>

//       <div className="lg:flex lg:gap-4">
//         {/* LEFT - ITEMS */}
//         <div className="space-y-4 lg:flex-1">
//           {orders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center mt-20">
//               <img
//                 src={nofound}
//                 alt="No items found"
//                 className="lg:w-1/4 w-60 mb-4"
//               />
//             </div>
//           ) : (
//             orders.map((item) => (
//               <div
//                 key={item.variantId}
//                 className="flex bg-white shadow rounded-2xl dark:bg-gray-900"
//               >
//                 <img
//                   src={item.image || "/placeholder.png"}
//                   alt={item.name}
//                   className="object-cover lg:w-28 lg:h-28 w-24 h-24 rounded-lg"
//                 />
//                 <div className="flex-1 ml-4 lg:p-4 p-3">
//                   <div className="flex justify-between">
//                     <div>
//                       <h5 className="font-semibold dark:text-white">{item.name}</h5>
//                       <p className="text-sm text-gray-500">
//                         {item.portion === "full" ? "Full Portion" : "Half Portion"}
//                       </p>
//                     </div>
//                     <button onClick={() => handleRemove(item.variantId)}>
//                       <Icon name="ri-delete-bin-line" className="text-red-500" />
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between mt-3">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handleQuantityChange(item.variantId, -1)}
//                         className="w-6 h-6 border rounded-full"
//                       >
//                         −
//                       </button>
//                       <span className="font-medium">{item.quantity}</span>
//                       <button
//                         onClick={() => handleQuantityChange(item.variantId, 1)}
//                         className="w-6 h-6 border rounded-full"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <p className="font-bold text-green-500">₹{item.price * item.quantity}</p>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* RIGHT - SUMMARY */}
//         {orders.length > 0 && (
//           <div className="hidden md:block md:w-1/3">
//             <div className="sticky p-6 bg-white shadow top-6 rounded-2xl dark:bg-gray-900">
//               <h4 className="mb-4 font-bold dark:text-white">Order Summary</h4>

//               {orders.map((item) => (
//                 <div
//                   key={item.variantId}
//                   className="flex justify-between mb-2 text-sm"
//                 >
//                   <span>
//                     {item.name} ({item.portion}) × {item.quantity}
//                   </span>
//                   <span>₹{item.price * item.quantity}</span>
//                 </div>
//               ))}

//               <hr className="my-4" />

//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span>₹{totalAmount}</span>
//               </div>

//               <button
//                 onClick={handlePlaceOrderClick} 
//                 disabled={isLoading}
//                 className="w-full py-3 mt-4 text-white rounded-xl bg-gradient-to-r from-orange-500 to-yellow-400"
//               >
//                 {isLoading ? "Placing..." : "Place Order"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* MOBILE FOOTER */}
//       {orders.length > 0 && (
//         <div className="fixed left-0 w-full p-4 bg-surface-card shadow bottom-16 md:hidden">
//           <div className="flex justify-between items-center">
//             <span className="font-bold">Total: ₹{totalAmount}</span>
//             <button
//               onClick={handlePlaceOrderClick}
//               disabled={isLoading}
//               className="px-4 py-2 text-white bg-orange-500 rounded-lg"
//             >
//               {isLoading ? "Placing..." : "Place Order"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* NOTE MODAL */}
//       {isNoteModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-11/12 max-w-md">
//             <h4 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
//               Add a Note
//             </h4>
//             <textarea
//               value={orderNote}
//               onChange={(e) => setOrderNote(e.target.value)}
//               placeholder="Write something for kitchen..."
//               className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 mb-4"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => {
//                   setIsNoteModalOpen(false);
//                   setNoteModalCanceled(true); 
//                 }}
//                 className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 dark:text-gray-200"
//               >
//                 Skip
//               </button>
//               <button
//                 onClick={handleConfirmOrder}
//                 className="px-4 py-2 rounded-lg bg-orange-500 text-white"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderPage;












import React, { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import nofound from "../../../assets/Images/nofound.png";
import { ToasterUtils } from "../../../components/ui/toast";
import type { RootState, AppDispatch } from "../../../components/app/store";
import {
  updateQuantity,
  removeFromOrders,
  clearOrders,
  savePlacedOrder,
} from "../../../features/orders/ordersSlice";
import Icon from "../../../components/ui/Icon";
import { useCreateOrderMutation } from "../../../features/createorder/ordersApi";
import Skeleton from "../../../components/Common/Skeleton";
import { Button } from "../../../components/Common/Button";

interface OrderItem {
  id: string;
  variantId: number;
  name: string;
  price: number;
  quantity: number;
  portion: "full" | "half";
  image?: string;
  addons?: any[];
  options?: any[];
}

const OrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useSelector((state: RootState) => state.orders.items as OrderItem[], shallowEqual);
  
  const [orderNote, setOrderNote] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const totalAmount = useMemo(() => 
    orders.reduce((sum, item) => sum + item.price * item.quantity, 0), 
  [orders]);

  /* ================= QUANTITY / REMOVE ================= */
  const handleQuantityChange = useCallback((variantId: number, delta: number) => {
    const item = orders.find((o) => o.variantId === variantId);
    if (!item) return;
    dispatch(updateQuantity({ variantId, quantity: Math.max(1, item.quantity + delta) }));
  }, [dispatch, orders]);

  const handleRemove = (variantId: number) => dispatch(removeFromOrders({ variantId }));
  const handleClearAll = () => dispatch(clearOrders());

  /* ================= ORDER FLOW ================= */
  
  // 1. Jab user "Place Order" click kare
  const handlePlaceOrderClick = () => {
    const token = Cookies.get("customertoken");
    if (!token) {
      sessionStorage.setItem("post_login_redirect", location.pathname);
      navigate("/auth/customer/login", { replace: true });
      return;
    }
    // API call direct tabhi hogi jab hum confirm karenge
    handleConfirmOrder();
  };

  // 2. Main API Call Function
  const handleConfirmOrder = async () => {
    if (orders.length === 0 || isLoading) return;

    const restaurantId = sessionStorage.getItem("restaurant_id");
    const tableId = sessionStorage.getItem("table_id");

    if (!restaurantId) {
      ToasterUtils.error("Invalid session. Please scan QR again.");
      return;
    }

    try {
      const response = await createOrder({
        restaurant_id: Number(restaurantId),
        table_id: Number(tableId),
        delivery_type: "dine_in",
        note: orderNote, // Modal se jo note aaya wo yahan use hoga
        items: orders.map((item) => ({
          food_item_id: item.id,
          variant_id: item.variantId,
          quantity: item.quantity,
          addons: item.addons || [],
          options: item.options || [],
        })),
        tips_amount: 0,
        discount_amount: 0,
      }).unwrap();

      dispatch(savePlacedOrder({
        items: orders,
        tableNumber: tableId,
        orderNo: response.data.order_no,
        createdAt: new Date().toISOString(),
      }));

      dispatch(clearOrders());
      setOrderNote("");
      ToasterUtils.success("Order placed successfully");
      navigate("/myOrder");
    } catch (err) {
      ToasterUtils.error("Failed to place order. Try again.");
    }
  };

  if (!orders.length && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <img src={nofound} alt="No items" className="w-60 mb-4" />
        <h3 className="text-gray-500 font-medium">Your cart is empty</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 p-4 pt-20 bg-surface-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Cart</h2>
        {orders.length > 0 && (
          <Button text="Clear All" color="danger" variant="ghost" size="sm" width="auto" onClick={handleClearAll} />
        )}
      </div>

      <div className="lg:flex lg:gap-6">
        {/* ITEMS LIST */}
        <div className="space-y-4 lg:flex-1">
          {orders.map((item) => (
            <div key={item.variantId} className="flex bg-white shadow-sm rounded-2xl dark:bg-gray-900 overflow-hidden border dark:border-gray-800">
              <img src={item.image || "/placeholder.png"} alt={item.name} className="object-cover w-24 h-24 lg:w-32 lg:h-32" />
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="flex justify-between">
                  <h5 className="font-bold dark:text-white">{item.name}</h5>
                  <button onClick={() => handleRemove(item.variantId)} className="text-red-500">
                    <Icon name="ri-delete-bin-line" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQuantityChange(item.variantId, -1)} className="w-7 h-7 border rounded-full dark:text-white">−</button>
                    <span className="font-bold dark:text-white">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.variantId, 1)} className="w-7 h-7 border rounded-full dark:text-white">+</button>
                  </div>
                  <p className="font-bold text-green-600">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </div>
          ))}

          {/* ADD NOTE BUTTON (UI trigger) */}
          <div className="mt-4">
            <button 
              onClick={() => setIsNoteModalOpen(true)}
              className="text-danger text-sm font-semibold flex items-center gap-1"
            >
              <Icon name="ri-edit-line" /> 
              {orderNote ? "Edit Note" : "Add special instruction for kitchen"}
            </button>
            {orderNote && <p className="text-xs text-gray-500 mt-1 italic">"{orderNote}"</p>}
          </div>
        </div>

        {/* DESKTOP SUMMARY */}
        <div className="hidden md:block md:w-80">
          <div className="sticky top-6 p-6 bg-white border rounded-3xl dark:bg-gray-900 dark:border-gray-800">
            <h4 className="font-bold mb-4 dark:text-white">Summary</h4>
            <div className="flex justify-between text-xl font-black mb-6 dark:text-white">
              <span>Total</span>
              <span className="text-orange-500">₹{totalAmount}</span>
            </div>
            <Button
              text="Confirm Order"
              color="primary"
              size="md"
              width="100%"
              loading={isLoading}
              loaderType="bounce"
              onClick={handlePlaceOrderClick}
            />
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER - Fixed at the very bottom */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 md:hidden z-50 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Total Price</p>
            <p className="text-xl font-black dark:text-white">₹{totalAmount}</p>
          </div>
          <Button
            text="Place Order"
            color="primary"
            size="md"
            width="160px"
            loading={isLoading}
            loaderType="bounce"
            onClick={handlePlaceOrderClick}
          />
        </div>
      </div>

      {/* NOTE MODAL (No API Call here) */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h4 className="text-lg font-bold mb-2 dark:text-white">Special Requests</h4>
            <textarea
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full p-4 border rounded-2xl dark:bg-gray-700 dark:text-white outline-none mb-4 min-h-[100px]"
              placeholder="E.g. No onions, make it spicy..."
            />
            <div className="flex gap-3">
              <Button 
                text="Cancel" 
                variant="outline" 
                color="surface" 
                width="100%" 
                onClick={() => setIsNoteModalOpen(false)} 
              />
              <Button 
                text="Save Note" 
                color="primary" 
                width="100%" 
                onClick={() => setIsNoteModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;