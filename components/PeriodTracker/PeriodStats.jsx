
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calendar, Clock, Activity, BarChart3 } from "lucide-react";

export default function PeriodStats() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('periodEntries') || '[]');
    setEntries(savedEntries);
    calculateStats(savedEntries);
  }, []);

  const calculateStats = (entries) => {
    if (entries.length === 0) {
      setStats(null);
      return;
    }

    // Sort entries by date
    const sortedEntries = entries.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    // Calculate cycle lengths
    const cycleLengths = [];
    for (let i = 1; i < sortedEntries.length; i++) {
      const prevStart = new Date(sortedEntries[i - 1].startDate);
      const currentStart = new Date(sortedEntries[i].startDate);
      const cycleLength = Math.round((currentStart - prevStart) / (1000 * 60 * 60 * 24));
      if (cycleLength > 0 && cycleLength <= 60) {
        cycleLengths.push(cycleLength);
      }
    }

    // Calculate period durations
    const durations = sortedEntries
      .filter(entry => entry.endDate)
      .map(entry => {
        const start = new Date(entry.startDate);
        const end = new Date(entry.endDate);
        return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      });

    // Calculate averages
    const avgCycleLength = cycleLengths.length > 0 
      ? Math.round(cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length)
      : 28;

    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length)
      : 5;

    // Calculate pain levels
    const painLevels = entries.map(entry => entry.painLevel);
    const avgPainLevel = painLevels.length > 0 
      ? Math.round((painLevels.reduce((sum, level) => sum + level, 0) / painLevels.length) * 10) / 10
      : 0;

    // Flow distribution
    const flowDistribution = entries.reduce((acc, entry) => {
      acc[entry.flowLevel] = (acc[entry.flowLevel] || 0) + 1;
      return acc;
    }, {});

    // Predict next period
    let nextPeriodDate = null;
    if (sortedEntries.length > 0) {
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const lastDate = new Date(lastEntry.startDate);
      nextPeriodDate = new Date(lastDate);
      nextPeriodDate.setDate(lastDate.getDate() + avgCycleLength);
    }

    setStats({
      totalEntries: entries.length,
      avgCycleLength,
      avgDuration,
      avgPainLevel,
      cycleLengths,
      durations,
      flowDistribution,
      nextPeriodDate,
      lastEntry: sortedEntries[sortedEntries.length - 1]
    });
  };

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <BarChart3 className="mx-auto w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Statistics Available</h3>
        <p className="text-gray-500">Add at least 2 period entries to see your statistics.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const daysUntilNext = stats.nextPeriodDate 
    ? Math.ceil((stats.nextPeriodDate - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Total Entries</p>
              <p className="text-2xl font-bold">{stats.totalEntries}</p>
            </div>
            <Calendar className="w-8 h-8 text-pink-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Cycle Length</p>
              <p className="text-2xl font-bold">{stats.avgCycleLength} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Avg Duration</p>
              <p className="text-2xl font-bold">{stats.avgDuration} days</p>
            </div>
            <Clock className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Pain Level</p>
              <p className="text-2xl font-bold">{stats.avgPainLevel}/10</p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Next Period Prediction */}
      {stats.nextPeriodDate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-indigo-600" />
            Next Period Prediction
          </h3>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <p className="text-lg">
              Expected on: <span className="font-semibold text-indigo-600">
                {formatDate(stats.nextPeriodDate)}
              </span>
            </p>
            {daysUntilNext > 0 ? (
              <p className="text-gray-600 mt-1">
                In {daysUntilNext} days
              </p>
            ) : (
              <p className="text-red-600 mt-1 font-medium">
                {daysUntilNext === 0 ? 'Expected today!' : `${Math.abs(daysUntilNext)} days overdue`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Flow Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Flow Distribution</h3>
        <div className="space-y-3">
          {Object.entries(stats.flowDistribution).map(([flow, count]) => {
            const percentage = Math.round((count / stats.totalEntries) * 100);
            return (
              <div key={flow} className="flex items-center">
                <div className="w-20 text-sm capitalize">{flow}:</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                  <div
                    className={`h-4 rounded-full ${
                      flow === 'light' ? 'bg-green-400' :
                      flow === 'normal' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-right">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Insights</h3>
        <div className="space-y-3">
          {stats.cycleLengths.length > 0 && (
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">Cycle Regularity</p>
                <p className="text-sm text-blue-700">
                  {stats.cycleLengths.length < 3 
                    ? 'Need more data for pattern analysis'
                    : `Based on ${stats.cycleLengths.length} cycles`
                  }
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-purple-900">Pain Management</p>
              <p className="text-sm text-purple-700">
                {stats.avgPainLevel <= 3 
                  ? 'Generally mild pain levels'
                  : stats.avgPainLevel <= 6 
                    ? 'Moderate pain levels - consider tracking triggers'
                    : 'High pain levels - consult healthcare provider'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
