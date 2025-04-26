export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

export interface ReadingUpdate {
  id: string;
  user: User;
  book: Book;
  progress: number; // Percentage from 0 to 100
  currentPage: number;
  totalPages: number;
  timestamp: string;
  comment?: string;
  likes: number;
  comments: number;
} 