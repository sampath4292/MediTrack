import React, { useState } from "react";
import api from "../api.js";

export default function AIHealthReport({ user }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(false);

  async function generateReport() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/slips/health-report");
      setReport(data);
      setShowReport(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  if (!showReport) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">AI Health Insights</h3>
            </div>
            <p className="text-white/90 mb-6">
              Get personalized health recommendations based on all your prescriptions.
              Our AI analyzes your medical history to provide comprehensive insights.
            </p>
            <button
              onClick={generateReport}
              disabled={loading}
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Generate My Health Report</span>
                </>
              )}
            </button>
            {error && (
              <p className="mt-4 text-red-200 text-sm">{error}</p>
            )}
          </div>
          <div className="hidden md:block">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
              <svg
                className="w-24 h-24 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const { report: healthReport, patient } = report;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
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
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                AI Health Report
              </h2>
              <p className="text-gray-600">
                For {patient.name} • {healthReport.prescriptionCount} prescriptions analyzed
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReport(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Overall Health Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Overall Health Status
          </h3>
          <p className="text-gray-700">{healthReport.overallHealthStatus}</p>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {healthReport.summary}
          </p>
        </div>
      </div>

      {/* Key Findings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Common Conditions */}
        {healthReport.commonConditions && healthReport.commonConditions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              Common Conditions
            </h3>
            <ul className="space-y-2">
              {healthReport.commonConditions.map((condition, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {healthReport.riskFactors && healthReport.riskFactors.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              Risk Factors
            </h3>
            <ul className="space-y-2">
              {healthReport.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Critical Recommendations */}
        {healthReport.criticalRecommendations &&
          healthReport.criticalRecommendations.length > 0 && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                Critical Recommendations
              </h3>
              <ul className="space-y-2">
                {healthReport.criticalRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Lifestyle Advice */}
        {healthReport.lifestyleAdvice && healthReport.lifestyleAdvice.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              Lifestyle Advice
            </h3>
            <ul className="space-y-2">
              {healthReport.lifestyleAdvice.map((advice, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">💡</span>
                  <span className="text-gray-700">{advice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Health Trends & Follow-up */}
      <div className="grid md:grid-cols-2 gap-6">
        {healthReport.healthTrends && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Health Trends
            </h3>
            <p className="text-gray-700">{healthReport.healthTrends}</p>
          </div>
        )}

        {healthReport.followUpNeeded && healthReport.followUpNeeded.length > 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Follow-up Needed
            </h3>
            <ul className="space-y-2">
              {healthReport.followUpNeeded.map((followUp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span className="text-gray-700">{followUp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Positive Indicators */}
      {healthReport.positiveIndicators &&
        healthReport.positiveIndicators.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">🎉</span>
              Positive Health Indicators
            </h3>
            <ul className="grid md:grid-cols-2 gap-3">
              {healthReport.positiveIndicators.map((indicator, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Footer */}
      <div className="bg-blue-50 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-600">
          Generated on {new Date(healthReport.generatedAt).toLocaleString()} •{" "}
          This report is AI-generated and should not replace professional medical advice
        </p>
      </div>
    </div>
  );
}
