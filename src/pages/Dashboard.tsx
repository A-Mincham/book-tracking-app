import React from 'react';
import { ReadingStats } from '../components/ReadingStats';
import { BookList } from '../components/BookList';

export const Dashboard = () => {
  const mockBooks = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://example.com/gatsby.jpg',
      progress: 75,
      rating: 4.5,
      genre: ['Classic', 'Fiction'],
      totalPages: 180,
      currentPage: 135,
      status: 'reading' as const,
    },
    // Add more books as needed
  ];

  const handleBookClick = (bookId: string) => {
    console.log('Book clicked:', bookId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <ReadingStats
        todayMinutes={45}
        streak={7}
        booksCompleted={12}
        totalPages={2500}
        weeklyProgress={[30, 45, 20, 60, 40, 35, 50]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BookList books={mockBooks} onBookClick={handleBookClick} />
      </div>
    </div>
  );
}; 