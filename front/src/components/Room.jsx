import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useWebsocket from "../hooks/useWebsocket";
import ChatBody from "./ChatBody";
import { useParams } from "react-router-dom";
import fetcher from "../domains/fetcher";

export default function Room() {
  const { roomId: roomID } = useParams();
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const { conn } = useWebsocket(roomID);
  const { auth: user } = useAuth();

  useEffect(() => {
    async function getUsers() {
      try {
        const res = await fetcher(`/ws/getClients/${roomID}`, {
          method: "GET",
        });

        if (res) {
          setUsers(res);
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

      if (m.content === "A new user has joined the room") {
        setUsers([...users, { email: m.email }]);
      }

      if (m.content === "user left the chat") {
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
      <div className="flex w-full flex-col">
        <div className="mb-14 p-4 md:mx-6">
          <ChatBody data={messages} />
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
