import { useState, useEffect } from 'react';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    pageCount?: number;
    categories?: string[];
    description?: string;
    publishedDate?: string;
  };
}

interface UseGoogleBooksSearch {
  books: GoogleBook[];
  loading: boolean;
  error: string | null;
  searchBooks: (query: string) => void;
}

export const useGoogleBooksSearch = (): UseGoogleBooksSearch => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return { books, loading, error, searchBooks };
}; 