import { useEffect } from 'react';

export type ViewMode = 'compact' | 'standard' | 'comfortable' | 'list';

interface ViewControlProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export const ViewControl = ({ currentView, onChange }: ViewControlProps) => {
  // Load saved preference on mount
  useEffect(() => {
    const savedView = localStorage.getItem('bookViewMode') as ViewMode;
    if (savedView && savedView !== currentView) {
      onChange(savedView);
    }
  }, []);

  // Save preference when changed
  const handleViewChange = (view: ViewMode) => {
    localStorage.setItem('bookViewMode', view);
    onChange(view);
  };

  return (
    <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => handleViewChange('compact')}
        className={`p-2 first:rounded-l-lg last:rounded-r-lg ${
          currentView === 'compact'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        title="Compact view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 6a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      </button>

      <button
        onClick={() => handleViewChange('standard')}
        className={`p-2 border-l border-r border-gray-200 dark:border-gray-700 ${
          currentView === 'standard'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        title="Standard view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      <button
        onClick={() => handleViewChange('comfortable')}
        className={`p-2 border-r border-gray-200 dark:border-gray-700 ${
          currentView === 'comfortable'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        title="Comfortable view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        </svg>
      </button>

      <button
        onClick={() => handleViewChange('list')}
        className={`p-2 ${
          currentView === 'list'
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        title="List view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}; 