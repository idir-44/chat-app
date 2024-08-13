import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import fetcher from "../domains/fetcher";

export default function PersistentLogin() {
  const [isLoading, setIsloading] = useState(true);
  const { setAuth, authenticated, setAuthenticated } = useAuth();

  const getCurrentUser = async () => {
    try {
      const res = await fetcher("/me", {
        method: "GET",
      });
      if (res) {
        const user = {
          userID: res.id,
          email: res.email,
        };
        setAuth(user);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    !authenticated ? getCurrentUser() : setIsloading(false);
  }, [authenticated]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
}
