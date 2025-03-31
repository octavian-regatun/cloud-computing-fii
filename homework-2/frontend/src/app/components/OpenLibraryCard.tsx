import { OpenLibraryTrendingBook } from '../types';

interface OpenLibraryCardProps {
  book: OpenLibraryTrendingBook;
}

export default function OpenLibraryCard({ book }: OpenLibraryCardProps) {
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
    : 'https://placehold.co/200x300?text=No+Cover';

  const workId = book.key?.split('/').pop() || '';
  
  const authors = book.author_name?.join(', ') || 'Unknown Author';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 md:w-1/4">
          <img 
            src={coverUrl} 
            alt={`Cover for ${book.title}`}
            className="w-full h-40 sm:h-full object-cover"
          />
        </div>
        
        <div className="p-4 sm:w-2/3 md:w-3/4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {authors}
          </p>
          
          {book.first_publish_year && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              First published: {book.first_publish_year}
            </p>
          )}
          
          <div className="mt-auto">
            <a 
              href={`https://openlibrary.org${book.key}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium mt-2"
            >
              View on Open Library →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 