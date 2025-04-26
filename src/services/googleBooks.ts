// Types for Google Books API responses
export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: GoogleBookItem[];
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
  saleInfo?: {
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

export interface BookSearchParams {
  q: string;
  maxResults?: number;
  startIndex?: number;
  langRestrict?: string;
  orderBy?: 'relevance' | 'newest';
  printType?: 'all' | 'books' | 'magazines';
}

export class GoogleBooksError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'GoogleBooksError';
  }
}

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1';

// Debug log
console.log('Environment variables:', {
  VITE_GOOGLE_BOOKS_API_KEY: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
});

// Validate API key is available
if (!GOOGLE_BOOKS_API_KEY) {
  console.error(
    'Google Books API key is not configured. Please add VITE_GOOGLE_BOOKS_API_KEY to your .env file.'
  );
}

/**
 * Search for books using the Google Books API
 */
export const searchBooks = async (
  params: BookSearchParams
): Promise<GoogleBooksResponse> => {
  if (!GOOGLE_BOOKS_API_KEY) {
    throw new GoogleBooksError(
      'Google Books API key is not configured. Please add VITE_GOOGLE_BOOKS_API_KEY to your .env file.'
    );
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('key', GOOGLE_BOOKS_API_KEY);
    
    // Add all params to the URLSearchParams object
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/volumes?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new GoogleBooksError(
        errorData.error?.message || `Failed to fetch books: ${response.statusText}`,
        response.status,
        errorData.error?.code
      );
    }

    const data = await response.json();
    
    // Handle empty response
    if (!data.items) {
      return {
        kind: 'books#volumes',
        totalItems: 0,
        items: []
      };
    }

    return data;
  } catch (error) {
    if (error instanceof GoogleBooksError) {
      throw error;
    }
    throw new GoogleBooksError(
      error instanceof Error ? error.message : 'Failed to fetch books'
    );
  }
};

/**
 * Get detailed information about a specific book
 */
export const getBookDetails = async (bookId: string): Promise<GoogleBookItem> => {
  if (!GOOGLE_BOOKS_API_KEY) {
    throw new GoogleBooksError(
      'Google Books API key is not configured. Please add VITE_GOOGLE_BOOKS_API_KEY to your .env file.'
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/volumes/${bookId}?key=${GOOGLE_BOOKS_API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new GoogleBooksError(
        errorData.error?.message || `Failed to fetch book details: ${response.statusText}`,
        response.status,
        errorData.error?.code
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof GoogleBooksError) {
      throw error;
    }
    throw new GoogleBooksError(
      error instanceof Error ? error.message : 'Failed to fetch book details'
    );
  }
};

// Cache for book covers to avoid re-fetching
const bookCoverCache = new Map<string, string>();

/**
 * Get a book cover URL with caching
 */
export const getBookCover = async (bookId: string): Promise<string | null> => {
  if (bookCoverCache.has(bookId)) {
    return bookCoverCache.get(bookId) || null;
  }

  try {
    const book = await getBookDetails(bookId);
    const coverUrl = book.volumeInfo.imageLinks?.thumbnail || null;
    
    if (coverUrl) {
      // Cache the cover URL
      bookCoverCache.set(bookId, coverUrl);
    }

    return coverUrl;
  } catch (error) {
    console.error('Failed to fetch book cover:', error);
    return null;
  }
}; 