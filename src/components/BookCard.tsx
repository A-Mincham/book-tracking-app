import React, { useState } from 'react';
import { Book, ReadingStatus, ReadingSession } from '../types/book';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

type CardSize = 'compact' | 'standard' | 'comfortable' | 'list';

interface BookCardProps {
  book: Book;
  size: CardSize;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  onReviewClick: (bookId: string, sessionId?: string) => void;
  onReadAgain: (bookId: string) => void;
}

export const BookCard = ({
  book,
  size,
  onStatusChange,
  onReviewClick,
  onReadAgain
}: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const currentSession = book.readingSessions.find(s => s.id === book.currentSession);
  const latestSession = book.readingSessions[book.readingSessions.length - 1];
  const status = currentSession?.status || 'want-to-read';

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case 'reading':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'did-not-finish':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
    }
  };

  const getStatusIcon = (status: ReadingStatus) => {
    switch (status) {
      case 'reading':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'did-not-finish':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
    }
  };

  const renderReadCount = (session: ReadingSession) => {
    const suffix = session.readCount === 1 ? 'st' : session.readCount === 2 ? 'nd' : session.readCount === 3 ? 'rd' : 'th';
    return `${session.readCount}${suffix} read`;
  };

  const renderStars = (rating: number) => {
    const starSize = size === 'compact' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex space-x-1" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderStatusBadge = (session: ReadingSession) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
      {getStatusIcon(session.status)}
      <span>
        {session.status === 'reading' && 'Currently Reading'}
        {session.status === 'completed' && 'Completed'}
        {session.status === 'did-not-finish' && 'Did Not Finish'}
        {session.status === 'want-to-read' && 'Want to Read'}
      </span>
    </div>
  );

  const renderReadingProgress = (session: ReadingSession) => {
    if (session.status !== 'reading' || !session.currentPage) return null;

    const progress = Math.round((session.currentPage / book.totalPages) * 100);

    return (
      <div className="space-y-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-blue-600 dark:bg-blue-500 rounded-full h-1.5 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{progress}%</span>
          <span>{session.currentPage}/{book.totalPages}</span>
        </div>
      </div>
    );
  };

  const renderSessionInfo = (session: ReadingSession) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {renderReadCount(session)}
        </span>
        {session.endDate && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(session.endDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>
      {session.review && renderStars(session.review.rating)}
    </div>
  );

  const handleStartReading = () => {
    onStatusChange(book.id, 'reading');
    navigate(`/reading-session/${book.id}`);
  };

  const gridStyles = {
    compact: {
      container: 'p-2',
      imageContainer: 'pt-[140%]',
      title: 'text-sm line-clamp-1',
      author: 'text-xs',
      content: 'space-y-2',
      tags: 'gap-1',
      tag: 'px-1.5 py-0.5 text-xs',
    },
    standard: {
      container: 'p-4',
      imageContainer: 'pt-[150%]',
      title: 'text-base line-clamp-2',
      author: 'text-sm',
      content: 'space-y-3',
      tags: 'gap-1.5',
      tag: 'px-2 py-1 text-xs',
    },
    comfortable: {
      container: 'p-6',
      imageContainer: 'pt-[160%]',
      title: 'text-lg line-clamp-2',
      author: 'text-base',
      content: 'space-y-4',
      tags: 'gap-2',
      tag: 'px-3 py-1 text-sm',
    },
  };

  const getStyles = (currentSize: CardSize) => {
    if (currentSize === 'list') return gridStyles.standard;
    return gridStyles[currentSize];
  };

  const styles = getStyles(size);

  const renderActionButtons = () => {
    const buttonClasses = "px-3 py-1.5 text-sm text-white rounded-lg transition-colors duration-200";
    
    return (
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-6 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none' }}>
        {status === 'want-to-read' && (
          <button
            onClick={handleStartReading}
            className={`${buttonClasses} w-full bg-blue-600 hover:bg-blue-700`}
          >
            Start Reading
          </button>
        )}
        {status === 'reading' && (
          <>
            <button
              onClick={() => onStatusChange(book.id, 'completed')}
              className={`${buttonClasses} w-full bg-green-600 hover:bg-green-700`}
            >
              Mark Complete
            </button>
            <button
              onClick={() => onStatusChange(book.id, 'did-not-finish')}
              className={`${buttonClasses} w-full bg-red-600 hover:bg-red-700`}
            >
              Did Not Finish
            </button>
          </>
        )}
        {status === 'completed' && (
          <button
            onClick={() => onReadAgain(book.id)}
            className={`${buttonClasses} w-full bg-purple-600 hover:bg-purple-700`}
          >
            Read Again
          </button>
        )}
      </div>
    );
  };

  if (size === 'list') {
    return (
      <div
        className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex p-6 gap-6">
          <div className="flex-shrink-0 w-32">
            <div className="aspect-[2/3] relative rounded-md overflow-hidden shadow-sm">
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {book.author}
                  </p>
                </div>
                {renderStatusBadge(currentSession || latestSession)}
              </div>

              <div className="flex flex-wrap gap-2">
                {book.genre.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 truncate max-w-[150px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {latestSession?.review && (
                <div className="flex items-center gap-2">
                  {renderStars(latestSession.review.rating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {latestSession.review.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {currentSession && renderReadingProgress(currentSession)}
            </div>

            <div className="flex items-center gap-3 mt-4">
              {status === 'want-to-read' && (
                <button
                  onClick={handleStartReading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Start Reading
                </button>
              )}
              {status === 'reading' && (
                <>
                  <button
                    onClick={() => onStatusChange(book.id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => onStatusChange(book.id, 'did-not-finish')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Did Not Finish
                  </button>
                </>
              )}
              {status === 'completed' && (
                <button
                  onClick={() => onReadAgain(book.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Read Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${styles.imageContainer}`}>
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {renderActionButtons()}
      </div>

      <div className={`flex-1 ${styles.container} flex flex-col`}>
        <div className={`flex-1 ${styles.content}`}>
          <div>
            <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${styles.title}`}>
              {book.title}
            </h3>
            <p className={`text-gray-600 dark:text-gray-400 truncate mt-1 ${styles.author}`}>
              {book.author}
            </p>
          </div>

          {renderStatusBadge(currentSession || latestSession)}
          {currentSession && renderReadingProgress(currentSession)}
          
          {size !== 'compact' && latestSession && (
            <div className="flex flex-wrap gap-2">
              {book.genre.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {size !== 'compact' && latestSession?.review && (
            <div className="flex items-center gap-2">
              {renderStars(latestSession.review.rating)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {latestSession.review.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 