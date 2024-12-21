import React from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { FcGoogle } from 'react-icons/fc';

export default function SocialButtons() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  
  const handleGoogleAuth = async () => {
    try {
      const authMethod = window.location.pathname === '/login' ? signIn : signUp;
      
      if (!authMethod) return;
      
      await authMethod.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "http://localhost:3000/sso-callback",
        redirectUrlComplete: "http://localhost:3000/dashboard"
      });
    } catch (err) {
      console.error('Eroare la autentificarea cu Google:', err);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
    >
      <FcGoogle className="w-5 h-5" />
      Continuă cu Google
    </button>
  );
} 