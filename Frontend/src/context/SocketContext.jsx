import React, { createContext, useEffect, useState } from "react";

import io from "socket.io-client";

export const SocketDataContext = createContext();

const SocketContext = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);

      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");

      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketDataContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </SocketDataContext.Provider>
  );
};

export default SocketContext;
