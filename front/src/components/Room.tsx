import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useWebsocket from "../hooks/useWebsocket";
import ChatBody from "./ChatBody";
import { useParams } from "react-router-dom";
import { Message, useMessages } from "../domains/hub";

export default function Room() {
  const { roomId: roomID } = useParams();
  const [typedMessage, setTypedMessage] = useState("");
  const { messages: savedMessages, isLoading } = useMessages(roomID ?? "");

  const [messages, setMessages] = useState<Message[]>([]);

  const { conn } = useWebsocket(roomID || "");
  const { auth: user } = useAuth();

  useEffect(() => {
    setMessages(savedMessages ?? []);
  }, [savedMessages]);

  useEffect(() => {
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    conn.onmessage = (message) => {
      const m = JSON.parse(message.data) as Message;

      user?.email === m.email ? (m.type = "self") : (m.type = "recv");
      setMessages([...messages, m]);
    };
  }, [typedMessage, messages, conn]);

  const sendMessage = () => {
    if (typedMessage == "") return;
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    conn.send(typedMessage);
    setTypedMessage("");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="mb-14 p-4 md:mx-6">
          <ChatBody messages={messages} />
        </div>
        <div className="fixed bottom-0 mt-4 w-full">
          <div className="bg-grey flex rounded-md px-4 py-2 md:mx-4 md:flex-row">
            <div className="border-blue mr-4 flex w-full rounded-md border">
              <input
                placeholder="type your message here"
                className="h-10 w-full rounded-md p-2 focus:outline-none"
                onChange={(e) => setTypedMessage(e.target.value)}
                value={typedMessage}
              />
            </div>
            <div className="flex items-center">
              <button className="rounded-md bg-blue-500 p-2 text-white" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
