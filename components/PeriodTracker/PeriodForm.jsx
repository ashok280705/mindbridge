
"use client";

import { useState } from "react";
import { ArrowLeft, Droplets, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PeriodForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    flowLevel: "medium",
    painLevel: 5,
    mood: "",
    symptoms: [],
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const symptomOptions = [
    "Cramps", "Bloating", "Headache", "Fatigue", "Mood Swings", 
    "Breast Tenderness", "Nausea", "Back Pain", "Food Cravings", "Irritability"
  ];

  const handleSymptomChange = (symptom) => {
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
      // Import and use local storage
      const { periodStorage } = await import('@/lib/localPeriodStorage');
      
      // Validate required fields
      if (!formData.startDate) {
        toast.error("Please select a start date");
        setLoading(false);
        return;
      }

      // Save to local storage
      const savedEntry = periodStorage.saveEntry({
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        flowLevel: formData.flowLevel,
        painLevel: parseInt(formData.painLevel),
        mood: formData.mood,
        symptoms: formData.symptoms,
        notes: formData.notes
      });

      if (savedEntry) {
        toast.success("Period entry saved successfully!");
        
        // Reset form
        setFormData({
          startDate: "",
          endDate: "",
          flowLevel: "medium",
          painLevel: 5,
          mood: "",
          symptoms: [],
          notes: "",
        });

        // Redirect to history page after a short delay
        setTimeout(() => {
          router.push('/mental-counselor/period-tracker/history');
        }, 1000);
      } else {
        toast.error("Failed to save entry to local storage");
      }
    } catch (error) {
      console.error("Error saving period entry:", error);
      toast.error("Error saving period entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/mental-counselor/period-tracker"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Droplets className="w-6 h-6 text-pink-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add Period Entry</h1>
        </div>
        <p className="text-gray-600">Track your menstrual cycle details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              min={formData.startDate}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Flow Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flow Level
          </label>
          <select
            value={formData.flowLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, flowLevel: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        {/* Pain Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pain Level: {formData.painLevel}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.painLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, painLevel: e.target.value }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No Pain</span>
            <span>Severe Pain</span>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood
          </label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">Select mood</option>
            <option value="happy">Happy 😊</option>
            <option value="sad">Sad 😢</option>
            <option value="anxious">Anxious 😰</option>
            <option value="irritated">Irritated 😠</option>
            <option value="calm">Calm 😌</option>
            <option value="energetic">Energetic ⚡</option>
            <option value="tired">Tired 😴</option>
          </select>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Symptoms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {symptomOptions.map(symptom => (
              <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
            placeholder="Any additional notes about your cycle..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Entry
              </>
            )}
          </button>
          
          <Link 
            href="/mental-counselor/period-tracker"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
