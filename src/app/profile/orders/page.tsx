'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token || !user) return;

    let isMounted = true;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        const data = await response.json();
        
        // Check if component is still mounted before setting state
        if (isMounted) {
          if (data.success) {
            // Transform the data to match the expected structure - USE ONLY THE API DATA DIRECTLY
            const transformedOrders = data.orders.map((order: any) => ({
              id: order.id,
              orderNumber: order.order_number, // ALWAYS USE THE ORDER_NUMBER FROM API
              order_number: order.order_number, // Keep original for reference
              status: order.status?.toLowerCase() || 'processing',
              totalAmount: order.total_amount || 0,
              createdAt: order.created_at || new Date().toISOString(),
              items: order.items?.map((item: any) => ({
                product: {
                  title: {
                    en: item.product_name || 'Unknown Product',
                    hi: item.product_name || 'अज्ञात उत्पाद'
                  }
                },
                quantity: item.quantity || 1,
                price: item.price || 0
              })) || []
            }));
            console.log('Setting transformed orders with correct order numbers:', transformedOrders);
            setOrders(transformedOrders);
          } else {
            console.error('Failed to fetch orders:', data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (isMounted) {
          console.error('Network error while fetching orders');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [token, user]);

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
                        {order.createdAt && !isNaN(new Date(order.createdAt).getTime()) ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="md:col-span-3">
                      <p className="text-gray-900 dark:text-white">
                        {order.items.map((item: { product: { title: { en: string } }, quantity: number }) => `${item.product.title.en} (${item.quantity})`).join(', ')}
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
                      <button
                        onClick={() => {
                          console.log('View Details clicked. Using order number:', order.orderNumber);
                          // ALWAYS use the orderNumber which is the correct order_number from API
                          router.push(`/profile/orders/${order.orderNumber}`);
                        }}
                        className="text-amber-600 hover:text-amber-800 bg-transparent border-none cursor-pointer"
                      >
                        {t('viewDetails')}
                      </button>
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
              <button
                onClick={() => router.push('/')}
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}