import { useState, useEffect, useCallback, useRef } from 'react';
import { searchBooks, GoogleBooksError } from '../services/googleBooks';
import { transformBookResults, TransformedBook } from '../utils/bookDataTransform';

interface UseBookSearchResult {
  books: TransformedBook[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

interface UseBookSearchOptions {
  debounceMs?: number;
  maxResults?: number;
  cacheTimeout?: number;
}

// Cache for search results
const searchCache = new Map<
  string,
  { data: TransformedBook[]; timestamp: number }
>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBookSearch = (
  query: string,
  options: UseBookSearchOptions = {}
): UseBookSearchResult => {
  const {
    debounceMs = 300,
    maxResults = 10,
    cacheTimeout = CACHE_DURATION,
  } = options;

  const [books, setBooks] = useState<TransformedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const lastQuery = useRef(query);
  const abortController = useRef<AbortController | null>(null);

  const fetchBooks = useCallback(
    async (searchQuery: string, start: number = 0) => {
      // Check cache first
      const cacheKey = `${searchQuery}-${start}`;
      const cached = searchCache.get(cacheKey);
      
      if (
        cached &&
        Date.now() - cached.timestamp < cacheTimeout
      ) {
        setBooks(start === 0 ? cached.data : [...books, ...cached.data]);
        return;
      }

      // Cancel previous request
      if (abortController.current) {
        abortController.current.abort();
      }

      // Create new abort controller for this request
      abortController.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await searchBooks({
          q: searchQuery,
          maxResults,
          startIndex: start,
        });

        const transformedBooks = transformBookResults(response.items || []);
        
        // Update cache
        searchCache.set(cacheKey, {
          data: transformedBooks,
          timestamp: Date.now(),
        });

        setBooks(start === 0 ? transformedBooks : [...books, ...transformedBooks]);
        setHasMore(response.totalItems > start + maxResults);
        setStartIndex(start + maxResults);
      } catch (err) {
        if (err instanceof GoogleBooksError) {
          setError(err);
        } else {
          setError(new Error('Failed to fetch books'));
        }
      } finally {
        setLoading(false);
      }
    },
    [books, maxResults, cacheTimeout]
  );

  // Debounced search effect
  useEffect(() => {
    if (!query || query.length < 3) {
      setBooks([]);
      setHasMore(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (query !== lastQuery.current) {
        setStartIndex(0);
        lastQuery.current = query;
      }
      fetchBooks(query, 0);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [query, debounceMs, fetchBooks]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (!loading && hasMore && query) {
      await fetchBooks(query, startIndex);
    }
  }, [loading, hasMore, query, startIndex, fetchBooks]);

  // Clean up old cache entries
  useEffect(() => {
    const now = Date.now();
    searchCache.forEach((value, key) => {
      if (now - value.timestamp > cacheTimeout) {
        searchCache.delete(key);
      }
    });
  }, [cacheTimeout]);

  return {
    books,
    loading,
    error,
    hasMore,
    loadMore,
  };
}; 