import { useState, useRef, useEffect } from 'react';
import { useBookSearch } from '../hooks/useBookSearch';
import { TransformedBook } from '../utils/bookDataTransform';

interface NewUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (update: {
    bookId: string;
    currentPage: number;
    thoughts: string;
  }) => void;
}

export const NewUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
}: NewUpdateModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<TransformedBook | null>(null);
  const [currentPage, setCurrentPage] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { books, loading, error } = useBookSearch(searchQuery, {
    maxResults: 5,
  });

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook && currentPage) {
      onSubmit({
        bookId: selectedBook.id,
        currentPage: parseInt(currentPage, 10),
        thoughts,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedBook(null);
    setCurrentPage('');
    setThoughts('');
    onClose();
  };

  const handleBookSelect = (book: TransformedBook) => {
    setSelectedBook(book);
    setSearchQuery(book.title);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            New Reading Update
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Book Search */}
            <div className="mb-4 relative">
              <label
                htmlFor="book-search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search Book
              </label>
              <input
                ref={searchInputRef}
                type="text"
                id="book-search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (!e.target.value) {
                    setSelectedBook(null);
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Type to search books..."
              />

              {/* Search Suggestions */}
              {showSuggestions && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  {loading && (
                    <div className="p-4 text-gray-500 dark:text-gray-400">
                      Searching...
                    </div>
                  )}

                  {error && (
                    <div className="p-4 text-red-500 dark:text-red-400">
                      {error.message}
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    books.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleBookSelect(book)}
                        className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-start space-x-4"
                      >
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {book.author}
                          </div>
                        </div>
                      </button>
                    ))}

                  {!loading && !error && books.length === 0 && searchQuery && (
                    <div className="p-4 text-gray-500 dark:text-gray-400">
                      No books found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Current Page */}
            {selectedBook && (
              <div className="mb-4">
                <label
                  htmlFor="current-page"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Page
                </label>
                <input
                  type="number"
                  id="current-page"
                  min="1"
                  max={selectedBook.totalPages}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={`1-${selectedBook.totalPages}`}
                />
              </div>
            )}

            {/* Thoughts */}
            <div className="mb-6">
              <label
                htmlFor="thoughts"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Thoughts
              </label>
              <textarea
                id="thoughts"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                placeholder="Share your thoughts about the book..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedBook || !currentPage || !thoughts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 