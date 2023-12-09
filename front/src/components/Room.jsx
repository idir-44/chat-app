import React, { useContext, useState } from "react";
import useWebsocket from "../hooks/useWebsocket";
import ChatBody from "./ChatBody";

export default function Room() {
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { conn } = useWebsocket();

  const sendMessage = () => {
    if (typedMessage == "") return;
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    conn.send(typedMessage);
    setTypedMessage("");
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="p-4 md:mx-6 mb-14">
          <ChatBody data={messages} />
        </div>
        <div className="fixed bottom-0 mt-4 w-full">
          <div className="flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md">
            <div className="flex w-full mr-4 rounded-md border border-blue">
              <input
                placeholder="type your message here"
                className="w-full h-10 p-2 rounded-md focus:outline-none"
                onChange={(e) => setTypedMessage(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <button
                className="p-2 rounded-md bg-blue-500 text-white"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
