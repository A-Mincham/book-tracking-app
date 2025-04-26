import { ReadingUpdate } from '../types';
import { ReadingUpdateCard } from './ReadingUpdateCard';

// Mock data for testing
const mockUpdates: ReadingUpdate[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Jane Smith',
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    book: {
      id: 'book1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      coverUrl: 'https://picsum.photos/200/300'
    },
    progress: 45,
    currentPage: 156,
    totalPages: 348,
    timestamp: new Date().toISOString(),
    comment: 'Really enjoying this journey through parallel lives!',
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'John Doe',
      avatarUrl: 'https://i.pravatar.cc/150?img=2'
    },
    book: {
      id: 'book2',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      coverUrl: 'https://picsum.photos/200/301'
    },
    progress: 75,
    currentPage: 300,
    totalPages: 400,
    timestamp: new Date().toISOString(),
    likes: 8,
    comments: 1
  }
];

export const ReadingFeed = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Reading Updates
      </h1>
      <div className="space-y-6">
        {mockUpdates.map((update) => (
          <ReadingUpdateCard key={update.id} update={update} />
        ))}
      </div>
    </div>
  );
}; 