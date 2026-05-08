/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Infrastructure from './pages/Infrastructure';
import Recovery from './pages/Recovery';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import AlertCenter from './pages/AlertCenter';
import Reports from './pages/Reports';
import Login from './pages/auth/Login';
import AIAssistant from './components/layout/AIAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isSupabaseConfigured } from './lib/supabase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, isDemo } = useAuth();
  const location = useLocation();

  // If Supabase is not configured, we allow access for development/demo purposes
  // OR if we are explicitly in demo mode
  if (!isSupabaseConfigured() || isDemo) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      {!isAuthPage && <AIAssistant />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
            <Route path="/infrastructure" element={<ProtectedRoute><Infrastructure /></ProtectedRoute>} />
            <Route path="/recovery" element={<ProtectedRoute><Recovery /></ProtectedRoute>} />
            <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
