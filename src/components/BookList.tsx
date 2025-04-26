interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'completed' | 'want-to-read';
}

interface BookListProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

export const BookList = ({ books, onBookClick }: BookListProps) => {
  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'reading':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'want-to-read':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
    }
  };

  const getStatusText = (status: Book['status']) => {
    switch (status) {
      case 'reading':
        return 'Currently Reading';
      case 'completed':
        return 'Completed';
      case 'want-to-read':
        return 'Want to Read';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          onClick={() => onBookClick(book.id)}
        >
          <div className="flex h-48 relative">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-1/3 object-cover"
            />
            <div className="flex-1 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {book.author}
              </p>
              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  book.status
                )}`}
              >
                {getStatusText(book.status)}
              </div>
              {book.status === 'reading' && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Progress: {Math.round((book.currentPage / book.totalPages) * 100)}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{
                        width: `${(book.currentPage / book.totalPages) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 