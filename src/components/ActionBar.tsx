interface ActionBarProps {
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const ActionBar = ({
  likes,
  comments,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave
}: ActionBarProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-4">
        {/* Like Button */}
        <button
          onClick={onLike}
          className="group flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200"
        >
          <svg
            className={`w-5 h-5 transform group-hover:scale-110 transition-all duration-200 ${
              isLiked ? 'fill-blue-600 text-blue-600' : 'fill-none'
            }`}
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
          <span className="text-sm font-medium">{likes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={onComment}
          className="group flex items-center space-x-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
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
          <span className="text-sm font-medium">{comments}</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Share Button */}
        <button
          onClick={onShare}
          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>

        {/* Save/Bookmark Button */}
        <button
          onClick={onSave}
          className={`p-2 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isSaved
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}; 