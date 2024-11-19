import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { Task } from '../types';
import WeatherWidget from './WeatherWidget';

interface TaskListProps {
  selectedDate: Date;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({ selectedDate, tasks, onAddTask, onEditTask, onDeleteTask }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const dayTasks = tasks
    .filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
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
          <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
            {dayTasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 rounded-xl bg-blue-50/50 border border-blue-100 dark:border-blue-800/50 dark:bg-blue-900/10 cursor-pointer transition-all ${
                  selectedTask?.id === task.id 
                    ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30' 
                    : 'hover:bg-blue-100/50 dark:hover:bg-blue-900/20'
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
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
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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