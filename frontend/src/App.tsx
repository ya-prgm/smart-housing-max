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
import { VotesPage } from './features/mobile/votes/pages/VotesPage';
import { VoteDetailsPage } from './features/mobile/votes/pages/VoteDetailsPage';
import { VoteStepPage } from './features/mobile/votes/pages/VoteStepPage';
import { VoteFinishPage } from './features/mobile/votes/pages/VoteFinishPage';
import { ProfilePage } from './features/mobile/profile/pages/ProfilePage';
import { HouseInfoPage } from './features/mobile/profile/pages/HouseInfoPage';
import { NotificationsPage } from './features/mobile/notifications/pages/NotificationsPage';
import { HousesListPage } from './features/uk/houses/pages/HousesListPage';
import { DashboardPage } from './features/uk/dashboard/DashboardPage';

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
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;