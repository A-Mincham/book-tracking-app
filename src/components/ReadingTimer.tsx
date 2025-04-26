/// <reference types="node" />
import { useState, useEffect, useCallback } from 'react';

interface ReadingTimerProps {
  dailyGoal: number;
  currentMinutes: number;
  onSessionComplete: (minutes: number) => void;
}

export const ReadingTimer = ({
  dailyGoal,
  currentMinutes,
  onSessionComplete,
}: ReadingTimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleStop = useCallback(() => {
    if (sessionTime > 0) {
      onSessionComplete(Math.floor(sessionTime / 60));
    }
    setSessionTime(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [sessionTime, onSessionComplete]);

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && !isPaused) {
      interval = window.setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isRunning, isPaused]);

  // Calculate progress percentage
  const progressPercentage = Math.min(
    ((currentMinutes + Math.floor(sessionTime / 60)) / dailyGoal) * 100,
    100
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reading Timer
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Daily Goal: {dailyGoal} minutes
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-mono">
          {formatTime(sessionTime)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Session Time
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        {!isRunning && !isPaused && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Start
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pause
          </button>
        )}

        {isPaused && (
          <button
            onClick={handleStart}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Resume
          </button>
        )}

        {(isRunning || isPaused) && (
          <button
            onClick={handleStop}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10h6v6H9z"
              />
            </svg>
            Stop
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Daily Progress</span>
          <span>
            {currentMinutes + Math.floor(sessionTime / 60)}/{dailyGoal} minutes
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 