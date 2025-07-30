
"use client";

import { Calendar, Plus, History, TrendingUp, Target, Heart, Zap, Brain, Trophy, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PeriodTrackerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cyclePhase, setCyclePhase] = useState('');
  const [todayTips, setTodayTips] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API calls for now
        const mockStats = {
          totalEntries: 12,
          prediction: {
            nextStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            avgCycleLength: 28
          },
          currentPhase: 'Follicular',
          cycleDay: 14,
          fertilityWindow: true,
          moodTrend: 'improving',
          symptomsThisMonth: 3
        };

        const tips = [
          "💧 Stay hydrated - aim for 8 glasses of water today",
          "🥗 Include iron-rich foods in your diet",
          "🧘‍♀️ Try 10 minutes of meditation for mood balance",
          "🚶‍♀️ Light exercise can help reduce cramps"
        ];

        setStats(mockStats);
        setCyclePhase(mockStats.currentPhase);
        setTodayTips(tips);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Menstrual': return 'bg-red-100 text-red-800 border-red-200';
      case 'Follicular': return 'bg-green-100 text-green-800 border-green-200';
      case 'Ovulation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Luteal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="p-8 max-w-6xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Period Tracker Pro
        </h1>
        <p className="text-gray-600 text-lg">Your personalized menstrual health companion</p>
      </div>

      {/* Current Cycle Status */}
      {!loading && stats && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Today's Cycle Status</h2>
            <span className={`px-4 py-2 rounded-full border ${getPhaseColor(cyclePhase)} font-semibold`}>
              {cyclePhase} Phase - Day {stats.cycleDay}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
              <Target className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Fertility Window</h3>
              <p className="text-sm text-gray-600">{stats.fertilityWindow ? 'High' : 'Low'}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Mood Trend</h3>
              <p className="text-sm text-gray-600 capitalize">{stats.moodTrend}</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Energy Level</h3>
              <p className="text-sm text-gray-600">Moderate</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-pink-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-pink-800">Total Cycles</h3>
              <Trophy className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-3xl font-bold text-pink-600">{stats.totalEntries}</p>
            <p className="text-sm text-gray-500 mt-1">Tracked this year</p>
          </div>
          
          {stats.prediction && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-purple-800">Next Period</h3>
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {new Date(stats.prediction.nextStartDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.ceil((new Date(stats.prediction.nextStartDate) - new Date()) / (1000 * 60 * 60 * 24))} days away
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-indigo-800">Avg Cycle</h3>
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-indigo-600">{stats.prediction.avgCycleLength}</p>
                <p className="text-sm text-gray-500 mt-1">days</p>
              </div>
            </>
          )}

          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-800">Symptoms</h3>
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.symptomsThisMonth}</p>
            <p className="text-sm text-gray-500 mt-1">this month</p>
          </div>
        </div>
      )}

      {/* Today's Tips */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Personalized Tips for Today</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayTips.map((tip, index) => (
            <div key={`tip-${index}`} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Add Entry */}
        <Link href="/mental-counselor/period-tracker/add">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-green-300 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <Plus className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Log Period</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">Quick entry with symptoms & mood tracking</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
              Add Entry
            </button>
          </div>
        </Link>

        {/* View History */}
        <Link href="/mental-counselor/period-tracker/history">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <History className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cycle History</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">View patterns & edit past entries</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
              View History
            </button>
          </div>
        </Link>

        {/* Predictions */}
        <Link href="/mental-counselor/period-tracker/predict">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">Smart forecasting & fertility insights</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
              View Predictions
            </button>
          </div>
        </Link>

        {/* Insights */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-amber-300 transition-all duration-300 cursor-pointer group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-200 transition-colors">
              <Brain className="text-amber-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Health Insights</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">Personalized analysis & recommendations</p>
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
            View Insights
          </button>
        </div>
      </div>

      {/* Cycle Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cycle Progress</h2>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(stats?.cycleDay || 14) / 28 * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Day 1</span>
            <span className="font-semibold text-purple-600">Day {stats?.cycleDay || 14}</span>
            <span>Day 28</span>
          </div>
        </div>
      </div>
    </main>
  );
}
