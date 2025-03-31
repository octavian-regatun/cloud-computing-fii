import { Book } from '../types';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {book.author?.name || `Author ID: ${book.author_id}`}
        </p>
        
        {book.publication_year && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Published: {book.publication_year}
          </p>
        )}
        
        {book.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {book.description}
          </p>
        )}
        
        <Link 
          href={`/books/${book.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-3 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 