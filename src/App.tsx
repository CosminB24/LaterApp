import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import Premium from './components/Premium';
import UserProfile from './components/UserProfile';
import SuccessPage from './pages/SuccessPage';
import ProtectedSuccessRoute from './components/ProtectedSuccessRoute';
import PremiumBenefits from './components/PremiumBenefits';
import ProtectedPremiumRoute from './components/ProtectedPremiumRoute';
import ProtectedNonPremiumRoute from './components/ProtectedNonPremiumRoute';
import emailjs from '@emailjs/browser';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Lipsește cheia publică Clerk");
}

function App() {
  const [selected, setSelected] = useState('dashboard');

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <SignedIn>
          <div className="flex">
            <Navigation selected={selected} setSelected={setSelected} />
            <main className="flex-1 ml-64">
              <Routes>
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/premium"
                  element={
                    <ProtectedNonPremiumRoute>
                      <Premium />
                    </ProtectedNonPremiumRoute>
                  }
                />
                <Route
                  path="/premium/benefits"
                  element={
                    <ProtectedPremiumRoute>
                      <PremiumBenefits />
                    </ProtectedPremiumRoute>
                  }
                />
                <Route
                  path="/premium/success"
                  element={
                    <ProtectedSuccessRoute>
                      <SuccessPage />
                    </ProtectedSuccessRoute>
                  }
                />
                <Route 
                  path="/user-profile" 
                  element={<UserProfile />} 
                />
              </Routes>
            </main>
          </div>
        </SignedIn>
        
        <SignedOut>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<RedirectToSignIn />} />
          </Routes>
        </SignedOut>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;