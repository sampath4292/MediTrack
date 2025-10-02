import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function About() {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Secure Storage",
      description:
        "Bank-level encryption protects your sensitive medical information with end-to-end security.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Family Sharing",
      description:
        "Manage health records for your entire family in one centralized, easy-to-use platform.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "AI Health Insights",
      description:
        "Get personalized health recommendations and insights powered by advanced AI technology.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "24/7 Access",
      description:
        "Access your medical records anytime, anywhere from any device with internet connection.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Document Management",
      description:
        "Store and organize prescriptions, lab reports, X-rays, and all medical documents in one place.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Doctor Visits Tracking",
      description:
        "Keep comprehensive records of appointments, treatments, and follow-up visits with healthcare providers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                About MediVault
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Empowering individuals and families to take control of their
              health through secure, intelligent medical record management.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At MediVault, we believe that everyone deserves easy, secure
              access to their health information. Our mission is to simplify
              healthcare management by providing a comprehensive platform that
              puts patients and families in control of their medical records,
              enabling better health decisions and improved care coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes MediVault the perfect solution for your
              healthcare management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl shadow-xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-xl text-white/80">
                MediVault is crafted using cutting-edge technologies for optimal
                performance, security, and user experience.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">⚛️</div>
                <h3 className="font-bold mb-2">React 18</h3>
                <p className="text-sm text-white/70">
                  Modern frontend framework
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">🟢</div>
                <h3 className="font-bold mb-2">Node.js</h3>
                <p className="text-sm text-white/70">Scalable backend server</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">🍃</div>
                <h3 className="font-bold mb-2">MongoDB</h3>
                <p className="text-sm text-white/70">
                  Flexible database solution
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-bold mb-2">Tailwind CSS</h3>
                <p className="text-sm text-white/70">
                  Beautiful, responsive design
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of users who trust MediVault with their healthcare
              management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Get Started Free
              </Link>
              <Link
                to="/dashboard"
                className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl shadow-md p-8">
              <svg
                className="w-12 h-12 text-blue-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Privacy Policy
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how we protect and handle your personal health
                information.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Read Privacy Policy
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <svg
                className="w-12 h-12 text-purple-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Terms of Service
              </h3>
              <p className="text-gray-600 mb-4">
                Review the terms and conditions for using MediVault platform.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                View Terms
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <svg
                className="w-12 h-12 text-green-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Contact Us
              </h3>
              <p className="text-gray-600 mb-4">
                Have questions? We're here to help you with any inquiries.
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
