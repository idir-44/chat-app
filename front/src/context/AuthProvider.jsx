import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, authenticated, setAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
