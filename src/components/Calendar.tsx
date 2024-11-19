import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addYears, subYears, setYear, setMonth } from 'date-fns';
import { Task } from '../types';
import { ro } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function Calendar({ selectedDate, currentMonth, onDateSelect, tasks, onPrevMonth, onNextMonth }: CalendarProps) {
  const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => isSameDay(new Date(task.date), date));
  };

  const MIN_DATE = new Date(2023, 8); // Septembrie 2023
  const MAX_DATE = new Date(2040, 11); // Decembrie 2040

  const handleMonthSelect = (month: number, year: number) => {
    const newDate = new Date(year, month);
    if (newDate >= MIN_DATE && newDate <= MAX_DATE) {
      onDateSelect(newDate);
      setShowYearMonthPicker(false);
    }
  };

  const WEEKDAYS = [
    { key: 'sun', label: 'D' },
    { key: 'mon', label: 'L' },
    { key: 'tue', label: 'M' },
    { key: 'wed', label: 'M' },
    { key: 'thu', label: 'J' },
    { key: 'fri', label: 'V' },
    { key: 'sat', label: 'S' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy', { locale: ro })}
          </h2>
          <button
            onClick={() => setShowYearMonthPicker(!showYearMonthPicker)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <CalendarIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            disabled={isSameMonth(currentMonth, MIN_DATE)}
            className={`btn-icon hover:bg-gray-100 ${
              isSameMonth(currentMonth, MIN_DATE) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextMonth}
            disabled={isSameMonth(currentMonth, MAX_DATE)}
            className={`btn-icon hover:bg-gray-100 ${
              isSameMonth(currentMonth, MAX_DATE) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showYearMonthPicker && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i}
                onClick={() => handleMonthSelect(i, currentMonth.getFullYear())}
                className={`p-2 text-sm rounded-lg hover:bg-gray-100 ${
                  currentMonth.getMonth() === i ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {format(new Date(2024, i, 1), 'MMM', { locale: ro })}
              </button>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => handleMonthSelect(
                  currentMonth.getMonth(),
                  currentMonth.getFullYear() - 1
                )}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium">
                {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() => handleMonthSelect(
                  currentMonth.getMonth(),
                  currentMonth.getFullYear() + 1
                )}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {Array.from(
                { length: 2041 - 2023 },
                (_, i) => 2023 + i
              ).map(year => (
                <button
                  key={year}
                  onClick={() => handleMonthSelect(currentMonth.getMonth(), year)}
                  className={`p-2 text-sm rounded-lg hover:bg-gray-100 ${
                    currentMonth.getFullYear() === year ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-4 mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day.key} className="text-center text-sm font-medium text-gray-500">
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => {
          const hasTasks = hasTasksOnDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={`${format(day, 'd')}-${idx}`}
              onClick={() => onDateSelect(day)}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} 
                         ${isSelected ? 'selected' : ''} 
                         ${isCurrentDay ? 'today' : ''}`}
            >
              <span className="relative">
                {format(day, 'd')}
                {hasTasks && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}