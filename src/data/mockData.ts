import { ReadingUpdate } from '../types';

export const mockUpdates: ReadingUpdate[] = [
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
    timestamp: '2024-02-25T10:30:00Z',
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
    timestamp: '2024-02-24T15:45:00Z',
    likes: 8,
    comments: 1
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Alice Johnson',
      avatarUrl: 'https://i.pravatar.cc/150?img=3'
    },
    book: {
      id: 'book3',
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://picsum.photos/200/302'
    },
    progress: 100,
    currentPage: 412,
    totalPages: 412,
    timestamp: '2024-02-23T20:15:00Z',
    comment: 'Finally finished this epic masterpiece! The spice must flow.',
    likes: 24,
    comments: 7
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Bob Wilson',
      avatarUrl: 'https://i.pravatar.cc/150?img=4'
    },
    book: {
      id: 'book4',
      title: 'The Three-Body Problem',
      author: 'Cixin Liu',
      coverUrl: 'https://picsum.photos/200/303'
    },
    progress: 15,
    currentPage: 60,
    totalPages: 400,
    timestamp: '2024-02-25T08:20:00Z',
    comment: 'Mind-bending concepts right from the start!',
    likes: 5,
    comments: 2
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Emma Davis',
      avatarUrl: 'https://i.pravatar.cc/150?img=5'
    },
    book: {
      id: 'book5',
      title: 'Foundation',
      author: 'Isaac Asimov',
      coverUrl: 'https://picsum.photos/200/304'
    },
    progress: 60,
    currentPage: 150,
    totalPages: 250,
    timestamp: '2024-02-24T12:00:00Z',
    likes: 15,
    comments: 4
  }
]; 