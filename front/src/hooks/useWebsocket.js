import { useContext } from "react";
import WebsocketContext from "../context/websocketProvider";

export default function useWebsocket() {
  return useContext(WebsocketContext);
}
