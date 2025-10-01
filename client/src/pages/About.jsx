import React from "react";
import Header from "../components/Header.jsx";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">About MediVault</h1>
        <p className="text-gray-700">MediVault is a small project to help you store and manage your medical prescriptions. Built with love using React, Node and MongoDB.</p>
      </main>
    </div>
  );
}
