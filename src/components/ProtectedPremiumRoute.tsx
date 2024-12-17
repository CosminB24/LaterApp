import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedPremiumRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.isPremium;

  // Verifică dacă utilizatorul încearcă să acceseze /premium/benefits
  if (!isPremium && window.location.pathname === '/premium/benefits') {
    return <Navigate to="/premium" />; // Redirecționează utilizatorii non-Premium
  }

  // Verifică dacă utilizatorul încearcă să acceseze /premium
  if (isPremium && window.location.pathname === '/premium') {
    return <Navigate to="/premium/benefits" />; // Redirecționează utilizatorii Premium
  }

  return <>{children}</>; // Permite accesul la copii (children) dacă utilizatorul are acces
};

export default ProtectedPremiumRoute;