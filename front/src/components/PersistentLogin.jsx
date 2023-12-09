import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PersistentLogin() {
  const [isLoading, setIsloading] = useState(true);
  const { auth, setAuth, authenticated, setAuthenticated } = useAuth();

  useEffect(() => {
    const getLocalToken = () => {
      try {
        const token = localStorage.getItem("authenticatedUser");
        const user = JSON.parse(token);

        if (user) {
          setAuth(user);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    };

    !authenticated ? getLocalToken() : setIsloading(false);
  }, []);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
}
