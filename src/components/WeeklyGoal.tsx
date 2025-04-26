import { useEffect, useState } from 'react';

interface WeeklyGoalProps {
  weeklyTarget: number;
  currentProgress: number;
  streak: number;
  dailyTarget: number;
  todayProgress: number;
  lastWeekProgress: number;
}

export const WeeklyGoal = ({
  weeklyTarget,
  currentProgress,
  streak,
  dailyTarget,
  todayProgress,
  lastWeekProgress,
}: WeeklyGoalProps) => {
  const [isStreakAnimating, setIsStreakAnimating] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Calculate percentages
  const weeklyPercentage = Math.min((currentProgress / weeklyTarget) * 100, 100);
  const dailyPercentage = Math.min((todayProgress / dailyTarget) * 100, 100);
  const weeklyComparison = ((currentProgress - lastWeekProgress) / lastWeekProgress) * 100;

  // Circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (weeklyPercentage / 100) * circumference;

  useEffect(() => {
    if (dailyPercentage >= 100 && !showStreakCelebration) {
      setShowStreakCelebration(true);
      setIsStreakAnimating(true);
      const timer = setTimeout(() => {
        setShowStreakCelebration(false);
        setIsStreakAnimating(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dailyPercentage]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Weekly Reading Goal
      </h2>

      <div className="flex items-center justify-between mb-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-blue-600 dark:text-blue-500 transition-all duration-1000"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(weeklyPercentage)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                of weekly goal
              </div>
            </div>
          </div>
        </div>

        {/* Daily Target */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Today's Target
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {todayProgress}/{dailyTarget}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            pages read
          </div>
        </div>

        {/* Streak */}
        <div
          className={`text-center transition-transform duration-300 ${
            isStreakAnimating ? 'animate-bounce' : ''
          }`}
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Current Streak
          </div>
          <div className="text-2xl font-bold text-orange-500">
            {streak} days 🔥
          </div>
          {showStreakCelebration && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <div className="animate-float text-2xl">🎉</div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Compared to last week
          </span>
          <span
            className={`text-sm font-medium ${
              weeklyComparison > 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {weeklyComparison > 0 ? '+' : ''}
            {Math.round(weeklyComparison)}%
          </span>
        </div>
      </div>
    </div>
  );
}; 