import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

//providers
import { AuthProvider } from "./context/AuthProvider";

// Components
import App from "./App.jsx";
import Signup from "./components/Signup";
import RequireAuth from "./components/RequireAuth";
import PersistentLogin from "./components/PersistentLogin";
import ErrorPage from "./errorPage";
import Lobby from "./components/Lobby";
import Room from "./components/Room";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />}></Route>

          <Route element={<PersistentLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/room/:roomId" element={<Room />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
