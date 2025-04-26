import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGoogleBooksSearch } from '../hooks/useGoogleBooksSearch';
import debounce from 'lodash/debounce';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: {
    title: string;
    author: string;
    coverUrl: string;
    totalPages: number;
    genre: string[];
  }) => void;
}

export const AddBookModal = ({ isOpen, onClose, onAddBook }: AddBookModalProps) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

  const { books, loading, error, searchBooks } = useGoogleBooksSearch();
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Create a memoized debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchBooks(query);
    }, 500),
    [searchBooks]
  );

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      setSearchQuery('');
      if (!isManualMode) {
        setTitle('');
        setAuthor('');
        setCoverUrl('');
        setTotalPages('');
        setGenres([]);
      }
    }
  }, [isOpen, isManualMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setSearchQuery('');
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setTotalPages('');
    setGenreInput('');
    setGenres([]);
    setIsManualMode(false);
    onClose();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleBookSelect = (book: any) => {
    setTitle(book.volumeInfo.title || '');
    setAuthor(book.volumeInfo.authors?.[0] || '');
    setCoverUrl(
      book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || ''
    );
    setTotalPages(book.volumeInfo.pageCount?.toString() || '');
    setGenres(book.volumeInfo.categories || []);
    setIsManualMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author && coverUrl && totalPages) {
      onAddBook({
        title,
        author,
        coverUrl,
        totalPages: parseInt(totalPages, 10),
        genre: genres,
      });
      handleClose();
    }
  };

  const handleAddGenre = () => {
    if (genreInput && !genres.includes(genreInput)) {
      setGenres([...genres, genreInput]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setGenres(genres.filter(genre => genre !== genreToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Add New Book
            </h2>
            <button
              type="button"
              onClick={() => setIsManualMode(!isManualMode)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {isManualMode ? 'Search Books' : 'Manual Entry'}
            </button>
          </div>

          {!isManualMode ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search for a book
                </label>
                <input
                  ref={searchInputRef}
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter book title or author..."
                />
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}

              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {books.length > 0 && (
                <div className="space-y-4">
                  {books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => handleBookSelect(book)}
                      className="w-full flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {book.volumeInfo.imageLinks?.smallThumbnail && (
                        <img
                          src={book.volumeInfo.imageLinks.smallThumbnail.replace('http:', 'https:')}
                          alt={book.volumeInfo.title}
                          className="w-16 h-24 object-cover rounded-md"
                        />
                      )}
                      <div className="ml-4 text-left flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {book.volumeInfo.title}
                        </h3>
                        {book.volumeInfo.authors && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {book.volumeInfo.authors.join(', ')}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {book.volumeInfo.categories?.map((category: string) => (
                            <span
                              key={category}
                              className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                        {book.volumeInfo.pageCount && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {book.volumeInfo.pageCount} pages
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && !loading && books.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No books found. Try a different search or switch to manual entry.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="coverUrl"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Cover URL *
                </label>
                <input
                  type="url"
                  id="coverUrl"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt="Book cover preview"
                    className="mt-2 w-24 h-36 object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="totalPages"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Total Pages *
                </label>
                <input
                  type="number"
                  id="totalPages"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="genre"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Genres
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="genre"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGenre();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGenre}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(genre)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Book
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 