import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from './features/mobile/welcome/WelcomePage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { PinSetupPage } from './features/auth/pages/PinSetupPage';
import { PinEnterPage } from './features/auth/pages/PinEnterPage';
import { PinResetPage } from './features/auth/pages/PinResetPage';

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

         
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;