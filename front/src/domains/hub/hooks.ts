import { useQuery } from "@tanstack/react-query";
import { getClients, getRooms } from "./fetch";

export const useRooms = () =>
  useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

export const useClients = (roomID: string) =>
  useQuery({
    queryKey: [`clients - ${roomID}`],
    queryFn: () => getClients(roomID),

    enabled: !!roomID,
  });
