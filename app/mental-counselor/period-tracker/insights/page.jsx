
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Heart, Brain, Activity, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

export default function HealthInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/period-tracker/insights", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: "1234567890" }),
        });
        const data = await res.json();
        setInsights(data.insights);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Analyzing your health data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">💡 Health Insights</h1>
        <p className="text-gray-600">Personalized recommendations based on your cycle data</p>
      </div>

      {insights ? (
        <div className="space-y-8">
          {/* Overall Health Score */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Overall Cycle Health</h2>
                <p className="text-green-700">Your cycle regularity and wellness score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{insights.healthScore}/100</div>
                <div className="text-sm text-green-700">Health Score</div>
              </div>
            </div>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cycle Regularity */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center mb-4">
                <Activity className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Cycle Regularity</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{insights.regularity}%</div>
              <p className="text-gray-600">{insights.regularityMessage}</p>
            </div>

            {/* Symptom Patterns */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Symptom Trends</h3>
              </div>
              <div className="text-lg font-semibold text-purple-600 mb-2">{insights.topSymptom}</div>
              <p className="text-gray-600">Most common symptom this cycle</p>
            </div>

            {/* Wellness Score */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Wellness</h3>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">{insights.wellnessScore}/10</div>
              <p className="text-gray-600">Average energy & mood</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
              Personalized Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900">{rec.title}</h4>
                    <p className="text-blue-800 text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Alerts */}
          {insights.alerts && insights.alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Health Alerts
              </h2>
              <div className="space-y-3">
                {insights.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <p className="text-yellow-800">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cycle Prediction Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
              Cycle Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Average Cycle Length</h4>
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{insights.avgCycleLength} days</div>
                  <p className="text-indigo-800 text-sm">Typical: 21-35 days</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Average Period Duration</h4>
                <div className="bg-pink-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{insights.avgPeriodLength} days</div>
                  <p className="text-pink-800 text-sm">Typical: 3-7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Not Enough Data</h2>
          <p className="text-gray-500 mb-4">Add more period entries to get personalized insights</p>
          <a
            href="/mental-counselor/period-tracker/add"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Add Period Entry
          </a>
        </div>
      )}
    </main>
  );
}
