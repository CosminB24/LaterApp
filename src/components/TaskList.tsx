import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, Clock, Search, Bell, Check } from 'lucide-react';
import { Task } from '../types';
import WeatherWidget from './WeatherWidget';
import NotificationModal from './NotificationModal';
import VoiceInput from './VoiceInput';

interface TaskListProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  tasks: Task[];
  onAddTask: () => void;
  onCreateTask: (taskData: { date: string; time: string; title: string }) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpdateNotifications: (taskId: string, notifications: TaskNotification) => void;
  onUpdateTaskStatus: (taskId: string, completed: boolean) => void;
}

export default function TaskList({ 
  selectedDate, 
  setSelectedDate, 
  tasks, 
  onAddTask, 
  onCreateTask, 
  onEditTask, 
  onDeleteTask,
  searchQuery,
  onSearchChange,
  onUpdateNotifications,
  onUpdateTaskStatus
}: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState<string | null>(null);
  
  const dayTasks = tasks
    .filter(task => task.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => {
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

  const completedPercentage = dayTasks.length > 0
    ? Math.round((dayTasks.filter(task => task.completed).length / dayTasks.length) * 100)
    : 0;

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

  const handleNotificationSave = (taskId: string, notifications: TaskNotification) => {
    onUpdateNotifications(taskId, notifications);
    setShowNotificationsModal(null);
  };

  const handleVoiceInput = (taskData: { date: string; time: string; title: string }) => {
    setSelectedDate(new Date(taskData.date));
    onCreateTask(taskData);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {format(selectedDate, 'dd MMMM yyyy')}
            </h2>
            {dayTasks.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${completedPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedPercentage}%
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <VoiceInput onVoiceInput={handleVoiceInput} />
            <button
              onClick={onAddTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Adaugă task
            </button>
          </div>
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
                  className={`p-3 rounded-lg border transition-all duration-200 w-[95%] mx-auto mb-3 last:mb-0 ${
                    task.completed 
                      ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
                      : selectedTask?.id === task.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200 dark:border-blue-800 dark:bg-blue-900/30' 
                        : 'bg-white border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          task.completed 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {task.time}
                        </span>
                        <h3 className={`text-sm font-medium ${
                          task.completed 
                            ? 'text-gray-400 dark:text-gray-500 line-through' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className={`text-xs mt-0.5 transition-all duration-200 ${
                          task.completed 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-gray-600 dark:text-gray-400'
                        } ${
                          selectedTask?.id === task.id 
                            ? 'line-clamp-none' 
                            : 'line-clamp-1'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateTaskStatus(task.id, !task.completed);
                        }}
                        className={`p-1.5 rounded-md transition-colors ${
                          task.completed
                            ? 'text-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowNotificationsModal(task.id);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Bell className={`w-3.5 h-3.5 ${
                          task.notifications?.enabled ? 'text-blue-500' : ''
                        }`} />
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

      {showNotificationsModal && (
        <NotificationModal
          isOpen={true}
          onClose={() => setShowNotificationsModal(null)}
          onSave={(notifications) => 
            handleNotificationSave(showNotificationsModal, notifications)
          }
          currentNotifications={
            tasks.find(t => t.id === showNotificationsModal)?.notifications
          }
        />
      )}
    </div>
  );
}