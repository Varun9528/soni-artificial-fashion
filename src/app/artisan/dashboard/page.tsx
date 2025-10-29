'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';

interface Product {
  id: string;
  title: { en: string; hi: string };
  price: number;
  stock: number;
  productImages: { url: string }[];
  isActive: boolean;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  user: {
    name: string;
  };
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export default function ArtisanDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user session from API route instead of directly importing server session
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (!sessionData.user || sessionData.user.role !== 'artisan') {
          router.push('/login');
          return;
        }
        
        setUser(sessionData.user);
        
        // Fetch artisan data
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/artisan/dashboard/stats'),
          fetch('/api/artisan/products?limit=3'),
          fetch('/api/artisan/orders?limit=3')
        ]);

        const statsData = await statsRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        if (statsData.success) {
          setStats(statsData.stats);
        }

        if (productsData.success) {
          setProducts(productsData.products);
        }

        if (ordersData.success) {
          setOrders(ordersData.orders);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const t = (key: string) => {
    const translations: any = {
      en: {
        dashboard: "Artisan Dashboard",
        welcome: "Welcome back!",
        overview: "Overview",
        totalProducts: "Total Products",
        totalOrders: "Total Orders",
        totalRevenue: "Total Revenue",
        pendingOrders: "Pending Orders",
        lowStockProducts: "Low Stock Products",
        myProducts: "My Products",
        recentOrders: "Recent Orders",
        viewAll: "View All",
        addProduct: "Add Product",
        productImage: "Product Image",
        productName: "Product Name",
        price: "Price",
        stock: "Stock",
        status: "Status",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
        orderNumber: "Order Number",
        customer: "Customer",
        amount: "Amount",
        orderStatus: "Order Status",
        date: "Date",
        noProducts: "No products found.",
        noOrders: "No orders found.",
        logout: "Logout"
      },
      hi: {
        dashboard: "कारीगर डैशबोर्ड",
        welcome: "वापसी पर स्वागत है!",
        overview: "अवलोकन",
        totalProducts: "कुल उत्पाद",
        totalOrders: "कुल ऑर्डर",
        totalRevenue: "कुल राजस्व",
        pendingOrders: "लंबित ऑर्डर",
        lowStockProducts: "कम स्टॉक वाले उत्पाद",
        myProducts: "मेरे उत्पाद",
        recentOrders: "हाल के ऑर्डर",
        viewAll: "सभी देखें",
        addProduct: "उत्पाद जोड़ें",
        productImage: "उत्पाद छवि",
        productName: "उत्पाद का नाम",
        price: "मूल्य",
        stock: "स्टॉक",
        status: "स्थिति",
        actions: "कार्रवाई",
        edit: "संपादित करें",
        delete: "हटाएं",
        orderNumber: "ऑर्डर संख्या",
        customer: "ग्राहक",
        amount: "राशि",
        orderStatus: "ऑर्डर की स्थिति",
        date: "तारीख",
        noProducts: "कोई उत्पाद नहीं मिला।",
        noOrders: "कोई ऑर्डर नहीं मिला।",
        logout: "लॉगआउट"
      }
    };
    
    return translations[language][key] || key;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
              <p className="mt-1 text-sm text-gray-600">{t('welcome')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalProducts')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalOrders')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('totalRevenue')}</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('pendingOrders')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('lowStockProducts')}</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lowStockProducts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('myProducts')}</h3>
              <div className="flex space-x-2">
                <Link
                  href="/artisan/products/new"
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  {t('addProduct')}
                </Link>
                <Link
                  href="/artisan/products"
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  {t('viewAll')}
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                        <img
                          src={product.productImages[0]?.url || '/images/products/placeholder.jpg'}
                          alt={product.title.en}
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/products/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{product.title.en}</p>
                        <p className="text-sm text-gray-500">₹{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('stock')}</p>
                        <p className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                          {product.stock > 0 ? product.stock : 'Out of Stock'}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(product.isActive ? 'active' : 'inactive')}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/artisan/products/${product.id}/edit`}
                          className="text-amber-600 hover:text-amber-900 text-sm"
                        >
                          {t('edit')}
                        </Link>
                        <button className="text-red-600 hover:text-red-900 text-sm">
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">{t('noProducts')}</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('recentOrders')}</h3>
              <Link
                href="/artisan/orders"
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                {t('viewAll')}
              </Link>
            </div>
            
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.user.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('amount')}</p>
                        <p className="text-sm font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">{t('noOrders')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}