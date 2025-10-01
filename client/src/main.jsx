import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadSlip from "./pages/UploadSlip.jsx";
import { AuthProvider, useAuth } from "./state/auth.jsx";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadSlip />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
