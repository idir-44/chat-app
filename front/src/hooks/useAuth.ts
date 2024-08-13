import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

export default function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("AuthContext unavailable");
  }

  return ctx;
}
