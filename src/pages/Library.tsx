import React, { useState, useEffect } from 'react';
import { BookGrid } from '../components/BookGrid';
import { AddBookModal } from '../components/AddBookModal';
import { BookDetailModal } from '../components/BookDetailModal';
import { Book, ReadingStatus, Review } from '../types/book';
import { useSearchParams } from 'react-router-dom';

type SortOption = 'title' | 'author' | 'progress' | 'rating';
type FilterOption = 'all' | ReadingStatus;

const FILTER_STORAGE_KEY = 'bookAppFilter';
const SORT_STORAGE_KEY = 'bookAppSort';

export const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    return (localStorage.getItem(SORT_STORAGE_KEY) as SortOption) || 'title';
  });
  const [filterBy, setFilterBy] = useState<FilterOption>(() => {
    return (localStorage.getItem(FILTER_STORAGE_KEY) as FilterOption) || 'reading';
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      coverUrl: 'https://covers.openlibrary.org/b/id/6498519-L.jpg',
      totalPages: 180,
      genre: ['Classic', 'Fiction'],
      readingSessions: [
        {
          id: 'session1',
          startDate: new Date().toISOString(),
          currentPage: 0,
          status: 'want-to-read',
          readCount: 1
        }
      ],
      currentSession: 'session1'
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      coverUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      totalPages: 328,
      genre: ['Science Fiction', 'Dystopian'],
      readingSessions: [
        {
          id: 'session2',
          startDate: new Date().toISOString(),
          currentPage: 150,
          status: 'reading',
          readCount: 1
        }
      ],
      currentSession: 'session2'
    },
    {
      id: '3',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      coverUrl: 'https://covers.openlibrary.org/b/id/6495571-L.jpg',
      totalPages: 432,
      genre: ['Classic', 'Romance'],
      readingSessions: [
        {
          id: 'session3',
          startDate: new Date().toISOString(),
          currentPage: 432,
          status: 'reading',
          readCount: 1
        }
      ],
      currentSession: 'session3'
    },
    {
      id: '4',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      coverUrl: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
      totalPages: 310,
      genre: ['Fantasy', 'Adventure'],
      readingSessions: [
        {
          id: 'session4',
          startDate: new Date().toISOString(),
          currentPage: 0,
          status: 'want-to-read',
          readCount: 1
        }
      ],
      currentSession: 'session4'
    }
  ]);

  useEffect(() => {
    // Update URL when filter changes
    if (filterBy === 'all') {
      searchParams.delete('filter');
    } else {
      searchParams.set('filter', filterBy);
    }
    setSearchParams(searchParams);
    
    // Save to localStorage
    localStorage.setItem(FILTER_STORAGE_KEY, filterBy);
  }, [filterBy, searchParams, setSearchParams]);

  useEffect(() => {
    // Save sort preference
    localStorage.setItem(SORT_STORAGE_KEY, sortBy);
  }, [sortBy]);

  useEffect(() => {
    // Initialize from URL if present
    const urlFilter = searchParams.get('filter') as FilterOption;
    if (urlFilter && ['all', 'reading', 'completed', 'did-not-finish', 'want-to-read'].includes(urlFilter)) {
      setFilterBy(urlFilter);
    }
  }, [searchParams]);

  const handleStatusChange = (bookId: string, newStatus: ReadingStatus) => {
    // First find the book and check if it's a first-time completion
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Update the books state first
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          const currentSession = book.readingSessions.find(s => s.id === book.currentSession);
          if (!currentSession) return book;

          const updatedSession = {
            ...currentSession,
            status: newStatus,
            endDate: newStatus === 'completed' || newStatus === 'did-not-finish' 
              ? new Date().toISOString() 
              : undefined,
            currentPage: newStatus === 'completed' ? book.totalPages : currentSession.currentPage
          };

          return {
            ...book,
            readingSessions: book.readingSessions.map(s => 
              s.id === currentSession.id ? updatedSession : s
            ),
            currentSession: currentSession.id
          };
        }
        return book;
      })
    );

    // If this is a completion, immediately show the review modal
    if (newStatus === 'completed') {
      // Small delay to ensure state is updated before showing modal
      setTimeout(() => {
        setSelectedBook(book);
      }, 0);
    }
  };

  const handleUpdateReview = (bookId: string, sessionId: string, review: Review) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          return {
            ...book,
            readingSessions: book.readingSessions.map(session => {
              if (session.id === sessionId) {
                return {
                  ...session,
                  review
                };
              }
              return session;
            })
          };
        }
        return book;
      })
    );
  };

  const handleReadAgain = (bookId: string) => {
    setBooks(prevBooks => 
      prevBooks.map(book => {
        if (book.id === bookId) {
          const newSession = {
            id: `session${Date.now()}`,
            startDate: new Date().toISOString(),
            currentPage: 0,
            status: 'reading' as ReadingStatus,
            readCount: book.readingSessions.length + 1
          };

          return {
            ...book,
            readingSessions: [...book.readingSessions, newSession],
            currentSession: newSession.id
          };
        }
        return book;
      })
    );
    // Close the detail modal after starting a new reading session
    setSelectedBook(null);
  };

  const handleAddBook = (newBook: {
    title: string;
    author: string;
    coverUrl: string;
    totalPages: number;
    genre: string[];
  }) => {
    const sessionId = `session${Date.now()}`;
    const book: Book = {
      id: Date.now().toString(),
      ...newBook,
      readingSessions: [
        {
          id: sessionId,
          startDate: new Date().toISOString(),
          currentPage: 0,
          status: 'want-to-read',
          readCount: 1
        }
      ],
      currentSession: sessionId
    };
    setBooks([...books, book]);
    setIsAddModalOpen(false);
  };

  const filteredBooks = books.filter(book => {
    if (filterBy === 'all') return true;
    const currentSession = book.readingSessions.find(s => s.id === book.currentSession);
    return currentSession?.status === filterBy;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aSession = a.readingSessions.find(s => s.id === a.currentSession);
    const bSession = b.readingSessions.find(s => s.id === b.currentSession);

    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.author.localeCompare(b.author);
      case 'progress':
        const aProgress = aSession ? aSession.currentPage / a.totalPages : 0;
        const bProgress = bSession ? bSession.currentPage / b.totalPages : 0;
        return bProgress - aProgress;
      case 'rating':
        const aRating = aSession?.review?.rating || 0;
        const bRating = bSession?.review?.rating || 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Library</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
        >
          Add Book
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'reading', 'completed', 'did-not-finish', 'want-to-read'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilterBy(option)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                filterBy === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option === 'all' && 'All Books'}
              {option === 'reading' && 'Currently Reading'}
              {option === 'completed' && 'Completed'}
              {option === 'did-not-finish' && 'Did Not Finish'}
              {option === 'want-to-read' && 'Want to Read'}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="progress">Sort by Progress</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Book Grid */}
      <BookGrid 
        books={sortedBooks}
        onStatusChange={handleStatusChange}
        onReviewClick={(bookId) => {
          const book = books.find(b => b.id === bookId);
          if (book) setSelectedBook(book);
        }}
        onReadAgain={handleReadAgain}
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onStatusChange={handleStatusChange}
          onReadAgain={handleReadAgain}
          onUpdateReview={handleUpdateReview}
        />
      )}
    </div>
  );
}; 