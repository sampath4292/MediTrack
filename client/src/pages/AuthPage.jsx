import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function AuthPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = mode === "login" ? `${API}/auth/login` : `${API}/auth/register`;
      const payload = { email: form.email, password: form.password, ...(mode === "register" ? { name: form.name } : {}) };
      const { data } = await axios.post(url, payload);
      login(data);
      nav("/");
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.details?.length) {
        setError(resp.details.map(d => d.msg).join("; "));
      } else {
        setError(resp?.error || "Failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">MediVault</h1>
        <div className="flex justify-center gap-4 mb-2">
          <button
            className={mode === "login" ? "font-semibold" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "font-semibold" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
