import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { DesktopLayout } from './layouts/DesktopLayout';
import { DashboardPage } from './dashboard/DashboardPage';
import { HousesListPage } from './houses/pages/HousesListPage';
import { HouseDetailsPage } from './houses/pages/HouseDetailsPage';
import { TicketsTablePage } from './tickets/pages/TicketsTablePage';
import { ResidentsPage } from './residents/pages/ResidentsPage';
import { VotesListPage } from './votes/pages/VotesListPage';
import { VoteEditorPage } from './votes/pages/VoteEditorPage';
import { FeedEditorPage } from './feed/pages/FeedEditorPage';
import { DocumentsPage } from './documents/pages/DocumentsPage';
import { SettingsPage } from './settings/pages/SettingsPage';

export const UkRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="houses" element={<HousesListPage />} />
      <Route path="houses/:id" element={<HouseDetailsPage />} />
      
      <Route element={<DesktopLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="house-info" element={<HouseDetailsPage />} />
        <Route path="tickets" element={<TicketsTablePage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="votes" element={<VotesListPage />} />
        <Route path="votes/new" element={<VoteEditorPage />} />
        <Route path="feed" element={<FeedEditorPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default UkRoutes;
