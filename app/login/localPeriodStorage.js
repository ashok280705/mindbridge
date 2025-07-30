const PERIOD_STORAGE_KEY = 'mindbridge_period_entries';

export const periodStorage = {
  // Get all period entries
  getEntries: () => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(PERIOD_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading period entries:', error);
      return [];
    }
  },

  // Save a new period entry
  saveEntry: (entry) => {
    if (typeof window === 'undefined') return false;
    try {
      const entries = periodStorage.getEntries();
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      entries.push(newEntry);
      localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(entries));
      return newEntry;
    } catch (error) {
      console.error('Error saving period entry:', error);
      return false;
    }
  },

  // Update an existing entry
  updateEntry: (entryId, updates) => {
    if (typeof window === 'undefined') return false;
    try {
      const entries = periodStorage.getEntries();
      const index = entries.findIndex(entry => entry.id === entryId);
      if (index !== -1) {
        entries[index] = { ...entries[index], ...updates };
        localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(entries));
        return entries[index];
      }
      return false;
    } catch (error) {
      console.error('Error updating period entry:', error);
      return false;
    }
  },

  // Delete an entry
  deleteEntry: (entryId) => {
    if (typeof window === 'undefined') return false;
    try {
      const entries = periodStorage.getEntries();
      const filtered = entries.filter(entry => entry.id !== entryId);
      localStorage.setItem(PERIOD_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting period entry:', error);
      return false;
    }
  },

  // Get basic stats
  getStats: () => {
    const entries = periodStorage.getEntries();
    return {
      totalEntries: entries.length,
      recentEntries: entries.slice(-3).reverse()
    };
  },

  savePeriodEntry: (entry) => {
    if (typeof window === 'undefined') return null;

    try {
      const existingEntries = periodStorage.getEntries();
      const newEntry = {
        ...entry,
        _id: Date.now().toString(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userId: entry.userId || "1234567890"
      };

      const updatedEntries = [...existingEntries, newEntry];
      localStorage.setItem('periodEntries', JSON.stringify(updatedEntries));

      // Also trigger a custom event for real-time updates
      window.dispatchEvent(new CustomEvent('periodEntryAdded', { detail: newEntry }));

      return newEntry;
    } catch (error) {
      console.error('Error saving period entry:', error);
      return null;
    }
  }
};