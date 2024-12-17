import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedNonPremiumRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.isPremium;

  if (isPremium) {
    return <Navigate to="/premium/benefits" />;
  }

  if (!isPremium && window.location.pathname === '/premium/benefits') {
    return <Navigate to="/premium" />;
  }

  return <>{children}</>;
};

export default ProtectedNonPremiumRoute;