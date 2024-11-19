import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';
import { format, addDays, addWeeks, getDay, isWeekend } from 'date-fns';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tasks: Omit<Task, 'id' | 'userId'>[]) => void;
  selectedDate: Date;
  editingTask?: Task;
}

export default function TaskForm({ isOpen, onClose, onSave, selectedDate, editingTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const [description, setDescription] = useState('');
  
  // Stări noi pentru funcționalitățile de repetiție
  const [isWeeklyRepeat, setIsWeeklyRepeat] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setTime(editingTask.time);
      setDescription(editingTask.description || '');
      // Resetăm opțiunile de repetiție când edităm un task existent
      setIsWeeklyRepeat(false);
      setIsRecurring(false);
      setExcludeWeekends(false);
      setNumberOfWeeks(1);
    } else {
      setTitle('');
      setTime('12:00');
      setDescription('');
    }
  }, [editingTask]);

  // Adăugăm un nou useEffect pentru a reseta formularul când se închide
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setTime('12:00');
      setDescription('');
      setIsWeeklyRepeat(false);
      setExcludeWeekends(false);
      setIsRecurring(false);
      setNumberOfWeeks(1);
    }
  }, [isOpen]);

  const generateTasks = () => {
    const tasks: Omit<Task, 'id'>[] = [];
    const baseTask = {
      title,
      time,
      description,
      date: format(selectedDate, 'yyyy-MM-dd'),
    };

    if (!isWeeklyRepeat && !isRecurring) {
      // Task simplu, fără repetiție
      return [baseTask];
    }

    if (isWeeklyRepeat) {
      // Generăm task-uri pentru fiecare zi a săptămânii
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(selectedDate, i);
        if (excludeWeekends && isWeekend(currentDate)) {
          continue;
        }
        tasks.push({
          ...baseTask,
          date: format(currentDate, 'yyyy-MM-dd'),
        });
      }
    } else if (isRecurring) {
      // Generăm task-uri pentru numărul specificat de săptămâni
      const dayOfWeek = getDay(selectedDate);
      for (let i = 0; i < numberOfWeeks; i++) {
        const currentDate = addWeeks(selectedDate, i);
        tasks.push({
          ...baseTask,
          date: format(currentDate, 'yyyy-MM-dd'),
        });
      }
    }

    return tasks;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tasks = generateTasks();
    onSave(tasks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {editingTask ? 'Editează sarcina' : 'Sarcină nouă'}
            </h2>
            <button
              onClick={onClose}
              className="btn-icon text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titlu
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 dark:bg-gray-700 dark:text-white"
              placeholder="Adaugă un titlu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Opțiuni noi pentru repetiție */}
          {!editingTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isWeeklyRepeat}
                    onChange={(e) => {
                      setIsWeeklyRepeat(e.target.checked);
                      if (e.target.checked) setIsRecurring(false);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Repetă în această săptămână
                  </span>
                </label>
              </div>

              {isWeeklyRepeat && (
                <div className="ml-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={excludeWeekends}
                      onChange={(e) => setExcludeWeekends(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Exclude weekend-urile
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => {
                      setIsRecurring(e.target.checked);
                      if (e.target.checked) setIsWeeklyRepeat(false);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Repetă săptămânal
                  </span>
                </label>
              </div>

              {isRecurring && (
                <div className="ml-6">
                  <label className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Număr de săptămâni:
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="52"
                      value={numberOfWeeks}
                      onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 dark:bg-gray-700 dark:text-white"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descriere (opțional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 resize-none dark:bg-gray-700 dark:text-white"
              placeholder="Adaugă o descriere..."
            />
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-2.5"
          >
            {editingTask ? 'Salvează modificările' : 'Adaugă sarcina'}
          </button>
        </form>
      </div>
    </div>
  );
}