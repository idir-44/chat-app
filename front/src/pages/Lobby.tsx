import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, useRooms } from "../domains/hub";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      await createRoomMutation.mutateAsync({ name: roomName });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mx-auto my-8 h-full w-full px-4">
        <div className="mt-3 flex items-center justify-center gap-4 p-5">
          <Input type="text" className="max-w-sm" onChange={(e) => setRoomName(e.target.value)} value={roomName} />
          <Button disabled={createRoomMutation.isPending} onClick={createRoomHandler}>
            create room
          </Button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            {rooms?.map((room, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle className="text-accent-foreground">{room.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => navigate(`/room/${room.id}`)}>
                    join
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
