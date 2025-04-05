import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchNewsData } from '../store/slices/newsSlice';

const NewsSection: React.FC = () => {
  const dispatch = useDispatch();

  // Debugging: Check Redux state structure
  const state = useSelector((state: RootState) => state);
  console.log("Redux State:", state);

  // Ensure `news` exists before accessing its properties
  const loading = useSelector((state: RootState) => state.news?.loading ?? false);
  const error = useSelector((state: RootState) => state.news?.error ?? null);
  const articles = useSelector((state: RootState) => state.news?.articles ?? []);

  // Fetch news on component mount
  useEffect(() => {
    dispatch(fetchNewsData() as any);

    // Set up interval to fetch news every 60 seconds
    const newsInterval = setInterval(() => {
      dispatch(fetchNewsData() as any);
    }, 60000);

    return () => clearInterval(newsInterval);
  }, [dispatch]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest News</h2>
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading news...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {articles.map((article, index) => (
          <li key={index} className="border-b border-gray-200 pb-3 last:border-0">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
              {article.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{article.description}</p>
              )}
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>{article.source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
