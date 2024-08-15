export type Room = {
  id: string;
  name: string;
};

export type CreateRoomRequest = {
  name: string;
};

export type Client = {
  id: string;
  email: string;
};

export type Message = {
  content: string;
  roomId: string;
  email: string;
  type?: "recv" | "self";
};
