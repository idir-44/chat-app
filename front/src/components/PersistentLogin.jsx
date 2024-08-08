import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PersistentLogin() {
  const [isLoading, setIsloading] = useState(true);
  const { setAuth, authenticated, setAuthenticated } = useAuth();

  const getCurrentUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (response.ok) {
        const user = {
          userID: resData.id,
          email: resData.email,
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
