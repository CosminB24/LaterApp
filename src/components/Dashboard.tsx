import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Calendar from './Calendar';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Task } from '../types';
import { taskService } from '../services/taskService';
import SearchBar from './SearchBar';

export default function Dashboard() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const userTasks = await taskService.getTasks(user.id);
        setTasks(userTasks);
      } catch (error) {
        console.error('Eroare la încărcarea task-urilor:', error);
        setError('Nu am putut încărca task-urile. Te rugăm să încerci din nou.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user?.id]);

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'userId'>[]) => {
    if (!user?.id) return;
    
    try {
      console.log('Saving tasks for user:', user.id);
      
      if (editingTask) {
        await taskService.updateTask(editingTask.id, {
          ...taskData[0],
          userId: user.id
        });
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === editingTask.id ? { ...task, ...taskData[0] } : task
          )
        );
      } else {
        const newTasks = await Promise.all(
          taskData.map(task => taskService.addTask(user.id, task))
        );
        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      }
      
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Eroare la salvarea task-urilor:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      // Optimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      await taskService.deleteTask(taskId);
    } catch (error) {
      // Revert în caz de eroare
      console.error('Eroare la ștergerea task-ului:', error);
      const deletedTask = tasks.find(task => task.id === taskId);
      if (deletedTask) {
        setTasks(prevTasks => [...prevTasks, deletedTask]);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline"
        >
          Reîncearcă
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-hidden dark:bg-gray-900">
      <div className="mb-6">
        <SearchBar
          tasks={tasks}
          onTaskSelect={(task) => {
            setSelectedDate(new Date(task.date));
            // Găsim referința la TaskList și setăm task-ul selectat
            const taskListRef = document.querySelector('[data-component="task-list"]');
            if (taskListRef) {
              taskListRef.dispatchEvent(
                new CustomEvent('selectTask', { detail: task })
              );
            }
          }}
        />
      </div>

      <div className="flex gap-6">
        <div className="w-[400px]">
          <Calendar
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onDateSelect={setSelectedDate}
            tasks={tasks}
            onPrevMonth={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            onNextMonth={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
          />
        </div>

        <div className="flex-1 max-w-3xl">
          <TaskList
            data-component="task-list"
            selectedDate={selectedDate}
            tasks={filteredTasks}
            onAddTask={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        selectedDate={selectedDate}
        editingTask={editingTask || undefined}
      />
    </div>
  );
} 