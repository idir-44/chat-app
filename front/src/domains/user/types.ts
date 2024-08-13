export type User = {
  userID: string;
  email: string;
};

export type SignupRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
