import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavLinkProps {
  isActive: boolean;
}

const HomeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const SocialIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const StatsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const Sidebar = () => {
  return (
    <nav className="w-64 h-screen fixed left-0 bg-white dark:bg-gray-800 shadow-lg p-4">
      <div className="space-y-4">
        <NavLink
          to="/"
          className={({ isActive }: NavLinkProps) =>
            `flex items-center p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`
          }
        >
          <HomeIcon />
          <span className="ml-3">Dashboard</span>
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }: NavLinkProps) =>
            `flex items-center p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`
          }
        >
          <BookIcon />
          <span className="ml-3">Library</span>
        </NavLink>

        <NavLink
          to="/social"
          className={({ isActive }: NavLinkProps) =>
            `flex items-center p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`
          }
        >
          <SocialIcon />
          <span className="ml-3">Social</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }: NavLinkProps) =>
            `flex items-center p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`
          }
        >
          <StatsIcon />
          <span className="ml-3">Stats</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }: NavLinkProps) =>
            `flex items-center p-3 rounded-lg ${
              isActive
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`
          }
        >
          <ProfileIcon />
          <span className="ml-3">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}; 