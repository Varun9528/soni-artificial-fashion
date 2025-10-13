'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  // Mock orders data (fallback if API fails)
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      status: 'delivered',
      totalAmount: 2500,
      createdAt: '2024-01-15',
      items: [
        { product: 'Bamboo Wall Art', quantity: 1, price: 1500 },
        { product: 'Tribal Jewelry Set', quantity: 1, price: 1000 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      status: 'shipped',
      totalAmount: 1800,
      createdAt: '2024-01-20',
      items: [
        { product: 'Handwoven Basket', quantity: 2, price: 900 }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      status: 'processing',
      totalAmount: 3200,
      createdAt: '2024-01-25',
      items: [
        { product: 'Clay Pot Collection', quantity: 1, price: 1200 },
        { product: 'Tribal Textile Art', quantity: 1, price: 2000 }
      ]
    }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setLanguage(savedLanguage);
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/user/orders');
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          // Fallback to mock data if API fails
          setOrders(mockOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "My Orders",
        description: "Track all your past and current orders.",
        orderId: "Order ID",
        date: "Date",
        itemsOrdered: "Items Ordered",
        totalAmount: "Total Amount",
        status: "Status",
        action: "Action",
        viewDetails: "View Details",
        emptyMessage: "You haven't placed any orders yet. Start shopping now!",
        processing: "Processing",
        shipped: "Shipped",
        outForDelivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled"
      }
    };
    
    return translations[language][key] || key;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'out-for-delivery': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return t('processing');
      case 'shipped': return t('shipped');
      case 'out-for-delivery': return t('outForDelivery');
      case 'delivered': return t('delivered');
      case 'cancelled': return t('cancelled');
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-2">{t('orderId')}</div>
                <div className="col-span-2">{t('date')}</div>
                <div className="col-span-3">{t('itemsOrdered')}</div>
                <div className="col-span-2">{t('totalAmount')}</div>
                <div className="col-span-2">{t('status')}</div>
                <div className="col-span-1 text-right">{t('action')}</div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <div key={order.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center">
                    <div className="md:col-span-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{order.orderNumber}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="md:col-span-3">
                      <p className="text-gray-900 dark:text-white">
                        {order.items.map(item => `${item.product} (${item.quantity})`).join(', ')}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="md:col-span-1 flex justify-end">
                      <Link
                        href={`/order/${order.id}`}
                        className="text-amber-600 hover:text-amber-800"
                      >
                        {t('viewDetails')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="mb-4">
                <span className="text-6xl">📦</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {t('emptyMessage')}
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
