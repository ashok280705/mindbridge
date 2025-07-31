
"use client";

import { useState } from "react";
import { Edit, Trash2, Save, X, Calendar, Droplets, AlertCircle } from "lucide-react";

export default function PeriodHistory({ entries }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Period Entries Yet</h3>
        <p className="text-gray-500 mb-6">Start tracking your cycle to see patterns and insights.</p>
        <a 
          href="/mental-counselor/period-tracker/add"
          className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
        >
          <Droplets className="w-4 h-4" />
          Add Your First Entry
        </a>
      </div>
    );
  }

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditData({
      startDate: entry.startDate ? new Date(entry.startDate).toISOString().split('T')[0] : '',
      endDate: entry.endDate ? new Date(entry.endDate).toISOString().split('T')[0] : '',
      flowLevel: entry.flowLevel || 'normal',
      painLevel: entry.painLevel || 0,
      mood: entry.mood || '',
      symptoms: entry.symptoms || [],
      notes: entry.notes || ''
    });
  };

  const handleSave = async (entryId) => {
    try {
      const PERIOD_STORAGE_KEY = 'mindbridge_period_entries';
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(PERIOD_STORAGE_KEY);
        const entries = stored ? JSON.parse(stored) : [];
        const index = entries.findIndex(entry => (entry.id || entry._id) === entryId);
        
        if (index !== -1) {
          entries[index] = { ...entries[index], ...editData };
          localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(entries));
          setEditingId(null);
          window.location.reload(); // Refresh to show updated data
        } else {
          alert("Failed to update entry");
        }
      }
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry");
    }
  };

  const handleDelete = async (entryId) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const PERIOD_STORAGE_KEY = 'mindbridge_period_entries';
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(PERIOD_STORAGE_KEY);
        const entries = stored ? JSON.parse(stored) : [];
        const filtered = entries.filter(entry => (entry.id || entry._id) !== entryId);
        
        localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(filtered));
        window.location.reload(); // Refresh to remove deleted entry
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const getFlowColor = (flowLevel) => {
    switch (flowLevel) {
      case 'light': return 'bg-blue-100 text-blue-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getPainColor = (painLevel) => {
    if (painLevel <= 3) return 'text-green-600';
    if (painLevel <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-pink-50 border-b border-pink-100">
              <th className="p-4 text-left font-semibold text-pink-800">Start Date</th>
              <th className="p-4 text-left font-semibold text-pink-800">End Date</th>
              <th className="p-4 text-left font-semibold text-pink-800">Flow Level</th>
              <th className="p-4 text-left font-semibold text-pink-800">Pain Level</th>
              <th className="p-4 text-left font-semibold text-pink-800">Mood</th>
              <th className="p-4 text-left font-semibold text-pink-800">Notes</th>
              <th className="p-4 text-left font-semibold text-pink-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={`entry-${entry._id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {editingId === entry._id ? (
                  <>
                    <td className="p-4">
                      <input
                        type="date"
                        value={editData.startDate}
                        onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        value={editData.endDate}
                        onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </td>
                    <td className="p-4">
                      <select
                        value={editData.flowLevel}
                        onChange={(e) => setEditData({...editData, flowLevel: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="light">Light</option>
                        <option value="normal">Normal</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={editData.painLevel}
                        onChange={(e) => setEditData({...editData, painLevel: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={editData.mood}
                        onChange={(e) => setEditData({...editData, mood: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Happy, Tired, etc."
                      />
                    </td>
                    <td className="p-4">
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        rows="2"
                        placeholder="Additional notes..."
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(entry._id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
                          title="Save changes"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {entry.startDate ? new Date(entry.startDate).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">
                        {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFlowColor(entry.flowLevel)}`}>
                        {entry.flowLevel || 'Normal'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`font-medium ${getPainColor(entry.painLevel)}`}>
                        {entry.painLevel || 0}/10
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700">
                        {entry.mood || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-700 max-w-xs truncate" title={entry.notes}>
                        {entry.notes || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                          title="Edit entry"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
