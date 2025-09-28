import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function UploadSlip() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    doctor: "",
    hospital: "",
    date: "",
    tags: "",
    notes: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) {
      setError("File required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      fd.append("file", file);
      const { data } = await axios.post(`${API}/slips`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      nav("/");
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Upload Slip</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="Doctor"
            value={form.doctor}
            onChange={(e) => setForm({ ...form, doctor: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Hospital"
            value={form.hospital}
            onChange={(e) => setForm({ ...form, hospital: e.target.value })}
          />
        </div>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button
            type="button"
            onClick={() => nav("/")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
