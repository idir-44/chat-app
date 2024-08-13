import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import fetcher from "../domains/fetcher";

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  const getRooms = async () => {
    const res = await fetcher("/ws/getRooms", {
      method: "GET",
    });
    if (res) {
      setRooms(res);
    }
  };

  const createRoomHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetcher("/ws/createRoom", {
        method: "POST",
        body: JSON.stringify({ id: uuidv4(), name: roomName }),
      });

      if (res) {
        setRoomName("");
        getRooms();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

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
            {rooms.map((room, index) => (
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
