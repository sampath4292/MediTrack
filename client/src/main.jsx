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
import { LoadingPage } from "./components/LoadingSpinner.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) return <LoadingPage />;
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) return <LoadingPage />;
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
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
      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
