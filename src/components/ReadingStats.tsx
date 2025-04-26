interface ReadingStatsProps {
  todayMinutes: number;
  streak: number;
  booksCompleted: number;
  totalPages: number;
  weeklyProgress: number[];
}

export const ReadingStats = ({
  todayMinutes,
  streak,
  booksCompleted,
  totalPages,
  weeklyProgress
}: ReadingStatsProps) => {
  const maxProgress = Math.max(...weeklyProgress);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Reading Stats
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Today's Reading */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
            Today's Reading
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {todayMinutes} min
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">
            Current Streak
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {streak} days
          </div>
        </div>

        {/* Books Completed */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">
            Books Completed
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {booksCompleted}
          </div>
        </div>

        {/* Total Pages */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">
            Pages Read
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalPages}
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Weekly Progress
        </h3>
        <div className="flex items-end space-x-2 h-32">
          {weeklyProgress.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t"
              style={{
                height: `${(value / maxProgress) * 100}%`,
                transition: 'height 0.3s ease-in-out'
              }}
            >
              <div className="w-full h-full relative group">
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-1 px-2">
                    {value} pages
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}; 