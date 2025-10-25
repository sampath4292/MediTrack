import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiInsight, setAiInsight] = useState("");
  const [familySectionCollapsed, setFamilySectionCollapsed] = useState(false);
  const [reportsSectionCollapsed, setReportsSectionCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    age: "",
    relationship: "Father",
    medicalNotes: "",
  });
  const [newReport, setNewReport] = useState({
    type: "Prescription",
    date: "",
    doctor: "",
    notes: "",
  });
  const [editProfile, setEditProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  // Start with only Self as default family member
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: user?.name || "You",
      age: null,
      relationship: "Self",
      avatar: "�",
      reports: [], // Each member has their own reports array
    },
  ]);

  // User's own medical data (separate from family members)
  const [recentUploads, setRecentUploads] = useState([]);

  const [doctorVisits] = useState([
    {
      id: 1,
      date: "2025-09-20",
      doctor: "Dr. Smith",
      summary: "Annual checkup - All vitals normal",
    },
    {
      id: 2,
      date: "2025-08-15",
      doctor: "Dr. Johnson",
      summary: "Follow-up consultation",
    },
  ]);

  const handleAddMember = (e) => {
    e.preventDefault();
    const member = {
      id: familyMembers.length + 1,
      name: newMember.name,
      age: parseInt(newMember.age) || null,
      relationship: newMember.relationship,
      avatar: getAvatarByRelationship(newMember.relationship),
      reports: [], // Start with no reports
    };
    setFamilyMembers([...familyMembers, member]);
    setShowAddMemberModal(false);
    setNewMember({
      name: "",
      age: "",
      relationship: "Father",
      medicalNotes: "",
    });
    showToast(`${member.name} added to family!`);
  };

  const handleUploadReport = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    const report = {
      id: Date.now(),
      type: newReport.type,
      date: newReport.date,
      doctor: newReport.doctor,
      notes: newReport.notes,
      uploadedAt: new Date().toISOString(),
    };

    // Add report to the selected member
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === selectedMember.id
          ? { ...member, reports: [...member.reports, report] }
          : member
      )
    );

    setShowUploadModal(false);
    setSelectedMember(null);
    setNewReport({ type: "Prescription", date: "", doctor: "", notes: "" });
    showToast(`Report uploaded for ${selectedMember.name}!`);
  };

  const openUploadModal = (memberId) => {
    const member = familyMembers.find((m) => m.id === memberId);
    setSelectedMember(member);
    setShowUploadModal(true);
  };

  const getAvatarByRelationship = (relationship) => {
    const avatars = {
      Self: "�",
      Spouse: "👩‍❤️‍�",
      Father: "👨‍🦳",
      Mother: "👩‍🦳",
      Son: "👦",
      Daughter: "👧",
      Brother: "👨",
      Sister: "👩",
      Grandfather: "👴",
      Grandmother: "👵",
      Other: "👥",
    };
    return avatars[relationship] || "👤";
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // Scroll listener for back to top button and section highlighting
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Dynamic section highlighting based on scroll position
      const sections = [
        "dashboard",
        "upload",
        "doctor-visits",
        "ai-insights",
        "family",
        "features",
      ];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // New helper functions
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for fixed navbar
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    // Update user profile (placeholder - would connect to backend)
    showToast("Profile updated successfully!");
    setShowEditProfileModal(false);
  };

  const getAIInsights = () => {
    if (!aiQuestion.trim()) {
      showToast("Please enter a health question", "error");
      return;
    }

    // Simulate AI response with dummy data
    const insights = [
      "Your blood pressure trend is stable based on recent readings",
      "Cholesterol levels have improved by 10% since last month",
      "Consider increasing daily water intake to 8 glasses",
      "Your sleep pattern shows improvement over the past week",
      "Recommended: Schedule annual eye exam",
      "Your BMI is in the healthy range - keep up the good work!",
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    setAiInsight(randomInsight);
    showToast("AI insight generated!");
    setAiQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Fixed Left Sidebar - Always Visible */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-200">
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <span className="text-xl font-bold text-gray-800">MediTrack</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <button
              onClick={() => scrollToSection("dashboard")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "dashboard"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "dashboard"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                />
              </svg>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => scrollToSection("upload")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "upload"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "upload"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Upload Documents</span>
            </button>

            <button
              onClick={() => scrollToSection("doctor-visits")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "doctor-visits"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "doctor-visits"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
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
              <span>Doctor Visits</span>
            </button>

            <button
              onClick={() => scrollToSection("ai-insights")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "ai-insights"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "ai-insights"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
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
              <span>AI Insights</span>
            </button>

            <button
              onClick={() => scrollToSection("family")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "family"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "family"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
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
              <span>Family Members</span>
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left group ${
                activeSection === "features"
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
                  : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  activeSection === "features"
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Features</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <span className="text-xl font-bold text-gray-800">
                  MediTrack
                </span>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="p-6 space-y-2">
              {/* Mobile nav buttons - same as desktop but without the fixed positioning */}
              <button
                onClick={() => scrollToSection("dashboard")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "dashboard"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => scrollToSection("upload")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "upload"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>Upload Documents</span>
              </button>
              <button
                onClick={() => scrollToSection("doctor-visits")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "doctor-visits"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                <span>Doctor Visits</span>
              </button>
              <button
                onClick={() => scrollToSection("ai-insights")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "ai-insights"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                <span>AI Insights</span>
              </button>
              <button
                onClick={() => scrollToSection("family")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "family"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                <span>Family Members</span>
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 w-full text-left ${
                  activeSection === "features"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span>Features</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Enhanced Top Navigation Bar */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button & Page Title */}
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Page Title - Only visible on mobile */}
                <h1 className="lg:hidden text-xl font-bold text-gray-800">
                  Dashboard
                </h1>

                {/* Desktop Breadcrumb */}
                <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                  <Link
                    to="/"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Home
                  </Link>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="text-gray-800 font-medium">Dashboard</span>
                </div>
              </div>

              {/* Right Side - Profile & Actions */}
              <div className="flex items-center space-x-4">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                        <svg
                          className="w-6 h-6 text-white"
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
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-900"
                              } group flex rounded-lg items-center w-full px-3 py-2 text-sm transition-colors`}
                            >
                              <svg
                                className="w-5 h-5 mr-3"
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
                              Profile
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setShowEditProfileModal(true)}
                              className={`${
                                active
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-gray-900"
                              } group flex rounded-lg items-center w-full px-3 py-2 text-sm transition-colors`}
                            >
                              <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit Profile
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? "bg-gray-50" : "text-gray-900"
                              } group flex rounded-lg items-center w-full px-3 py-2 text-sm transition-colors`}
                            >
                              <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Settings
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? "bg-gray-50" : "text-gray-900"
                              } group flex rounded-lg items-center w-full px-3 py-2 text-sm transition-colors`}
                            >
                              <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-6.8-4.3l1.4-.6A6 6 0 0012 17v0z"
                                />
                              </svg>
                              Notifications
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${
                                active
                                  ? "bg-red-50 text-red-600"
                                  : "text-gray-900"
                              } group flex rounded-lg items-center w-full px-3 py-2 text-sm transition-colors`}
                            >
                              <svg
                                className="w-5 h-5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <nav className="lg:hidden mt-4 pb-4 space-y-3">
                <Link
                  to="/"
                  className="block px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold"
                >
                  Dashboard
                </Link>
                <a
                  href="#family"
                  className="block px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Family
                </a>
                <a
                  href="#help"
                  className="block px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Help
                </a>
                <Link
                  to="/about"
                  className="block px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  About
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </nav>
            )}
          </div>
        </header>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}

        {/* Welcome Card - visually improved */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 rounded-xl shadow-lg p-8 w-full max-w-2xl text-center border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Welcome to MediTrack!
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Your health records and family care, all in one place. Stay
              organized, stay healthy!
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-600">
                  {user?.family?.length || 1}
                </span>
                <span className="text-xs text-gray-500">Family Members</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-purple-600">
                  {user?.records?.length || 0}
                </span>
                <span className="text-xs text-gray-500">Health Records</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-indigo-600">
                  {user?.doctorVisits?.length || 0}
                </span>
                <span className="text-xs text-gray-500">Doctor Visits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 overflow-auto">
          {/* Welcome Section */}
          <section id="dashboard" className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Your health records and family care in one place
              </p>
            </div>
          </section>{" "}
          {/* Quick Actions - Upload Documents */}
          <section id="upload" className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-3">
                    Upload Medical Documents
                  </h2>
                  <p className="text-white/90 text-lg mb-4">
                    Securely store prescriptions, lab reports, X-rays, and more
                    for you and your family.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Lab Reports
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Prescriptions
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      X-Rays
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      MRI Scans
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => openUploadModal(familyMembers[0].id)}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span>Upload Now</span>
                  </button>
                  <Link
                    to="/upload"
                    className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-6 h-6"
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
                    <span>View All</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/* Doctor Visits Section */}
          <section id="doctor-visits" className="mb-12">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Track Doctor Visits
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Keep a comprehensive record of all appointments, treatments,
                    and follow-ups.
                  </p>
                </div>
                <button
                  onClick={() =>
                    showToast("Doctor visit tracking coming soon!")
                  }
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Visit</span>
                </button>
              </div>

              {/* Recent Doctor Visits */}
              <div className="grid md:grid-cols-2 gap-4">
                {doctorVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {visit.doctor}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{visit.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Your Medical Records Section - Moved below Doctor Visits */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Medical Records
              </h2>
              <p className="text-gray-600">
                Recent uploads and health information
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-indigo-600"
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
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {upload.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium text-gray-700">
                          {upload.type}
                        </span>{" "}
                        • {upload.doctor}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(upload.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload New Card */}
              <Link
                to="/upload"
                className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center min-h-[140px] group"
              >
                <div className="bg-white p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Upload New Document
                </p>
              </Link>
            </div>
          </section>
          {/* AI Health Insights Section */}
          <section id="ai-insights" className="mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    AI Health Insights
                  </h2>
                  <p className="text-gray-600">
                    Get personalized health recommendations
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-xl">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Chat Box */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ask a health question:
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="e.g., How is my blood pressure trending?"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onKeyPress={(e) => e.key === "Enter" && getAIInsights()}
                      />
                      <button
                        onClick={getAIInsights}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>

                  {/* Sample Questions */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Try asking:
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() =>
                          setAiQuestion("How is my blood pressure trending?")
                        }
                        className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        • How is my blood pressure trending?
                      </button>
                      <button
                        onClick={() =>
                          setAiQuestion("What should I focus on this month?")
                        }
                        className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        • What should I focus on this month?
                      </button>
                      <button
                        onClick={() =>
                          setAiQuestion("Any health recommendations?")
                        }
                        className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        • Any health recommendations?
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Response */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <svg
                        className="w-5 h-5 text-purple-600"
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
                    </div>
                    <h3 className="font-semibold text-gray-800">AI Insight</h3>
                  </div>

                  {aiInsight ? (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-700">{aiInsight}</p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Generated by AI • For informational purposes only
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-gray-300 mx-auto mb-4"
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
                      <p className="text-gray-500">
                        Ask a question to get AI-powered health insights
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* Family Members Section */}
          <section id="family" className="mb-12">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      setFamilySectionCollapsed(!familySectionCollapsed)
                    }
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        familySectionCollapsed ? "rotate-0" : "rotate-90"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Family Members
                    </h2>
                    <p className="text-gray-600">
                      Manage health records for your entire family
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Member</span>
                </button>
              </div>

              {!familySectionCollapsed && (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 p-6 border border-gray-100"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="text-5xl">{member.avatar}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">
                              {member.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              {member.age && (
                                <>
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                                    {member.age} years
                                  </span>
                                  <span className="text-gray-400">•</span>
                                </>
                              )}
                              <span className="text-purple-600 font-medium">
                                {member.relationship}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">
                                Medical Reports
                              </p>
                              <p className="text-2xl font-bold text-gray-800">
                                {member.reports.length}
                              </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <svg
                                className="w-6 h-6 text-blue-600"
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
                            </div>
                          </div>
                          {member.reports.length === 0 ? (
                            <p className="text-xs text-gray-500 mt-2">
                              No reports yet
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500 mt-2">
                              Last updated:{" "}
                              {new Date(
                                member.reports[member.reports.length - 1].date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => openUploadModal(member.id)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-1 text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span>Upload</span>
                          </button>
                          {member.reports.length > 0 ? (
                            <button
                              onClick={() =>
                                showToast(
                                  `Viewing ${member.reports.length} reports for ${member.name}`
                                )
                              }
                              className="bg-white border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-1 text-sm"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>View</span>
                            </button>
                          ) : (
                            <div className="bg-gray-100 border-2 border-gray-200 text-gray-500 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center text-sm">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              <span>No reports yet</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          {/* Features Section */}
          <section id="features" className="mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Platform Features
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to manage your family's health
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
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
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Secure Storage
                </h3>
                <p className="text-gray-600 text-sm">
                  Bank-level encryption keeps your medical records safe and
                  private
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  24/7 Access
                </h3>
                <p className="text-gray-600 text-sm">
                  Access your health records anytime, anywhere from any device
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
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
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  AI Insights
                </h3>
                <p className="text-gray-600 text-sm">
                  Get intelligent health insights and recommendations powered by
                  AI
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Family Sharing
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage health records for your entire family in one place
                </p>
              </div>
            </div>

            {/* Health Stats Cards - Moved to Features Section */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
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
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Security Status
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      100% Secure
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Access</p>
                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      Family Members
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {familyMembers.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <span className="text-xl font-bold">MediTrack</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Your trusted platform for secure medical record management.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help */}
              <div id="help">
                <h3 className="font-bold text-lg mb-4">Help & Support</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <p className="text-sm text-gray-400">
                  Email: support@meditrack.com
                  <br />
                  Phone: +1 (555) 123-4567
                  <br />
                  Available 24/7
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>© 2025 MediTrack. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 ml-4"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Profile
                </h2>
                <p className="text-gray-600">Update your account information</p>
              </div>
            </div>

            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editProfile.name}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  readOnly
                  value={editProfile.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  value={editProfile.password}
                  onChange={(e) =>
                    setEditProfile({ ...editProfile, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add Family Member
            </h2>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="150"
                  value={newMember.age}
                  onChange={(e) =>
                    setNewMember({ ...newMember, age: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  required
                  value={newMember.relationship}
                  onChange={(e) =>
                    setNewMember({ ...newMember, relationship: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Notes
                </label>
                <textarea
                  value={newMember.medicalNotes}
                  onChange={(e) =>
                    setNewMember({ ...newMember, medicalNotes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  placeholder="Any health conditions, allergies, or notes..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upload Medical Report
            </h2>

            <form onSubmit={handleUploadReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  required
                  value={newReport.type}
                  onChange={(e) =>
                    setNewReport({ ...newReport, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select type</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI Scan">MRI Scan</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={newReport.date}
                  onChange={(e) =>
                    setNewReport({ ...newReport, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={newReport.doctor}
                  onChange={(e) =>
                    setNewReport({ ...newReport, doctor: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newReport.notes}
                  onChange={(e) =>
                    setNewReport({ ...newReport, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                  placeholder="Additional notes about this report..."
                ></textarea>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> Actual file
                  upload functionality will be implemented with backend
                  integration.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16 pointer-events-none"
        } fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50`}
        aria-label="Back to top"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
