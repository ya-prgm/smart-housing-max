import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '../../features/mobile/welcome/WelcomePage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PinSetupPage } from '../../features/auth/pages/PinSetupPage';
import { PinEnterPage } from '../../features/auth/pages/PinEnterPage';
import { MobileLayout } from '../../features/mobile/layouts/MobileLayout';
import { FeedPage } from '../../features/mobile/feed/pages/FeedPage';
import { PostDetailsPage } from '../../features/mobile/feed/pages/PostDetailsPage';
import { TicketsPage } from '../../features/mobile/tickets/pages/TicketsPage';
import { NewTicketPage } from '../../features/mobile/tickets/pages/NewTicketPage';
import { TicketDetailsPage } from '../../features/mobile/tickets/pages/TicketDetailsPage';
import { VotesPage } from '../../features/mobile/votes/pages/VotesPage';
import { VoteDetailsPage } from '../../features/mobile/votes/pages/VoteDetailsPage';
import { VoteStepPage } from '../../features/mobile/votes/pages/VoteStepPage';
import { VoteFinishPage } from '../../features/mobile/votes/pages/VoteFinishPage';
import { ProfilePage } from '../../features/mobile/profile/pages/ProfilePage';
import { HouseInfoPage } from '../../features/mobile/profile/pages/HouseInfoPage';
import { UtilityPage } from '../../features/mobile/profile/pages/UtilityPage';
import { SettingsPage } from '../../features/mobile/profile/pages/SettingsPage';
import { NotificationsPage } from '../../features/mobile/notifications/pages/NotificationsPage';
import { Spinner } from '../../shared/ui/Spinner';
import { useAuth } from '../../shared/hooks/useAuth';

const UkRoutes = lazy(() => import('../../features/uk/routes'));

const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  if (user?.role === 'uk_staff') {
    return <Navigate to="/uk/dashboard" replace />;
  }

  return <Navigate to="/feed" replace />;
};

export const RootRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/pin-setup" element={<PinSetupPage />} />
        <Route path="/auth/pin-enter" element={<PinEnterPage />} />

        <Route path="/feed/:id" element={<PostDetailsPage />} />
        <Route path="/tickets/new" element={<NewTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />
        <Route path="/votes/:id" element={<VoteDetailsPage />} />
        <Route path="/votes/:id/step" element={<VoteStepPage />} />
        <Route path="/votes/:id/finish" element={<VoteFinishPage />} />
        <Route path="/profile/house" element={<HouseInfoPage />} />
        <Route path="/profile/utility" element={<UtilityPage />} />
        <Route path="/utility" element={<UtilityPage />} />
        <Route path="/profile/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route element={<MobileLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/votes" element={<VotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/uk/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-100">
                  <Spinner size="lg" />
                </div>
              }
            >
              <UkRoutes />
            </Suspense>
          }
        />

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};