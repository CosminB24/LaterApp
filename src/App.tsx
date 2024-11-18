import React, { useState } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { Calendar as CalendarIcon, Sun, Moon, Bell } from 'lucide-react';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Navigation from './components/Navigation';
import { Task } from './types';
import { ro } from 'date-fns/locale';
import WeatherWidget from './components/WeatherWidget';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...taskData, id: task.id } : task
      ));
    } else {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(date);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Navigation />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: ro })}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    Bine ai revenit, Cosmin 👋
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l dark:border-gray-700">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                </div>
              </header>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Calendar
                    selectedDate={selectedDate}
                    currentMonth={currentMonth}
                    onDateSelect={handleDateSelect}
                    tasks={tasks}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                  />
                </div>
                
                <div>
                  <TaskList
                    selectedDate={selectedDate}
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </div>
              </div>
            </div>

            <TaskForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveTask}
              selectedDate={selectedDate}
              editingTask={editingTask}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;