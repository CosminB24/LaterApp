import React, { useState } from 'react';
import { Calendar, Bell } from 'lucide-react';
import laterLogo from '../assets/later_logo.png';
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function Navigation() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={laterLogo} 
              alt="Later Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Later</span>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <Calendar className="w-5 h-5" />
              Calendar
            </button>
          </div>
        </div>

        {/* Footer cu Avatar, Notificări și Dark Mode */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Avatar și Nume Utilizator */}
            <button 
              onClick={() => navigate('/user-profile')}
              className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <img
                src={user?.imageUrl}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span>{user?.fullName}</span>
            </button>

            {/* Notificări și Dark Mode */}
            <div className="flex items-center gap-2">
              <button className="btn-icon text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Bell className="w-5 h-5" />
              </button>
              <DarkModeSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={20}
                sunColor="#F59E0B"
                moonColor="#6366F1"
              />
            </div>
          </div>

          {/* Buton Deconectare */}
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50"
          >
            <LogoutIcon className="w-5 h-5" />
            Deconectare
          </button>
        </div>
      </div>
    </nav>
  );
}