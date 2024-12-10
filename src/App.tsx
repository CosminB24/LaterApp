import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import Premium from './components/Premium';
import UserProfile from './components/UserProfile';
import SuccessPage from './pages/SuccessPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Lipsește cheia publică Clerk");
}

function App() {
  const [selected, setSelected] = useState('dashboard');

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <div className="flex">
          <Navigation selected={selected} setSelected={setSelected} />
          <main className="flex-1 ml-64">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <>
                    <SignedIn>
                      <Dashboard />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/premium"
                element={
                  <>
                    <SignedIn>
                      <Premium />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/premium/success" element={<SuccessPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;