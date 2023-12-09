import React from "react";

export default function ChatBody({ data }) {
  return (
    <>
      {data.map((message, index) => {
        if (message.type == "recv") {
          return (
            <div
              className="flex flex-col mt-2 w-full text-right justify-end"
              key={index}
            >
              <div className="text-sm">{message?.email}</div>
              <div>
                <div className="bg-blue-500 text-white px-4 py-1 rounded-md inline-block mt-1">
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
                <div className="bg-slate-300 text-dark-secondary px-4 py-1 rounded-md inline-block mt-1">
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
