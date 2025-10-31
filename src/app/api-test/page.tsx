'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setResult(data);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setResult({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}