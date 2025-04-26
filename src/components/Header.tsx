import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  notificationCount?: number;
  challengeProgress?: {
    current: number;
    target: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  notificationCount = 0,
  challengeProgress,
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                onChange={(e) => onSearch?.(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Reading Challenge */}
            {challengeProgress && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Reading Challenge
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {challengeProgress.current}/{challengeProgress.target}
                </div>
              </div>
            )}

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <img
                  src="https://i.pravatar.cc/150?img=1"
                  alt="User"
                  className="h-8 w-8 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium">John Doe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 