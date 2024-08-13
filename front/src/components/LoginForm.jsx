import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import fetcher from "../domains/fetcher";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const { setAuth, setAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/lobby";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetcher("/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pwd }),
      });

      if (res) {
        setEmail("");
        setPwd("");
        const user = {
          userID: res.id,
          email: res.email,
        };

        setAuth(user);
        setAuthenticated(true);

        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="relative m-6 flex flex-col space-y-8 rounded-2xl bg-white shadow-2xl md:flex-row md:space-y-0">
          <div className="flex flex-col justify-center p-8 md:p-14">
            <h1 className="text-center text-2xl font-bold">Chat App</h1>
            <form onSubmit={handleSubmit} className="mt-8">
              <input
                type="email"
                name="email"
                className="py- mb-10 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <input
                type="password"
                className="js-password mb-5 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-16 focus:border-blue-500 focus:outline-none"
                id="password"
                placeholder="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
              />

              <div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-blue-500 px-6 py-3 text-white transition duration-150 ease-in-out hover:bg-blue-300"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="mt-10 text-center text-sm text-gray-500">
              Donn't have an account ?{" "}
              <Link to={"/signup"}>
                <p className="cursor-pointer font-semibold leading-6 text-blue-500 hover:text-indigo-500">Signup</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
