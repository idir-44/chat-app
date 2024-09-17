import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useMe } from "../domains/user";

export default function PersistentLogin() {
  const { setAuth, authenticated, setAuthenticated } = useAuth();
  const { data: user, isPending } = useMe();

  useEffect(() => {
    if (user) {
      setAuth(user);
      setAuthenticated(true);
    }
  }, [authenticated, user]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
