import { FormEvent, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import useWebsocket from "../hooks/useWebsocket";
import ChatBody from "../components/ChatBody";
import { useParams } from "react-router-dom";
import { Message, useMessages } from "../domains/hub";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Room() {
  const { roomId: roomID } = useParams();
  const [typedMessage, setTypedMessage] = useState("");
  const { messages: savedMessages, isLoading } = useMessages(roomID ?? "");

  const [messages, setMessages] = useState<Message[]>([]);

  const bottomRef = useRef<null | HTMLDivElement>(null);

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

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typedMessage === "" || typedMessage.trim() === "") return;
    if (conn === null) {
      console.log("no connextion: ", conn);
      return;
    }

    conn.send(typedMessage.trim());
    setTypedMessage("");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="mx-2 pb-20 md:mx-6">
          <ChatBody messages={messages} />
        </div>
        <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 bg-secondary py-4">
          <div className="mx-auto w-[70%]">
            <form className="flex items-center gap-4" onSubmit={sendMessage}>
              <Input
                maxLength={255}
                placeholder="type your message here"
                onChange={(e) => setTypedMessage(e.target.value)}
                value={typedMessage}
              />
              <Button disabled={typedMessage === ""} type="submit">
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div ref={bottomRef} />
    </>
  );
}
