'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '../../types';
import { fetchBook } from '../../services/api';
import Link from 'next/link';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBook() {
      if (!params.id) {
        setError('Book ID is required');
        setLoading(false);
        return;
      }

      try {
        const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
        const bookData = await fetchBook(Number(bookId));
        
        if (bookData) {
          setBook(bookData);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        setError('Failed to load book details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Failed to load book details'}</span>
        <button 
          onClick={() => router.back()}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full">
              {book.authorName || book.author?.name || `Author ID: ${book.authorId || book.author_id}`}
            </div>
            
            {(book.publicationYear || book.publication_year) && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Published in {book.publicationYear || book.publication_year}
              </div>
            )}
            
            {book.isbn && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ISBN: {book.isbn}
              </div>
            )}
          </div>

          {book.description ? (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic mb-8">No description available for this book.</p>
          )}

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Book Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Title</dt>
                <dd className="text-gray-900 dark:text-white">{book.title}</dd>
              </div>
              
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Author</dt>
                <dd className="text-gray-900 dark:text-white">{book.authorName || book.author?.name || `ID: ${book.authorId || book.author_id}`}</dd>
              </div>
              
              {(book.publicationYear || book.publication_year) && (
                <div className="flex flex-col">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Publication Year</dt>
                  <dd className="text-gray-900 dark:text-white">{book.publicationYear || book.publication_year}</dd>
                </div>
              )}
              
              {book.isbn && (
                <div className="flex flex-col">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">ISBN</dt>
                  <dd className="text-gray-900 dark:text-white">{book.isbn}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 