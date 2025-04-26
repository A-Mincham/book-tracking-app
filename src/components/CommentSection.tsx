import { useState } from 'react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
}

export const CommentSection = ({
  comments,
  onAddComment,
  onAddReply
}: CommentSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string, content: string) => {
    onAddReply(commentId, content);
    setReplyingTo(null);
  };

  const CommentItem = ({ comment }: { comment: Comment }) => {
    const [replyContent, setReplyContent] = useState('');

    return (
      <div className="mb-4">
        <div className="flex items-start space-x-3">
          <img
            src={comment.userAvatar}
            alt={comment.userName}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {comment.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
            <div className="flex items-center space-x-4 mt-2 ml-2">
              <button
                className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </button>
              <button className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
                Like • {comment.likes}
              </button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-2 ml-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitReply(comment.id, replyContent);
                    setReplyContent('');
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}

            {comment.replies.length > 0 && (
              <div className="ml-4 mt-2 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 mb-4"
      >
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span>{comments.length} Comments</span>
      </button>

      {isExpanded && (
        <div>
          <form onSubmit={handleSubmitComment} className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                Comment
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 