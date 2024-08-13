import fetcher from "../fetcher";
import { LoginRequest, SignupRequest, User } from "./types";

export const login = (params: LoginRequest): Promise<User> =>
  fetcher("/login", {
    method: "POST",
    body: JSON.stringify(params),
  });

export const signup = (params: SignupRequest): Promise<User> =>
  fetcher("/users", {
    method: "POST",
    body: JSON.stringify(params),
  });

export const getCurrentUser = (): Promise<User> =>
  fetcher("/me", {
    method: "GET",
  });
