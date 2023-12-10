import { createContext, useState } from "react";

const WebsocketContext = createContext({});

export const WebsocketProvider = ({ children }) => {
  const [conn, setConn] = useState(null);

  return (
    <WebsocketContext.Provider value={{ conn, setConn }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketContext;
