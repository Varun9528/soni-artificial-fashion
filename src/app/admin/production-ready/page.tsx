'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  database: any;
  admin: any;
  overall: 'ready' | 'partial' | 'setup_required';
}

export default function ProductionReadinessPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const [dbResponse, adminResponse] = await Promise.all([
          fetch('/api/health/database'),
          fetch('/api/health/admin')
        ]);

        const database = await dbResponse.json();
        const admin = await adminResponse.json();

        const overall = 
          database.connected && admin.authenticated ? 'ready' :
          database.status !== 'error' && admin.status !== 'error' ? 'partial' :
          'setup_required';

        setStatus({ database, admin, overall });
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking system status...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Production Readiness Dashboard
          </h1>

          {status && (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Overall Status</h2>
                <div className={`px-4 py-2 rounded-lg inline-block ${
                  status.overall === 'ready' ? 'text-green-700 bg-green-100' :
                  status.overall === 'partial' ? 'text-yellow-700 bg-yellow-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  {status.overall === 'ready' ? '✅ Production Ready' :
                   status.overall === 'partial' ? '⚠️ Partially Ready' :
                   '❌ Setup Required'}
                </div>
              </div>

              {/* Database Status */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Database Status</h2>
                <div className={`px-4 py-2 rounded-lg mb-4 ${getStatusColor(status.database.status)}`}>
                  {status.database.status} - {status.database.message}
                </div>
                
                {status.database.setup_required && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Setup Required:</h3>
                    <ol className="list-decimal list-inside text-blue-800 space-y-1">
                      <li>Install MySQL: <code className="bg-blue-100 px-2 py-1 rounded">mysql -u root -p</code></li>
                      <li>Create database: <code className="bg-blue-100 px-2 py-1 rounded">CREATE DATABASE pachmarhi_db;</code></li>
                      <li>Run schema: <code className="bg-blue-100 px-2 py-1 rounded">mysql -u root -p pachmarhi_db &lt; database/schema.sql</code></li>
                      <li>Configure .env: Set DATABASE_URL or DB_* variables</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Admin Status */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
                <div className={`px-4 py-2 rounded-lg mb-4 ${getStatusColor(status.admin.status)}`}>
                  {status.admin.status} - {status.admin.message}
                </div>
                
                {status.admin.setup_required && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Setup Required:</h3>
                    <ol className="list-decimal list-inside text-blue-800 space-y-1">
                      <li>Generate JWT secret: <code className="bg-blue-100 px-2 py-1 rounded">openssl rand -base64 32</code></li>
                      <li>Set JWT_SECRET in .env</li>
                      <li>Set NEXTAUTH_SECRET in .env</li>
                      <li>Test login at: <a href="/admin" className="text-blue-600 underline">/admin</a></li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Next Steps for Production</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Immediate (1-2 days)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Set up database connection</li>
                      <li>• Test admin CRUD operations</li>
                      <li>• Verify authentication flow</li>
                      <li>• Replace image placeholders</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Short-term (1-2 weeks)</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Integrate payment gateway</li>
                      <li>• Add email services</li>
                      <li>• Implement image upload</li>
                      <li>• Polish UI consistency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}