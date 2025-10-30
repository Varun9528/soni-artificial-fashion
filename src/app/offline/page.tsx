'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-8">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📱</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You&#39;re Offline
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">You are currently offline</p>
          <p className="text-gray-500 mb-8">Please check your internet connection and try again.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What you can do offline:
            </h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Browse cached products and categories
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                View your shopping cart
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Read product descriptions and details
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Browse artisan profiles
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Your cart items and preferences are saved locally. When you reconnect, everything will sync automatically.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Browse Offline Content
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Lettex Ayurvedic Wellness Marketplace</p>
          <p>PWA • Offline Mode</p>
        </div>
      </div>
    </div>
  );
}