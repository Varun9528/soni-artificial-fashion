'use client';

import { useState, useEffect } from 'react';

export default function TestFetchPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Making fetch request to /api/products');
        const response = await fetch('/api/products');
        console.log('Response received:', response.status);
        const data = await response.json();
        console.log('Data received:', data);
        setResult(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Test Fetch Page
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Success: {result?.success ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Products: {result?.products?.length || 0}
            </p>
          </div>

          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}