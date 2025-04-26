import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReadingTimer } from '../components/ReadingTimer';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'completed' | 'want-to-read';
}

export const ReadingSession = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [note, setNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // In a real app, fetch the book data from your backend/state management
  useEffect(() => {
    // Mock data for demonstration
    setBook({
      id: bookId || '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://covers.openlibrary.org/b/id/6498519-L.jpg',
      totalPages: 180,
      currentPage: 135,
      status: 'reading'
    });
    setCurrentPage(135);
  }, [bookId]);

  const handleSessionComplete = (minutes: number) => {
    // In a real app, save the reading session data
    console.log(`Reading session completed: ${minutes} minutes`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (book?.totalPages || 0)) {
      setCurrentPage(newPage);
      // In a real app, save the progress
    }
  };

  const handleSaveNote = () => {
    // In a real app, save the note
    console.log('Note saved:', note);
    setNote('');
    setShowNotes(false);
  };

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reading Session
          </h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Info */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-64 object-cover rounded-md shadow-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{book.author}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Page
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => handlePageChange(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      of {book.totalPages}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${(currentPage / book.totalPages) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timer and Notes */}
          <div className="md:col-span-2 space-y-6">
            <ReadingTimer
              dailyGoal={30}
              currentMinutes={0}
              onSessionComplete={handleSessionComplete}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reading Notes
                </h3>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {showNotes ? 'Hide' : 'Add Note'}
                </button>
              </div>

              {showNotes && (
                <div className="space-y-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your thoughts about this reading session..."
                    className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {/* Previous notes would be displayed here */}
              <div className="mt-4 space-y-4">
                {/* Mock previous note */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Yesterday
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Great chapter! The symbolism of the green light was particularly striking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 