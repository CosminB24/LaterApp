import React from 'react';
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
  const dayTasks = tasks.filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => a.time.localeCompare(b.time));

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
              <div key={task.id} className="task-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {task.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="btn-icon text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="btn-icon text-gray-500 hover:text-red-600 hover:bg-red-50"
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
        selectedTask={dayTasks.length > 0 ? dayTasks[0] : null}
      />
    </div>
  );
}