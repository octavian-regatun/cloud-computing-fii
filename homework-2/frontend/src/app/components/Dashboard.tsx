import { useEffect, useState } from 'react';
import { DashboardData } from '../types';
import { fetchDashboard, searchOpenLibrary } from '../services/api';
import BookCard from './BookCard';
import WeatherWidget from './WeatherWidget';
import OpenLibraryCard from './OpenLibraryCard';

interface BookApiResponse {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  publicationYear?: number;
  isbn?: string;
  description?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await fetchDashboard();
        
        if (dashboardData) {
          if (dashboardData.books.length === 0) {
            const booksResponse = await fetch('http://localhost:8081/api/books');
            if (booksResponse.ok) {
              const booksData = await booksResponse.json();
              if (booksData && booksData.data && Array.isArray(booksData.data)) {
                const mappedBooks = booksData.data.map((book: BookApiResponse) => ({
                  id: book.id,
                  title: book.title,
                  author_id: book.authorId,
                  publication_year: book.publicationYear,
                  isbn: book.isbn,
                  description: book.description,
                  author: {
                    id: book.authorId,
                    name: book.authorName
                  }
                }));
                
                dashboardData.books = mappedBooks;
              }
            }
          }
          
          setData(dashboardData);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('Error connecting to the backend services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleOpenLibrarySearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const openLibraryData = await searchOpenLibrary(searchQuery);
      if (openLibraryData && data) {
        setData({
          ...data,
          trendingBooks: openLibraryData.map(book => ({
            key: book.key,
            title: book.title,
            author_name: book.author_name,
            cover_i: book.cover_i,
            first_publish_year: book.first_publish_year
          }))
        });
      }
    } catch (err) {
      console.error('Failed to search Open Library:', err);
    } finally {
      setSearchLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Failed to load data'}</span>
        <p className="mt-2">Please make sure the backend services are running.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Books */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
            {data.books.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-4">No books found</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Column: Weather and Open Library */}
      <div className="space-y-6">
        {/* Weather Widget */}
        <WeatherWidget initialWeather={data.weather} />
        
        {/* Open Library Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Open Library Books</h2>
            
            <form onSubmit={handleOpenLibrarySearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books"
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-md disabled:opacity-70"
              >
                {searchLoading ? '...' : 'Search'}
              </button>
            </form>
          </div>
          
          <div className="space-y-4">
            {data.trendingBooks.map((book, index) => (
              <OpenLibraryCard key={`${book.key}-${index}`} book={book} />
            ))}
            
            {data.trendingBooks.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No books found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}