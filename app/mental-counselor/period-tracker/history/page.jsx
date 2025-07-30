
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Droplets, Zap, Heart, Brain, Plus, Save } from "lucide-react";

export default function AddPeriodEntry() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    flowLevel: 'normal',
    painLevel: '0',
    mood: 'neutral',
    symptoms: [],
    energyLevel: '3',
    sleepQuality: '3',
    notes: '',
    exerciseType: '',
    waterIntake: '8'
  });

  const [loading, setLoading] = useState(false);

  const symptomOptions = [
    'Cramps', 'Bloating', 'Headache', 'Nausea', 'Fatigue', 
    'Mood Swings', 'Breast Tenderness', 'Acne', 'Food Cravings', 
    'Back Pain', 'Irritability', 'Anxiety'
  ];

  const moodOptions = [
    { value: 'great', label: '😄 Great', color: 'text-green-600' },
    { value: 'good', label: '😊 Good', color: 'text-blue-600' },
    { value: 'neutral', label: '😐 Neutral', color: 'text-gray-600' },
    { value: 'low', label: '😔 Low', color: 'text-orange-600' },
    { value: 'terrible', label: '😢 Terrible', color: 'text-red-600' }
  ];

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Period entry:', formData);
      router.push('/mental-counselor/period-tracker');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Log Your Period
        </h1>
        <p className="text-gray-600">Track your cycle with detailed insights</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
        {/* Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-2">
              <Calendar className="w-5 h-5 mr-2 text-pink-600" />
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-2">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Flow & Pain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <Droplets className="w-5 h-5 mr-2 text-blue-600" />
              Flow Level
            </label>
            <div className="space-y-2">
              {['light', 'normal', 'heavy'].map((level) => (
                <label key={`flow-${level}`} className="flex items-center">
                  <input
                    type="radio"
                    name="flowLevel"
                    value={level}
                    checked={formData.flowLevel === level}
                    onChange={(e) => setFormData({...formData, flowLevel: e.target.value})}
                    className="mr-3 text-blue-600"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-3">
              <Zap className="w-5 h-5 mr-2 text-red-600" />
              Pain Level: {formData.painLevel}/10
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={formData.painLevel}
              onChange={(e) => setFormData({...formData, painLevel: e.target.value})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>No Pain</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <label className="flex items-center text-gray-700 font-semibold mb-3">
            <Heart className="w-5 h-5 mr-2 text-pink-600" />
            Mood Today
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={`mood-${mood.value}`}
                type="button"
                onClick={() => setFormData({...formData, mood: mood.value})}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.mood === mood.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <div className={`text-center ${mood.color}`}>
                  <div className="text-2xl mb-1">{mood.label.split(' ')[0]}</div>
                  <div className="text-sm font-medium">{mood.label.split(' ')[1]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="flex items-center text-gray-700 font-semibold mb-3">
            <Brain className="w-5 h-5 mr-2 text-indigo-600" />
            Symptoms (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {symptomOptions.map((symptom) => (
              <button
                key={`symptom-${symptom}`}
                type="button"
                onClick={() => handleSymptomToggle(symptom)}
                className={`p-3 rounded-lg border-2 text-sm transition-all ${
                  formData.symptoms.includes(symptom)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Energy Level: {formData.energyLevel}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.energyLevel}
              onChange={(e) => setFormData({...formData, energyLevel: e.target.value})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Sleep Quality: {formData.sleepQuality}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.sleepQuality}
              onChange={(e) => setFormData({...formData, sleepQuality: e.target.value})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Water Intake (glasses)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={formData.waterIntake}
              onChange={(e) => setFormData({...formData, waterIntake: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Exercise */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Exercise Today
          </label>
          <select
            value={formData.exerciseType}
            onChange={(e) => setFormData({...formData, exerciseType: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
          >
            <option value="">No exercise</option>
            <option value="light">Light (walking, stretching)</option>
            <option value="moderate">Moderate (yoga, cycling)</option>
            <option value="intense">Intense (running, HIIT)</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any additional observations, feelings, or details..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Entry
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
