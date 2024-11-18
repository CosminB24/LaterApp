import React from 'react';
import { Calendar } from 'lucide-react';
import laterLogo from '../assets/later_logo.png';

export default function Navigation() {
  return (
    <nav className="w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
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
    </nav>
  );
}