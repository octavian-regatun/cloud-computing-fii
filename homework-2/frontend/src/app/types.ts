export interface Book {
  id: number;
  title: string;
  authorId?: number;
  authorName?: string;
  publicationYear?: number;
  isbn?: string;
  description?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author_id?: number;
  publication_year?: number;
  author?: Author;
}

export interface Author {
  id: number;
  name: string;
  birth_date?: string;
  death_date?: string;
  biography?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Review {
  id: number;
  book_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
  publisher?: string[];
  number_of_pages_median?: number;
  language?: string[];
}

export interface OpenLibraryTrendingBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  cover_edition_key?: string;
  ia?: string;
  author_key?: string[];
}

export interface OpenLibrarySearchResult {
  numFound: number;
  start: number;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryTrending {
  works: OpenLibraryTrendingBook[];
}

export interface DashboardData {
  books: Book[];
  weather: WeatherData;
  trendingBooks: OpenLibraryTrendingBook[];
} 