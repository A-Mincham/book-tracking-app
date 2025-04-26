import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../navigation/Sidebar';
import { Header } from '../Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 