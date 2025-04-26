import { useState, useEffect } from 'react';

interface MobileNavigationProps {
  onNewUpdate: () => void;
  onTimerClick: () => void;
  notificationCount: number;
}

export const MobileNavigation = ({
  onNewUpdate,
  onTimerClick,
  notificationCount,
}: MobileNavigationProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setShowInstallPrompt(false);
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Install BookTracker
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add to your home screen for the best experience
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="px-3 py-1 text-gray-600 dark:text-gray-400"
              >
                Later
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            <button
              className="flex flex-col items-center justify-center w-16 h-16 text-gray-600 dark:text-gray-400"
              onClick={() => {}}
            >
              <svg
                className="w-6 h-6"
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
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              className="flex flex-col items-center justify-center w-16 h-16 text-gray-600 dark:text-gray-400"
              onClick={onTimerClick}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs mt-1">Timer</span>
            </button>

            <button
              className="flex flex-col items-center justify-center w-16 h-16 -mt-8 bg-blue-600 rounded-full text-white shadow-lg transform transition-transform active:scale-95"
              onClick={onNewUpdate}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>

            <button
              className="flex flex-col items-center justify-center w-16 h-16 text-gray-600 dark:text-gray-400"
              onClick={() => {}}
            >
              <div className="relative">
                <svg
                  className="w-6 h-6"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Alerts</span>
            </button>

            <button
              className="flex flex-col items-center justify-center w-16 h-16 text-gray-600 dark:text-gray-400"
              onClick={() => {}}
            >
              <svg
                className="w-6 h-6"
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
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}; 