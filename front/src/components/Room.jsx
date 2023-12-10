import React, { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useWebsocket from "../hooks/useWebsocket";
import ChatBody from "./ChatBody";

export default function Room() {
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const { conn } = useWebsocket();
  const { auth: user } = useAuth();

  useEffect(() => {
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    const roomID = conn.url.split("/")[5];

    async function getUsers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/ws/getClients/${roomID}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const users = await response.json();

        if (response.ok) {
          console.log(users);
          setUsers(users);
        } else {
          console.error("coudn't get users");
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    getUsers();
  }, []);

  useEffect(() => {
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    conn.onmessage = (message) => {
      const m = JSON.parse(message.data);

      if (m.content == "A new user has joined the room") {
        setUsers([...users, { email: m.email }]);
      }

      if (m.content == "user left the chat") {
        const filteredUsers = users.filter((user) => user.email != m.email);
        setUsers([...filteredUsers]);
        setMessages([...messages, m]);
      }

      user?.email === m.email ? (m.type = "self") : (m.type = "recv");
      setMessages([...messages, m]);
    };
  }, [typedMessage, messages, conn, users]);

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
                value={typedMessage}
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
