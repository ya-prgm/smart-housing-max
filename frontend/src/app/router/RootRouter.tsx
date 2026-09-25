import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomePage } from '../../features/mobile/welcome/WelcomePage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { PinSetupPage } from '../../features/auth/pages/PinSetupPage';
import { PinEnterPage } from '../../features/auth/pages/PinEnterPage';
import { MobileLayout } from '../../features/mobile/layouts/MobileLayout';
import { FeedPage } from '../../features/mobile/feed/pages/FeedPage';
import { PostDetailsPage } from '../../features/mobile/feed/pages/PostDetailsPage';

const TicketsStub = () => (
  <div className="p-6 text-center mt-10">
    <h2 className="text-xl font-bold mb-2">Обращения и заявки</h2>
    <p className="text-slate-500 text-sm">Список ваших заявок в УК и РСО</p>
  </div>
);

const VotesStub = () => (
  <div className="p-6 text-center mt-10">
    <h2 className="text-xl font-bold mb-2">Опросы собственников</h2>
    <p className="text-slate-500 text-sm">Голосования по дому</p>
  </div>
);

const ProfileStub = () => (
  <div className="p-6 text-center mt-10">
    <h2 className="text-xl font-bold mb-2">Профиль жильца</h2>
    <p className="text-slate-500 text-sm">ул. Баумана, д. 12, кв. 48</p>
  </div>
);

export const RootRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/pin-setup" element={<PinSetupPage />} />
        <Route path="/auth/pin-enter" element={<PinEnterPage />} />
        <Route path="/feed/:id" element={<PostDetailsPage />} />
        <Route element={<MobileLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/tickets" element={<TicketsStub />} />
          <Route path="/votes" element={<VotesStub />} />
          <Route path="/profile" element={<ProfileStub />} />
        </Route>
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
};