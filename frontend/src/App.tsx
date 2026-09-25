import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './features/mobile/welcome/WelcomePage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { PinSetupPage } from './features/auth/pages/PinSetupPage';
import { PinEnterPage } from './features/auth/pages/PinEnterPage';
import { PinResetPage } from './features/auth/pages/PinResetPage';
import { MobileLayout } from './features/mobile/layouts/MobileLayout';
import { FeedPage } from './features/mobile/feed/pages/FeedPage';
import { PostDetailsPage } from './features/mobile/feed/pages/PostDetailsPage';
import { TicketsPage } from './features/mobile/tickets/pages/TicketsPage';
import { NewTicketPage } from './features/mobile/tickets/pages/NewTicketPage';

export const App: React.FC = () => {
  useEffect(() => {
    try {
      if (window.WebApp) {
        if (typeof window.WebApp.ready === 'function') {
          window.WebApp.ready();
        }
        if (typeof window.WebApp.expand === 'function') {
          window.WebApp.expand();
        }
      }
    } catch (err) {
      console.warn('[MAX Bridge] Инициализация вне нативного клиента:', err);
    }
  }, []);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/pin-setup" element={<PinSetupPage />} />
        <Route path="/auth/pin-enter" element={<PinEnterPage />} />
        <Route path="/auth/pin-reset" element={<PinResetPage />} />
        <Route path="/feed/:id" element={<PostDetailsPage />} />
        <Route path="/tickets/new" element={<NewTicketPage />} />
        <Route element={<MobileLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/votes" element={<div className="p-6 text-center text-slate-500">Раздел «Опросы»</div>} />
          <Route path="/profile" element={<div className="p-6 text-center text-slate-500">Раздел «Профиль»</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;