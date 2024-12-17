import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { userService } from '../services/userService';
import { Crown } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log('SuccessPage mounted, sessionId:', sessionId);

    if (!sessionId) {
      console.log('Nu există session_id, redirectare către /premium');
      navigate('/premium');
      return;
    }

    const setPremiumStatus = async () => {
      if (user?.id) {
        try {
          console.log('Încercare de setare status premium pentru userId:', user.id);
          
          await userService.createUser(user.id, {
            isPremium: true,
            premiumSince: new Date().toISOString(),
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName
          });

          console.log('Status premium setat cu succes');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } catch (error) {
          console.error('Eroare la setarea statusului premium:', error);
          navigate('/premium');
        }
      }
    };

    setPremiumStatus();
  }, [user, navigate, sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Felicitări! Acum ești membru Premium!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Îți mulțumim pentru upgrade-ul la Premium. Vei fi redirecționat automat...
          </p>
        </div>
      </div>
    </div>
  );
}