'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
  createdAt: string;
  items: {
    product: {
      title: { en: string; hi: string };
    };
    quantity: number;
    price: number;
  }[];
}

export default function AdminOrderManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Order Management",
        searchPlaceholder: "Search orders...",
        filterByStatus: "Filter by Status",
        all: "All",
        processing: "Processing",
        shipped: "Shipped",
        outForDelivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
        orderId: "Order ID",
        customer: "Customer",
        totalAmount: "Total Amount",
        paymentStatus: "Payment Status",
        deliveryStatus: "Delivery Status",
        date: "Date",
        actions: "Actions",
        viewDetails: "View Details",
        updateStatus: "Update Status",
        issueRefund: "Issue Refund",
        sendNotification: "Send Notification",
        noOrders: "No orders found matching your criteria.",
        PENDING: "Pending",
        PROCESSING: "Processing",
        COMPLETED: "Completed",
        FAILED: "Failed",
        REFUNDED: "Refunded",
        CONFIRMED: "Confirmed",
        SHIPPED: "Shipped",
        OUT_FOR_DELIVERY: "Out for Delivery",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
        RETURNED: "Returned"
      }
    };
    
    return translations[language][key] || key;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RETURNED': return 'bg-orange-100 text-orange-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all orders in your marketplace
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">{t('all')}</option>
              <option value="processing">{t('processing')}</option>
              <option value="shipped">{t('shipped')}</option>
              <option value="outForDelivery">{t('outForDelivery')}</option>
              <option value="delivered">{t('delivered')}</option>
              <option value="cancelled">{t('cancelled')}</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orderId')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {t('customer')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('totalAmount')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    {t('paymentStatus')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('deliveryStatus')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {t('date')}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                      {t('noOrders')}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {order.user.name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900">{order.user.name}</div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{order.totalAmount}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {t(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDeliveryStatusColor(order.status)}`}>
                          <span className="hidden sm:inline">{t(order.status)}</span>
                          <span className="sm:hidden">
                            {order.status === 'DELIVERED' ? '✅' : 
                             order.status === 'SHIPPED' ? '🚚' : 
                             order.status === 'PROCESSING' ? '⚙️' : '⏳'}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          {t('viewDetails')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}