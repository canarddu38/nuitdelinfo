import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(`https://${import.meta.env.VITE_IPBACKEND}:5000`, { withCredentials: true });
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  return socket;
}