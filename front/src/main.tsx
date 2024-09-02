import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

//providers
import { AuthProvider } from "./context/AuthProvider";

// Components
import App from "./App.tsx";
import Signup from "./pages/Signup.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import PersistentLogin from "./components/PersistentLogin";
import ErrorPage from "./errorPage";
import Lobby from "./pages/Lobby.tsx";
import Room from "./pages/Room.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element is null");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
