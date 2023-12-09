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
import Protected from "./components/Protected";
import PersistentLogin from "./components/PersistentLogin";
import ErrorPage from "./errorPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<Signup />}></Route>

          <Route element={<PersistentLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<Protected />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
