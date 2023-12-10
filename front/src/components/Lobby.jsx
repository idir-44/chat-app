import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../hooks/useAuth";
import useWebsocket from "../hooks/useWebsocket";

export default function Lobby() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const { auth } = useAuth();
  const { setConn } = useWebsocket();

  const navigate = useNavigate();

  const getRooms = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/ws/getRooms`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setRooms(data);
    }
  };

  const createRoomHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/ws/createRoom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: uuidv4(), name: roomName }),
        }
      );

      if (response.ok) {
        setRoomName("");
        getRooms();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = (roomID) => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/ws/joinRoom/${roomID}?userId=${
        auth.userID
      }&email=${auth.email}`
    );

    if (ws.OPEN) {
      setConn(ws);
      navigate("/room");
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <>
      <div className="my-8 px-4 mx-auto w-full h-full">
        <div className="flex justify-center mt-3 p-5 gap-4">
          <input
            type="text"
            className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue"
            onChange={(e) => setRoomName(e.target.value)}
            value={roomName}
          />
          <button
            className="text-white bg-blue-500 rounded-md p-2 "
            onClick={createRoomHandler}
          >
            create room
          </button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="border border-blue-500 p-4 flex items-center rounded-md w-full"
              >
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-blue-500 font-bold text-lg">
                    {room.name}
                  </div>
                </div>
                <div className="">
                  <button
                    className="px-4 text-white bg-blue-500 rounded-md"
                    onClick={() => joinRoom(room.id)}
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
