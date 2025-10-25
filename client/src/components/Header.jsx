import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              MT
            </div>
            <span className="text-xl font-semibold text-gray-900">MediTrack</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            <Link to="/auth" className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md shadow-sm hover:opacity-95">
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
