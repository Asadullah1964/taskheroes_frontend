"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { io, Socket } from "socket.io-client";

import { getCurrentUser } from "@/services/auth.service";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({
  children,
}: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_SOCKET_URL!,
      {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    socketInstance.on("connect", async () => {
      console.log(
        "✅ Socket Connected:",
        socketInstance.id
      );

      try {
        const user = await getCurrentUser();

        // User is not logged in
        if (!user) {
          return;
        }

        socketInstance.emit("register", user._id);

        console.log(
          "✅ User Registered:",
          user._id
        );
      } catch (error) {
        console.error(
          "Socket register failed:",
          error
        );
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error(
        "Socket Connection Error:",
        error.message
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};