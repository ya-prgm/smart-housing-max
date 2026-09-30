import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const DesktopLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
