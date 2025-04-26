import React from 'react';

export const Stats = () => {
  const stats = {
    totalBooks: 25,
    totalPages: 5000,
    averageRating: 4.2,
    readingStreak: 30,
    favoriteGenre: 'Science Fiction',
    monthlyProgress: [
      { month: 'Jan', pages: 450 },
      { month: 'Feb', pages: 380 },
      { month: 'Mar', pages: 520 },
      { month: 'Apr', pages: 410 },
      { month: 'May', pages: 480 },
      { month: 'Jun', pages: 550 },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalBooks}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Pages</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPages}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.averageRating}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reading Streak</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.readingStreak} days</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Favorite Genre</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.favoriteGenre}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Progress</h3>
        <div className="h-64">
          {/* Add a chart component here */}
          <div className="flex items-end h-48 space-x-2">
            {stats.monthlyProgress.map((item) => (
              <div
                key={item.month}
                className="flex-1 bg-blue-600 rounded-t"
                style={{
                  height: `${(item.pages / 550) * 100}%`,
                }}
              >
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {item.month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 