import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    const token = Cookies.get("token");

    socket = io(import.meta.env.VITE_SOCKET_URLS, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });
  }

  return socket;
};

// ✅ ADD THIS
export const getSocket = () => socket;
