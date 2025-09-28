import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [slips, setSlips] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/slips`, {
        headers: { Authorization: `Bearer ${token}` },
        params: q ? { q } : {},
      });
      setSlips(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Your Slips</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm underline">
            Logout
          </button>
        </div>
      </header>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={load} className="bg-gray-800 text-white px-4 rounded">
          Search
        </button>
        <Link to="/upload" className="bg-blue-600 text-white px-4 rounded">
          Upload
        </Link>
      </div>
      {loading && <div>Loading...</div>}
      <ul className="grid md:grid-cols-2 gap-4">
        {slips.map((s) => (
          <li key={s._id} className="border rounded p-3 bg-white">
            <div className="font-medium">{s.title}</div>
            <div className="text-xs text-gray-500">
              {s.doctor} {s.hospital}
            </div>
            <div className="text-xs">
              {new Date(s.date).toLocaleDateString()}
            </div>
            <a
              href={s.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
