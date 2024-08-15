import fetcher from "../fetcher";
import { Client, CreateRoomRequest, Message, Room } from "./types";

export const getRooms = (): Promise<Room[]> =>
  fetcher("/ws/getRooms", {
    method: "GET",
  });

export const createRoom = (params: CreateRoomRequest): Promise<Room> =>
  fetcher("/ws/createRoom", {
    method: "POST",
    body: JSON.stringify(params),
  });

export const getClients = (roomID: string): Promise<Client[]> =>
  fetcher(`/ws/getClients/${roomID}`, {
    method: "GET",
  });

export const getMessages = (roomID: string): Promise<Message[]> =>
  fetcher(`/ws/getMessages/${roomID}`, {
    method: "GET",
  });
