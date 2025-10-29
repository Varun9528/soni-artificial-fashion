'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalArtisans: 0,
    totalRevenue: 0,
    lastUpdated: new Date()
  });
  const [loading, setLoading] = useState(true);

  // Add timeAgo function
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    fetchDashboardStats();
  }, [user, router]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all dashboard stats
      const [
        productsRes,
        ordersRes,
        usersRes,
        artisansRes,
        revenueRes
      ] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/users'),
        fetch('/api/admin/artisans'),
        fetch('/api/admin/analytics/sales-overview')
      ]);

      let productsCount = 0;
      if (productsRes.ok) {
        const data = await productsRes.json();
        productsCount = data.count || 0;
      }

      let ordersCount = 0;
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        ordersCount = data.count || 0;
      }

      let usersCount = 0;
      if (usersRes.ok) {
        const data = await usersRes.json();
        usersCount = data.count || 0;
      }

      let artisansCount = 0;
      if (artisansRes.ok) {
        const data = await artisansRes.json();
        artisansCount = data.count || 0;
      }

      let totalRevenue = 0;
      if (revenueRes.ok) {
        const data = await revenueRes.json();
        totalRevenue = data.data?.totalRevenue || 0;
      }

      setStats({
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalUsers: usersCount,
        totalArtisans: artisansCount,
        totalRevenue: totalRevenue,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500',
      href: '/admin/products'
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: '📋',
      color: 'bg-green-500',
      href: '/admin/orders'
    },
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-purple-500',
      href: '/admin/users'
    },
    {
      name: 'Total Artisans',
      value: stats.totalArtisans,
      icon: '👨‍🎨',
      color: 'bg-amber-500',
      href: '/admin/artisans'
    },
    {
      name: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: '💰',
      color: 'bg-teal-500',
      href: '/admin/analytics'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || 'Admin'}! Here&#39;s what&#39;s happening with your store today.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Last updated {timeAgo(stats.lastUpdated)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
          {statCards.map((stat, index) => (
            <Link 
              key={index} 
              href={stat.href}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <span className="text-white text-xl">{stat.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8">
                <div className="text-gray-400">
                  <p>Recent orders will appear here</p>
                  <p className="text-sm mt-2">Orders placed by customers will be shown here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/products/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-2xl mb-2">➕</span>
                  <span className="text-sm font-medium text-gray-700">Add Product</span>
                </Link>
                <Link
                  href="/admin/artisans/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-2xl mb-2">👨‍🎨</span>
                  <span className="text-sm font-medium text-gray-700">Add Artisan</span>
                </Link>
                <Link
                  href="/admin/categories/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-2xl mb-2">🏷️</span>
                  <span className="text-sm font-medium text-gray-700">Add Category</span>
                </Link>
                <Link
                  href="/admin/banners/new"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="text-2xl mb-2">🖼️</span>
                  <span className="text-sm font-medium text-gray-700">Add Banner</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}