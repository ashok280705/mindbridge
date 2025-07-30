
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function PeriodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('periodEntries') || '[]');
    setEntries(savedEntries);
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getPeriodDays = () => {
    const periodDays = new Set();
    entries.forEach(entry => {
      const startDate = new Date(entry.startDate);
      const endDate = entry.endDate ? new Date(entry.endDate) : startDate;
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        periodDays.add(formatDateKey(d));
      }
    });
    return periodDays;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const periodDays = getPeriodDays();
    
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header
    days.push(
      <div key="header" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );

    // Day names
    days.push(
      <div key="daynames" className="grid grid-cols-7 bg-gray-100">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
    );

    // Calendar grid
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const calendarDays = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      
      if (isCurrentMonth) {
        const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        const dateKey = formatDateKey(cellDate);
        const isPeriodDay = periodDays.has(dateKey);
        const isToday = dateKey === formatDateKey(new Date());
        const isSelected = selectedDate && dateKey === formatDateKey(selectedDate);

        calendarDays.push(
          <div
            key={i}
            className={`
              relative p-3 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 min-h-[60px]
              ${isPeriodDay ? 'bg-red-100' : 'bg-white'}
              ${isToday ? 'ring-2 ring-blue-500' : ''}
              ${isSelected ? 'bg-blue-100' : ''}
            `}
            onClick={() => setSelectedDate(cellDate)}
          >
            <div className={`
              text-sm font-medium
              ${isPeriodDay ? 'text-red-700' : 'text-gray-900'}
              ${isToday ? 'font-bold' : ''}
            `}>
              {dayNumber}
            </div>
            {isPeriodDay && (
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            {isToday && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        );
      } else {
        calendarDays.push(
          <div key={i} className="p-3 border-r border-b border-gray-200 bg-gray-50 min-h-[60px]">
            <div className="text-sm text-gray-400">
              {dayNumber <= 0 
                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).getDate()
                : dayNumber - daysInMonth
              }
            </div>
          </div>
        );
      }
    }

    days.push(
      <div key="calendar" className="grid grid-cols-7">
        {calendarDays}
      </div>
    );

    return days;
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;

    const dateKey = formatDateKey(selectedDate);
    const entry = entries.find(entry => {
      const startDate = new Date(entry.startDate);
      const endDate = entry.endDate ? new Date(entry.endDate) : startDate;
      return selectedDate >= startDate && selectedDate <= endDate;
    });

    return { dateKey, entry };
  };

  const selectedInfo = getSelectedDateInfo();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 text-indigo-600" />
          Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
            <span className="text-sm">Period Days</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">Period Marker</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">Today</span>
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          {selectedInfo?.entry ? (
            <div className="space-y-2">
              <p><strong>Flow Level:</strong> {selectedInfo.entry.flowLevel}</p>
              <p><strong>Pain Level:</strong> {selectedInfo.entry.painLevel}/10</p>
              {selectedInfo.entry.notes && (
                <p><strong>Notes:</strong> {selectedInfo.entry.notes}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No period data for this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
