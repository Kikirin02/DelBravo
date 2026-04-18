/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FloatingConcierge } from './components/FloatingConcierge';
import { Header } from './components/Header';
import { useAuth } from './lib/auth';
import { Login } from './components/Login';
import Dashboard from './pages/Dashboard';
import Pedimentos from './pages/Pedimentos';
import Tracking from './pages/Tracking';
import AIAssistant from './pages/AIAssistant';
import Catalog from './pages/Catalog';
import Reminders from './pages/Reminders';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* Navigation Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 lg:p-10 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pedimentos" element={<Pedimentos />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/reminders" element={<Reminders />} />
              {user.role === 'JEFE' && <Route path="/assistant" element={<AIAssistant />} />}
              <Route path="/catalog" element={<Catalog />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        {/* Global Floating Assistant - Jefe Only */}
        {user.role === 'JEFE' && <FloatingConcierge />}
      </div>
    </BrowserRouter>
  );
}
