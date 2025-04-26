import { GoogleBookItem } from '../services/googleBooks';

export interface TransformedBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  totalPages: number;
  description: string;
  genre: string[];
  rating?: number;
  estimatedMinutes?: number;
  publishedDate?: string;
  publisher?: string;
  language?: string;
  previewLink?: string;
}

const FALLBACK_COVER = '/images/book-placeholder.png';
const AVERAGE_WORDS_PER_PAGE = 250;
const AVERAGE_READING_SPEED = 250; // words per minute

/**
 * Transform a Google Books API item into our app's book format
 */
export const transformBookData = (book: GoogleBookItem): TransformedBook => {
  const {
    id,
    volumeInfo: {
      title,
      authors,
      pageCount,
      description,
      categories,
      averageRating,
      imageLinks,
      publishedDate,
      publisher,
      language,
      previewLink,
    },
  } = book;

  // Calculate estimated reading time
  const estimatedMinutes = pageCount
    ? Math.round((pageCount * AVERAGE_WORDS_PER_PAGE) / AVERAGE_READING_SPEED)
    : undefined;

  return {
    id,
    title,
    author: authors?.join(', ') || 'Unknown Author',
    coverUrl: imageLinks?.thumbnail || FALLBACK_COVER,
    totalPages: pageCount || 0,
    description: description || 'No description available',
    genre: categories || ['Uncategorized'],
    rating: averageRating,
    estimatedMinutes,
    publishedDate,
    publisher,
    language,
    previewLink,
  };
};

/**
 * Transform multiple Google Books API items
 */
export const transformBookResults = (
  books: GoogleBookItem[]
): TransformedBook[] => {
  return books.map(transformBookData);
};

/**
 * Format a date string from Google Books API
 */
export const formatPublishedDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Format a book description with a maximum length
 */
export const formatDescription = (
  description?: string,
  maxLength: number = 200
): string => {
  if (!description) return 'No description available';
  
  if (description.length <= maxLength) return description;
  
  const truncated = description.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return `${truncated.slice(0, lastSpace)}...`;
};

// Cache for transformed book data
const bookCache = new Map<string, TransformedBook>();

/**
 * Get transformed book data with caching
 */
export const getCachedBookData = (
  book: GoogleBookItem
): TransformedBook => {
  if (bookCache.has(book.id)) {
    return bookCache.get(book.id)!;
  }

  const transformedBook = transformBookData(book);
  bookCache.set(book.id, transformedBook);
  return transformedBook;
}; 