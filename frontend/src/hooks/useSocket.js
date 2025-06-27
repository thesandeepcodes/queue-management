import { getCookie } from "@/lib/client/functions";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket(listeners = [], query = {}) {
  const socket = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const cookieName =
        process.env.NODE_ENV === "production"
          ? "__Secure-Token"
          : "_Secure-Token";

      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        auth: {
          token: getCookie(cookieName),
        },
        query,
      });

      socket.current.on("connected", (msg) => {
        listeners.forEach((listener) => {
          socket.current.on(listener.event, listener.listener);
        });
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [listeners, mounted]);

  return socket;
}
