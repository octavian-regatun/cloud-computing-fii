import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const imageUrl = article.urlToImage || 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-200"
        />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
          {article.source.name}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {article.author ? `By ${article.author}` : 'Unknown author'} · {formatDate(article.publishedAt)}
        </p>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {article.description || 'No description available'}
        </p>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          Read full article →
        </a>
      </div>
    </div>
  );
} 