import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

type AuthContextType = {
  setAuth: Dispatch<SetStateAction<User | undefined>>;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
  authenticated: boolean;
  auth?: User;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export type User = {
  userID: string;
  email: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<User>();
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ auth, setAuth, authenticated, setAuthenticated }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
