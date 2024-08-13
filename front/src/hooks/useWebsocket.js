import { useEffect, useRef } from "react";

export default function useWebsocket(roomID) {
  const ws = useRef(null);

  const connectToRoom = (roomID) => {
    try {
      const socket = new WebSocket(
        `${import.meta.env.VITE_WS_BASE_URL}/v1/ws/joinRoom/${roomID}`
      );

      if (socket.OPEN) {
        ws.current = socket;
      }
    } catch (error) {
      return error;
    }
  };

  const closeConnection = () => {
    if (ws.current !== null) {
      ws.current.close();
    }
  };

  useEffect(() => {
    const error = connectToRoom(roomID);
    if (error) {
      console.error(error);
    }
    return () => {
      closeConnection();
    };
  }, []);

  return { conn: ws.current };
}
