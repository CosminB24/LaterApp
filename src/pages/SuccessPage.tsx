import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';
import { Crown } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const setPremiumStatus = async () => {
      if (user?.id) {
        try {
          await userService.setPremiumStatus(user.id, true);
        } catch (error) {
          console.error('Eroare la setarea statusului premium:', error);
        }
      }
    };

    setPremiumStatus();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Felicitări! Ești acum membru Premium!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Îți mulțumim pentru upgrade-ul la Premium. Bucură-te de toate beneficiile!
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Înapoi la Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}