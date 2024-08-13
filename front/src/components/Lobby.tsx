import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createRoom, useRooms } from "../domains/hub";
import { useMutation } from "@tanstack/react-query";

export default function Lobby() {
  const [roomName, setRoomName] = useState("");
  const { data: rooms, isPending, refetch } = useRooms();

  const navigate = useNavigate();

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess() {
      setRoomName("");
      refetch();
    },
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  const createRoomHandler = async () => {
    try {
      await createRoomMutation.mutateAsync({ id: uuidv4(), name: roomName });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mx-auto my-8 h-full w-full px-4">
        <div className="mt-3 flex justify-center gap-4 p-5">
          <input
            type="text"
            className="border-grey focus:border-blue rounded-md border p-2 focus:outline-none"
            onChange={(e) => setRoomName(e.target.value)}
            value={roomName}
          />
          <button className="rounded-md bg-blue-500 p-2 text-white" onClick={createRoomHandler}>
            create room
          </button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            {rooms?.map((room, index) => (
              <div key={index} className="flex w-full items-center rounded-md border border-blue-500 p-4">
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-lg font-bold text-blue-500">{room.name}</div>
                </div>
                <div className="">
                  <button
                    className="rounded-md bg-blue-500 px-4 text-white"
                    onClick={() => navigate(`/room/${room.id}`)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
