import { BookCard } from './BookCard';
import { ViewControl, ViewMode } from './ViewControl';
import { useState } from 'react';
import { Book, ReadingStatus } from '../types/book';

interface BookGridProps {
  books: Book[];
  className?: string;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onReviewClick: (bookId: string, sessionId?: string) => void;
  onReadAgain: (bookId: string) => void;
}

export const BookGrid = ({ 
  books, 
  className = '', 
  onStatusChange,
  onReviewClick,
  onReadAgain 
}: BookGridProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('standard');

  const getGridClasses = () => {
    if (viewMode === 'list') return 'flex flex-col gap-4';
    
    const baseClasses = 'grid gap-4 transition-all duration-300';
    
    switch (viewMode) {
      case 'compact':
        return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8`;
      case 'comfortable':
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4`;
      case 'standard':
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`;
    }
  };

  const getCardSize = () => {
    switch (viewMode) {
      case 'compact':
        return 'compact';
      case 'comfortable':
        return 'comfortable';
      case 'list':
        return 'list';
      case 'standard':
      default:
        return 'standard';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Your Library
        </h2>
        <ViewControl currentView={viewMode} onChange={setViewMode} />
      </div>

      <div className={getGridClasses()}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            size={getCardSize()}
            onStatusChange={onStatusChange}
            onReviewClick={onReviewClick}
            onReadAgain={onReadAgain}
          />
        ))}
      </div>
    </div>
  );
}; 