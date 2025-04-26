export type ReadingStatus = 'reading' | 'completed' | 'did-not-finish' | 'want-to-read';

export interface Review {
  id: string;
  rating: number;
  text: string;
  dateCompleted: string;
  readingSessionId: string;
}

export interface ReadingSession {
  id: string;
  startDate: string;
  endDate?: string;
  currentPage: number;
  status: ReadingStatus;
  review?: Review;
  readCount: number; // Which read-through this is (1st, 2nd, etc.)
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  totalPages: number;
  genre: string[];
  readingSessions: ReadingSession[];
  currentSession?: string; // ID of the active reading session
}

export interface ReviewFormData {
  rating: number;
  text: string;
} 