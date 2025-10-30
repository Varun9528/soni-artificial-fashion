'use client';

import { useState, useEffect } from 'react';

export default function DatabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        const response = await fetch('/api/database-test');
        const data = await response.json();
        
        if (data.success) {
          setConnectionStatus(`Connected successfully! Found ${data.productCount} products.`);
        } else {
          setConnectionStatus('Connection failed');
          setError(data.error);
        }
      } catch (err) {
        setConnectionStatus('Connection failed');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testDatabaseConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Database Connection Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Connection Status:</h2>
          <p className={`text-lg ${error ? 'text-red-600' : 'text-green-600'}`}>
            {connectionStatus}
          </p>
        </div>
        
        {error && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Error Details:</h2>
            <p className="text-red-600 bg-red-50 p-3 rounded">
              {error}
            </p>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">Environment Variables:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>DB_HOST: {process.env.NEXT_PUBLIC_DB_HOST || 'Not set'}</li>
            <li>DB_USER: {process.env.NEXT_PUBLIC_DB_USER || 'Not set'}</li>
            <li>DB_NAME: {process.env.NEXT_PUBLIC_DB_NAME || 'Not set'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}