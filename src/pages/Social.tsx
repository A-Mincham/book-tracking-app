import React from 'react';

export const Social = () => {
  const updates = [
    {
      id: '1',
      user: 'John Doe',
      action: 'finished reading',
      book: 'The Great Gatsby',
      timestamp: '2 hours ago',
      avatar: 'https://example.com/avatar1.jpg',
    },
    // Add more updates as needed
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reading Updates</h1>
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-start space-x-4"
          >
            <img
              src={update.avatar}
              alt={update.user}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-gray-900 dark:text-white">
                <span className="font-semibold">{update.user}</span>{' '}
                {update.action} <span className="font-semibold">{update.book}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {update.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 