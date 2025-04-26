import React, { useState, useEffect } from 'react';
import { Book, ReadingStatus, ReadingSession, Review } from '../types/book';
import { format } from 'date-fns';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  onReadAgain: (bookId: string) => void;
  onUpdateReview: (bookId: string, sessionId: string, review: Review) => void;
}

export const BookDetailModal = ({
  book,
  onClose,
  onStatusChange,
  onReadAgain,
  onUpdateReview
}: BookDetailModalProps) => {
  const currentSession = book.readingSessions.find(s => s.id === book.currentSession);
  const isFirstTimeCompletion = currentSession?.status === 'completed' && 
    !book.readingSessions.some(s => s.status === 'completed' && s.id !== book.currentSession);

  const [activeSession, setActiveSession] = useState<string | null>(book.currentSession || null);
  const [editingSession, setEditingSession] = useState<string | null>(
    isFirstTimeCompletion && currentSession && !currentSession.review ? currentSession.id : null
  );
  const [editedReview, setEditedReview] = useState<Partial<Review>>(() => {
    if (isFirstTimeCompletion && currentSession && !currentSession.review) {
      return { rating: 0, text: '' };
    }
    return {};
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Force the review form to be shown when modal opens for a new completion
  useEffect(() => {
    if (currentSession?.status === 'completed' && !currentSession.review) {
      setEditingSession(currentSession.id);
      setActiveSession(currentSession.id);
      setEditedReview({ rating: 0, text: '' });
    }
  }, [currentSession]);

  // Prevent closing if review is required but not completed
  const handleClose = () => {
    if (isFirstTimeCompletion && !currentSession?.review) {
      if (window.confirm('A review is required for your first completion. Are you sure you want to close without saving?')) {
        onClose();
      }
    } else if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSaveReview = (sessionId: string) => {
    if (!editedReview.rating || !editedReview.text) {
      alert('Please provide both a rating and a review before saving.');
      return;
    }

    onUpdateReview(book.id, sessionId, {
      id: Date.now().toString(),
      rating: editedReview.rating,
      text: editedReview.text,
      dateCompleted: new Date().toISOString(),
      readingSessionId: sessionId
    });
    setEditingSession(null);
    setEditedReview({});
    setHasUnsavedChanges(false);
    onClose();
  };

  const renderStars = (rating: number, isEditing: boolean = false) => {
    const displayRating = hoverRating !== null 
      ? hoverRating 
      : (editingSession ? (editedReview.rating || 0) : rating);

    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      const starValue = i;
      const halfStarValue = i - 0.5;
      const isFullStar = displayRating >= starValue;
      const isHalfStar = !isFullStar && displayRating >= halfStarValue;

      stars.push(
        <div
          key={i}
          className={`relative w-8 h-8 ${isEditing ? 'cursor-pointer' : ''}`}
          onMouseLeave={() => isEditing && setHoverRating(null)}
        >
          {/* Base Star */}
          <svg
            className={`w-full h-full transition-colors duration-200 ${
              isFullStar
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          {/* Half Star Overlay */}
          {isHalfStar && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <svg
                className="w-full h-full text-yellow-400 fill-current transition-transform duration-200"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}

          {isEditing && (
            <>
              {/* Left half hover/click area */}
              <div
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                onMouseEnter={() => setHoverRating(halfStarValue)}
                onClick={() => {
                  setEditedReview(prev => ({ ...prev, rating: halfStarValue }));
                  setHoverRating(halfStarValue);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Right half hover/click area */}
              <div
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                onMouseEnter={() => setHoverRating(starValue)}
                onClick={() => {
                  setEditedReview(prev => ({ ...prev, rating: starValue }));
                  setHoverRating(starValue);
                  setHasUnsavedChanges(true);
                }}
              />
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <div 
          className="flex space-x-1" 
          aria-label={`${displayRating} out of 5 stars`}
        >
          {stars}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {displayRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderReadingProgress = (session: ReadingSession) => {
    if (!session.currentPage) return null;

    const progress = Math.round((session.currentPage / book.totalPages) * 100);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Reading Progress</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {session.currentPage} of {book.totalPages}
        </div>
      </div>
    );
  };

  const renderSessionCard = (session: ReadingSession) => {
    const isEditing = editingSession === session.id;
    const isActive = activeSession === session.id;
    const isFirstCompletion = session.status === 'completed' && 
      !book.readingSessions.some(s => 
        s.id !== session.id && s.status === 'completed'
      );

    return (
      <div
        key={session.id}
        className={`bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 border-2 transition-colors ${
          isActive
            ? 'border-blue-500 dark:border-blue-400'
            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {session.readCount === 1 ? 'First Read' : 
               session.readCount === 2 ? 'Second Read' : 
               session.readCount === 3 ? 'Third Read' : 
               `${session.readCount}th Read`}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(session.startDate), 'MMM d, yyyy')}
              {session.endDate && ` - ${format(new Date(session.endDate), 'MMM d, yyyy')}`}
            </div>
          </div>
        </div>

        {renderReadingProgress(session)}

        {session.status === 'completed' && (
          <div className="space-y-4">
            {isFirstCompletion && !session.review && (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Review Required</h4>
                <p>Congratulations on completing this book! Please take a moment to rate and review it. Your review will help others discover great books.</p>
              </div>
            )}
            
            <div className={`space-y-2 ${isEditing ? 'bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg' : ''}`}>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating {isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing && !editedReview.rating && (
                  <span className="text-sm text-red-500">Rating is required</span>
                )}
              </div>
              {renderStars(session.review?.rating || 0, isEditing)}
            </div>

            <div className={`space-y-2 ${isEditing ? 'bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg' : ''}`}>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Review {isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing && !editedReview.text && (
                  <span className="text-sm text-red-500">Review is required</span>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={editedReview.text}
                  onChange={(e) => {
                    setEditedReview(prev => ({ ...prev, text: e.target.value }));
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  rows={4}
                  placeholder="Share your thoughts about this book..."
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  {session.review?.text || 'No review yet'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingSession(null);
                    setEditedReview({});
                    setHasUnsavedChanges(false);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveReview(session.id)}
                  disabled={!editedReview.rating || !editedReview.text}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start gap-6">
            <div className="flex gap-6">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-40 h-60 object-cover rounded-lg shadow-lg"
              />
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {book.title}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {book.author}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {book.genre.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {book.readingSessions.some(s => s.status === 'completed') && (
                  <button
                    onClick={() => onReadAgain(book.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Read Again
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Reading Sessions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Reading History
            </h3>
            <div className="space-y-4">
              {book.readingSessions.map(session => renderSessionCard(session))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 