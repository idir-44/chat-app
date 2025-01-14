import { Message } from "../domains/hub";

export default function ChatBody({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages?.map((message, index) => {
        if (message.type === "self") {
          return (
            <div
              className="mt-2 flex w-full flex-col justify-end text-right"
              key={index}
            >
              <div className="text-sm">{message?.email}</div>
              <div>
                <div className="mt-1 inline-block rounded-md bg-primary px-4 py-1 text-white">
                  {message?.content}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="mt-2" key={index}>
              <div className="text-sm">{message?.email}</div>
              <div>
                <div className="text-dark-secondary mt-1 inline-block rounded-md bg-zinc-300 px-4 py-1">
                  {message?.content}
                </div>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
