import React from "react";
import Header from "../components/Header.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto p-8">
        <section className="grid md:grid-cols-2 gap-8 items-center py-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Store & manage your prescriptions securely</h1>
            <p className="text-lg text-gray-600 mb-6">
              MediVault helps you keep all your medical prescriptions, slips, and records in one secure digital vault. Upload images or PDFs, search instantly, and access your records from anywhere.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-xl">Get Started</Link>
              <Link to="/about" className="px-6 py-3 border rounded-xl text-gray-700">Learn more</Link>
            </div>
          </div>

          <div className="space-y-4">
            <img src="/hero-1.jpg" alt="doctor" className="w-full rounded-2xl shadow-lg" />
            <div className="grid grid-cols-2 gap-4">
              <img src="/hero-2.jpg" alt="prescription" className="w-full rounded-xl shadow" />
              <img src="/hero-3.jpg" alt="mobile" className="w-full rounded-xl shadow" />
            </div>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-semibold mb-4">Why MediVault?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Secure storage</h3>
              <p className="text-sm text-gray-600">Encrypted storage for all your prescriptions and medical paperwork.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Searchable</h3>
              <p className="text-sm text-gray-600">Find records quickly by doctor, date, or tags.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-2">Share when needed</h3>
              <p className="text-sm text-gray-600">Easily share prescriptions with doctors or family members (coming soon).</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
