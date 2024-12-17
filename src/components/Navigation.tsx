import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Crown } from 'lucide-react';
import laterLogo from '../assets/later_logo.png';
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { userService } from '../services/userService';

interface NavigationProps {
  selected: string;
  setSelected: (value: string) => void;
}

export default function Navigation({ selected, setSelected }: NavigationProps) {
  const { signOut, user } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const checkPremiumStatus = async () => {
    if (user?.id) {
      try {
        console.log('Verificare status premium pentru user:', user.id);
        const status = await userService.getUserPremiumStatus(user.id);
        console.log('Status premium primit:', status);
        setIsPremium(status);
      } catch (error) {
        console.error('Eroare la verificarea statusului premium:', error);
      }
    }
  };

  // Verifică la montarea componentei
  useEffect(() => {
    checkPremiumStatus();
  }, [user?.id]);

  // Verifică la fiecare 5 secunde
  useEffect(() => {
    const interval = setInterval(() => {
      checkPremiumStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Verifică la schimbarea rutei
  useEffect(() => {
    checkPremiumStatus();
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path === 'dashboard') setSelected('dashboard');
    else if (path === 'premium' || path === 'premium/benefits') setSelected('premium');
    else if (path === 'user-profile') setSelected('user-profile');
  }, [location.pathname, setSelected]);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handlePremiumClick = () => {
    if (isPremium) {
      navigate('/premium/benefits');
    } else {
      navigate('/premium');
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={laterLogo} 
              alt="Later Logo"
              className="w-8 h-8"
            />
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Later
              </span>
              {isPremium && (
                <Crown className="ml-2 w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <button 
              onClick={() => { navigate('/dashboard'); setSelected('dashboard'); }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                selected === 'dashboard' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-lg`}
            >
              <Calendar className="w-5 h-5" />
              Calendar
            </button>
            
            <button 
              onClick={handlePremiumClick}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                selected === 'premium' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-lg`}
            >
              <Crown className="w-5 h-5" />
              Premium
            </button>
          </div>
        </div>

        {/* Footer cu Avatar, Notificări și Dark Mode */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center justify-between">
            {/* Avatar și Nume Utilizator */}
            <button 
              onClick={() => { navigate('/user-profile'); setSelected('user-profile'); }}
              className={`flex items-center gap-3 text-sm font-medium ${
                selected === 'user-profile' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
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