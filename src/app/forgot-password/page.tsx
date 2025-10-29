'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // In production, make API call to send reset email
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage(
        'If an account with this email exists, you will receive a password reset link shortly.'
      );
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Lettex
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ayurvedic Wellness Marketplace
                </p>
              </div>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    {message}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Why Choose Lettex?
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <span>🌿</span>
                <span>Authentic Ayurvedic products</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🚚</span>
                <span>Free shipping over ₹500</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🔒</span>
                <span>Secure payments</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>↩️</span>
                <span>Easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}