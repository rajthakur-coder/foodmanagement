import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "./socket";
import { updateOrderStatusInHistory } from "../features/orders/ordersSlice";
import { addNotification } from "../features/notification/notificationSlice";

export const useCustomerSocket = () => {
  const dispatch = useDispatch();

  // 🔊 Audio refs (important)
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});
  const audioUnlockedRef = useRef(false);

  const soundMap: Record<string, string> = {
    confirmed: "/sounds/pendng.wav",
    preparing: "/sounds/cooking.wav",
    readyforpickup: "/sounds/served.wav",
    completed: "/sounds/served.wav",
    default: "/sounds/notification.wav",
  };

  // 🔓 Unlock audio on first user interaction (mobile fix)
  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return;

      Object.values(soundMap).forEach((path) => {
        const audio = new Audio(path);
        audio.muted = true;
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        });
        audioMapRef.current[path] = audio;
      });

      audioUnlockedRef.current = true;
      console.log("🔓 Audio unlocked for mobile");
    };

    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };
  }, []);

  const playStatusSound = (status: string) => {
    if (!audioUnlockedRef.current) return; // 🚫 mobile safety

    const cleanStatus = status ? status.toLowerCase() : "default";
    const soundPath = soundMap[cleanStatus] || soundMap.default;

    const audio = audioMapRef.current[soundPath];
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      console.warn("Sound play blocked");
    });
  };

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ Socket Connected");
      socket.emit("joinRoom", { type: "Customer" });
    });

    socket.on("orderStatusUpdated", (payload) => {
      console.log("📦 Order Update Received:", payload);

      if (payload?.to_status) {
        playStatusSound(payload.to_status);
      }

      const indianTime = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      dispatch(
        addNotification({
          id: Date.now().toString(),
          title: "Order Update",
          message: `Order #${payload.order_no.slice(-5)} is now ${payload.to_status}`,
          status: payload.to_status,
          time: indianTime,
          isRead: false,
        })
      );

      dispatch(
        updateOrderStatusInHistory({
          order_no: payload.order_no,
          to_status: payload.to_status,
        })
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [dispatch]);
};








// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { connectSocket } from "./socket";
// import { updateOrderStatusInHistory } from "../features/orders/ordersSlice";
// import { addNotification } from "../features/notification/notificationSlice"; 

// export const useCustomerSocket = () => {
//   const dispatch = useDispatch();

//   const soundMap: Record<string, string> = {
//     confirmed: "/sounds/pendng.wav", 
//     preparing: "/sounds/cooking.wav", 
//     readyforpickup: "/sounds/served.wav",
//     completed: "/sounds/served.wav", // Status added
//     default: "/sounds/notification.wav"
//   };

//   const playStatusSound = (status: string) => {
//     const cleanStatus = status ? status.toLowerCase() : "default";
//     const soundPath = soundMap[cleanStatus] || soundMap.default;
    
//     const audio = new Audio(soundPath);
//     audio.play().catch((err) => {
//       console.warn("Autoplay blocked: Click on the page once to enable audio alerts.", err);
//     });
//   };

//   useEffect(() => {
//     const socket = connectSocket();
//     if (!socket) return;

//     socket.on("connect", () => {
//       console.log("✅ Socket Connected");
//       socket.emit("joinRoom", { type: "Customer" });
//     });

//     socket.on("orderStatusUpdated", (payload) => {
//       console.log("📦 Order Update Received:", payload);

//       if (payload?.to_status) {
//         playStatusSound(payload.to_status);
//       }

//       // --- Indian Date & Time Format (12-hour AM/PM) ---
//       const indianTime = new Date().toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });

//       // --- Add Notification to Redux ---
//       const notificationData = {
//         id: Date.now().toString(),
//         title: "Order Update",
//         message: `Order #${payload.order_no.slice(-5)} is now ${payload.to_status}`,
//         status: payload.to_status,
//         time: indianTime,
//         isRead: false
//       };
      
//       dispatch(addNotification(notificationData));

//       // --- Update Global Order History ---
//       dispatch(
//         updateOrderStatusInHistory({
//           order_no: payload.order_no,
//           to_status: payload.to_status,
//         })
//       );
//     });

//     return () => {
//       socket.off("orderStatusUpdated");
//     };
//   }, [dispatch]);
// };