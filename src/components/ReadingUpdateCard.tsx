import { ReadingUpdate } from '../types';
import { ProgressBar } from './ProgressBar';
import { formatDistanceToNow } from 'date-fns';

interface ReadingUpdateCardProps {
  update: ReadingUpdate;
  onLike: (id: string) => void;
}

export const ReadingUpdateCard = ({ update, onLike }: ReadingUpdateCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(update.timestamp), { addSuffix: true });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-4">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={update.user.avatarUrl}
          alt={update.user.name}
          className="w-10 h-10 rounded-full mr-3 ring-2 ring-blue-500 ring-offset-2"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors duration-200">
            {update.user.name}
          </h3>
          <p className="text-sm text-gray-500">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Book Info */}
      <div className="flex mb-4">
        <img
          src={update.book.coverUrl}
          alt={update.book.title}
          className="w-16 h-24 object-cover rounded-md mr-4 shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors duration-200">
            {update.book.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {update.book.author}
          </p>
          <div className="mt-3">
            <ProgressBar
              percentage={update.progress}
              color="blue"
              size="md"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Page {update.currentPage} of {update.totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Comment */}
      {update.comment && (
        <p className="text-gray-700 dark:text-gray-200 mb-4 italic">
          "{update.comment}"
        </p>
      )}

      {/* Interactions */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onLike(update.id)}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
            fill={update.likes > 0 ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm font-medium">{update.likes}</span>
        </button>

        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm">{update.comments}</span>
        </div>
      </div>
    </div>
  );
}; 