import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { WelcomePage } from './features/mobile/welcome/WelcomePage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { PinSetupPage } from './features/auth/pages/PinSetupPage';
import { PinEnterPage } from './features/auth/pages/PinEnterPage';
import { PinResetPage } from './features/auth/pages/PinResetPage';
import { MobileLayout } from './features/mobile/layouts/MobileLayout';
import { FeedPage } from './features/mobile/feed/pages/FeedPage';
import { PostDetailsPage } from './features/mobile/feed/pages/PostDetailsPage';
import { TicketsPage } from './features/mobile/tickets/pages/TicketsPage';
import { TicketDetailsPage } from './features/mobile/tickets/pages/TicketDetailsPage';
import { NewTicketPage } from './features/mobile/tickets/pages/NewTicketPage';
import { EditTicketPage } from './features/mobile/tickets/pages/EditTicketPage';
import { VotesPage } from './features/mobile/votes/pages/VotesPage';
import { VoteDetailsPage } from './features/mobile/votes/pages/VoteDetailsPage';
import { VoteStepPage } from './features/mobile/votes/pages/VoteStepPage';
import { VoteFinishPage } from './features/mobile/votes/pages/VoteFinishPage';
import { ProfilePage } from './features/mobile/profile/pages/ProfilePage';
import { HouseInfoPage } from './features/mobile/profile/pages/HouseInfoPage';
import { NotificationsPage } from './features/mobile/notifications/pages/NotificationsPage';
import { HousesListPage } from './features/uk/houses/pages/HousesListPage';
import { DashboardPage } from './features/uk/dashboard/DashboardPage';
import { authApi } from './features/auth/api';
import { getAccessToken } from './shared/api/client';

const AppInitializer: React.FC = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

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
    } catch {}

    const initAuthFlow = async () => {
      const initData = window.WebApp?.initData;
      const existingToken = getAccessToken();

      if (initData) {
        try {
          const res = await authApi.loginWithMax(initData);
          if (res.needsEsiaAuth) {
            navigate('/auth/login');
          } else if (res.hasPin) {
            navigate('/auth/pin-enter');
          } else {
            navigate('/auth/pin-setup');
          }
          setIsInitializing(false);
          return;
        } catch {}
      }

      if (existingToken) {
        try {
          const raw = localStorage.getItem('current_user');
          if (raw) {
            const u = JSON.parse(raw);
            if (u.role === 'uk_staff') {
              navigate('/uk/houses');
            } else {
              navigate('/auth/pin-enter');
            }
            setIsInitializing(false);
            return;
          }
        } catch {}
      }

      setIsInitializing(false);
      navigate('/welcome');
    };

    initAuthFlow();
  }, [navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<AppInitializer />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/pin-setup" element={<PinSetupPage />} />
        <Route path="/auth/pin-enter" element={<PinEnterPage />} />
        <Route path="/auth/pin-reset" element={<PinResetPage />} />

        <Route path="/feed/:id" element={<PostDetailsPage />} />
        <Route path="/tickets/new" element={<NewTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
        <Route path="/votes/:id" element={<VoteDetailsPage />} />
        <Route path="/votes/:id/step" element={<VoteStepPage />} />
        <Route path="/votes/:id/finish" element={<VoteFinishPage />} />
        <Route path="/profile/house" element={<HouseInfoPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/uk" element={<HousesListPage />} />
        <Route path="/uk/houses" element={<HousesListPage />} />
        <Route path="/uk/dashboard" element={<DashboardPage />} />

        <Route element={<MobileLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/votes" element={<VotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;