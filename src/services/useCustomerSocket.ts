import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "./socket";
import { updateOrderStatusInHistory } from "../features/orders/ordersSlice";
import { addNotification } from "../features/notification/notificationSlice";

export const useCustomerSocket = () => {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);

  // Single Sound Path
  const NOTIFICATION_SOUND = "/sounds/notification.wav";

  // Is function ko hum Component se call karwayenge user interaction ke liye
  const unlockAudio = () => {
    if (audioUnlockedRef.current) return;
    
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.muted = true;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      audioRef.current = audio;
      audioUnlockedRef.current = true;
    }).catch(err => console.error("Audio unlock failed", err));
  };

  const playNotificationSound = () => {
    if (!audioUnlockedRef.current || !audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((e) => console.warn("Playback blocked", e));
  };

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("joinRoom", { type: "Customer" });
    });

    socket.on("orderStatusUpdated", (payload) => {
      // Play sound for every status update
      playNotificationSound();

      const indianTime = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      dispatch(addNotification({
        id: Date.now().toString(),
        title: "Order Update",
        message: `Order #${payload.order_no.slice(-5)} is now ${payload.to_status}`,
        status: payload.to_status,
        time: indianTime,
        isRead: false,
      }));

      dispatch(updateOrderStatusInHistory({
        order_no: payload.order_no,
        to_status: payload.to_status,
      }));
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [dispatch]);

  return { unlockAudio, isAudioUnlocked: audioUnlockedRef };
};
