import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Clock, Search } from 'lucide-react';
import { Task } from '../types';
import WeatherWidget from './WeatherWidget';

interface TaskListProps {
  selectedDate: Date;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TaskList({ 
  selectedDate, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  searchQuery,
  onSearchChange
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const dayTasks = tasks
    .filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

  useEffect(() => {
    const handleTaskSelect = (event: CustomEvent<Task>) => {
      setSelectedTask(event.detail);
    };

    const element = document.querySelector('[data-component="task-list"]');
    element?.addEventListener('selectTask', handleTaskSelect as EventListener);

    return () => {
      element?.removeEventListener('selectTask', handleTaskSelect as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {format(selectedDate, 'dd MMMM yyyy')}
          </h2>
          <button
            onClick={onAddTask}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adaugă
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mb-4 stroke-1" />
            <p className="text-center">
              Nu ai nimic programat în această zi
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto pr-2">
            <div className="py-1.5">
              {dayTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-lg border transition-all w-[95%] mx-auto mb-3 last:mb-0 ${
                    selectedTask?.id === task.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200 dark:border-blue-800 dark:bg-blue-900/30' 
                      : 'bg-white border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {task.time}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md dark:hover:bg-blue-900/50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md dark:hover:bg-red-900/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <WeatherWidget 
        selectedDate={selectedDate}
        selectedTask={selectedTask}
      />
    </div>
  );
}