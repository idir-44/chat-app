import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useMe } from "../domains/user";

export default function PersistentLogin() {
  const { setAuth, auth, authenticated, setAuthenticated } = useAuth();
  const { data: user, isPending, isError } = useMe();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setAuth(user);
      setAuthenticated(true);

      console.log(auth, isPending);
    }
  }, [authenticated, user]);

  if (isError) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  if (isPending || !authenticated) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
