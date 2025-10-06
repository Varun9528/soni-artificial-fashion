'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/admin/NotificationBell';
import { useNotifications } from '@/context/NotificationContext';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  newOrdersToday: number;
  revenueToday: number;
  lowStockProducts: number;
  pendingReturns: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

// Mock localization function (in production, use a proper i18n library)
const t = (key: string, lang: string = 'en') => {
  const translations: any = {
    en: {
      lowStockAlert: "Low Stock Alert: Product {name} stock below 5.",
      newOrder: "New Order: Order #{orderId} placed by {customerName}.",
      returnRequest: "Return Request: Customer requested return for #{orderId}.",
      revenueReport: "Revenue Report: Daily revenue ₹{amount}, New customers: {count}."
    },
    hi: {
      lowStockAlert: "कम स्टॉक चेतावनी: प्रोडक्ट {name} स्टॉक 5 से कम है।",
      newOrder: "नया ऑर्डर: ऑर्डर #{orderId} {customerName} द्वारा दिया गया।",
      returnRequest: "वापसी अनुरोध: ग्राहक ने #{orderId} के लिए वापसी का अनुरोध किया है।",
      revenueReport: "रेवेन्यू रिपोर्ट: दैनिक रेवेन्यू ₹{amount}, नए ग्राहक: {count}।"
    }
  };
  
  return translations[lang][key] || key;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    newOrdersToday: 0,
    revenueToday: 0,
    lowStockProducts: 0,
    pendingReturns: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Mock data - in real app, fetch from APIs
    setTimeout(() => {
      setStats({
        totalOrders: 1247,
        totalRevenue: 245680,
        totalProducts: 156,
        totalCustomers: 892,
        newOrdersToday: 23,
        revenueToday: 12450,
        lowStockProducts: 8,
        pendingReturns: 5
      });

      setRecentOrders([
        {
          id: 'ORD001',
          customerName: 'John Doe',
          amount: 2499,
          status: 'Pending',
          date: '2024-09-30'
        },
        {
          id: 'ORD002',
          customerName: 'Jane Smith',
          amount: 1299,
          status: 'Confirmed',
          date: '2024-09-30'
        },
        {
          id: 'ORD003',
          customerName: 'Mike Johnson',
          amount: 899,
          status: 'Shipped',
          date: '2024-09-29'
        }
      ]);

      setIsLoading(false);
      
      // Set language from localStorage
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
      
      // Add some mock notifications
      addNotification({
        type: 'warning',
        title: 'Low Stock Alert',
        message: t('lowStockAlert', savedLanguage).replace('{name}', 'Bamboo Wall Art')
      });
      
      addNotification({
        type: 'info',
        title: 'New Order',
        message: t('newOrder', savedLanguage).replace('{orderId}', 'ORD001').replace('{customerName}', 'John Doe')
      });
    }, 1000);
  }, [addNotification]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
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
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Pachmarhi Tribal Art Marketplace</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-green-600">+{stats.newOrdersToday} today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+₹{stats.revenueToday.toLocaleString()} today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-red-600">{stats.lowStockProducts} low stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
                <p className="text-sm text-blue-600">Active users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link
                href="/admin/orders"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/products/new"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="text-2xl mr-3">➕</span>
                <div>
                  <div className="font-medium text-gray-900">Add Product</div>
                  <div className="text-sm text-gray-600">Create new product</div>
                </div>
              </Link>

              <Link
                href="/admin/orders?status=pending"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="text-2xl mr-3">⏳</span>
                <div>
                  <div className="font-medium text-gray-900">Pending Orders</div>
                  <div className="text-sm text-gray-600">{stats.newOrdersToday} to process</div>
                </div>
              </Link>

              <Link
                href="/admin/products?filter=low-stock"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <div className="font-medium text-gray-900">Low Stock</div>
                  <div className="text-sm text-gray-600">{stats.lowStockProducts} products</div>
                </div>
              </Link>

              <Link
                href="/admin/returns"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <span className="text-2xl mr-3">↩️</span>
                <div>
                  <div className="font-medium text-gray-900">Returns</div>
                  <div className="text-sm text-gray-600">{stats.pendingReturns} pending</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Sections</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/products"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-900">Products</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm font-medium text-gray-900">Orders</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">🏷️</span>
              <span className="text-sm font-medium text-gray-900">Categories</span>
            </Link>

            <Link
              href="/admin/artisans"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">👨‍🎨</span>
              <span className="text-sm font-medium text-gray-900">Artisans</span>
            </Link>

            <Link
              href="/admin/banners"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">🖼️</span>
              <span className="text-sm font-medium text-gray-900">Banners</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}