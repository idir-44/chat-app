import { useEffect, useRef } from "react";

export default function useWebsocket(roomID) {
  const ws = useRef(null);

  const connectToRoom = (roomID) => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/v1/ws/joinRoom/${roomID}`
    );

    if (socket.OPEN) {
      ws.current = socket;
    }
  };

  const closeConnection = () => {
    if (ws.current !== null) {
      ws.current.close();
    }
  };

  useEffect(() => {
    connectToRoom(roomID);

    return () => {
      closeConnection();
    };
  }, []);

  return { conn: ws.current };
}
