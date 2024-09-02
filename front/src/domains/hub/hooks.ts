import { useQuery } from "@tanstack/react-query";
import { getClients, getMessages, getRooms } from "./fetch";
import { useMe } from "../user";
import { Message } from "./types";
import { useMemo } from "react";

export const useRooms = () =>
  useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

export const useClients = (roomID: string) =>
  useQuery({
    queryKey: ["clients", roomID],
    queryFn: () => getClients(roomID),

    enabled: !!roomID,
  });

export const useMessages = (roomID: string) => {
  const { data: me } = useMe();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages", roomID],
    queryFn: () => getMessages(roomID),

    enabled: !!roomID,
  });

  const messages = useMemo(
    () =>
      data?.map((message) =>
        message.email === me?.email
          ? ({ ...message, type: "self" } as Message)
          : ({ ...message, type: "recv" } as Message),
      ),

    [data],
  );
  return { messages, isLoading, isError };
};
