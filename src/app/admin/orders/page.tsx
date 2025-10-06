'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // In a real implementation, fetch from API
      // For now, we'll use mock data but with the correct structure
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          user: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          totalAmount: 2500,
          paymentStatus: 'COMPLETED',
          status: 'DELIVERED',
          createdAt: '2024-01-15',
          items: [
            { 
              product: { 
                title: { en: 'Bamboo Wall Art', hi: 'बांस की दीवार कला' } 
              }, 
              quantity: 1, 
              price: 1500 
            },
            { 
              product: { 
                title: { en: 'Tribal Jewelry Set', hi: 'जनजातीय आभूषण सेट' } 
              }, 
              quantity: 1, 
              price: 1000 
            }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          user: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          totalAmount: 1800,
          paymentStatus: 'COMPLETED',
          status: 'SHIPPED',
          createdAt: '2024-01-20',
          items: [
            { 
              product: { 
                title: { en: 'Handwoven Basket', hi: 'हाथ से बुनी टोकरी' } 
              }, 
              quantity: 2, 
              price: 900 
            }
          ]
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          user: {
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          totalAmount: 3200,
          paymentStatus: 'PENDING',
          status: 'PROCESSING',
          createdAt: '2024-01-25',
          items: [
            { 
              product: { 
                title: { en: 'Clay Pot Collection', hi: 'मिट्टी के बर्तनों का संग्रह' } 
              }, 
              quantity: 1, 
              price: 1200 
            },
            { 
              product: { 
                title: { en: 'Tribal Textile Art', hi: 'जनजातीय वस्त्र कला' } 
              }, 
              quantity: 1, 
              price: 2000 
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
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

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      // In a real implementation, update via API
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any } 
          : order
      ));
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleIssueRefund = async (orderId: string) => {
    try {
      // In a real implementation, issue refund via API
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus: 'REFUNDED' } 
          : order
      ));
      alert('Refund issued successfully');
    } catch (error) {
      console.error('Error issuing refund:', error);
      alert('Failed to issue refund');
    }
  };

  const handleSendNotification = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        // In a real implementation, send notification via API
        alert(`Notification sent to ${order.user.name} (${order.user.email})`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage all orders in your marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">{t('all')}</option>
                <option value="pending">{t('PENDING')}</option>
                <option value="confirmed">{t('CONFIRMED')}</option>
                <option value="processing">{t('PROCESSING')}</option>
                <option value="shipped">{t('SHIPPED')}</option>
                <option value="out-for-delivery">{t('OUT_FOR_DELIVERY')}</option>
                <option value="delivered">{t('DELIVERED')}</option>
                <option value="cancelled">{t('CANCELLED')}</option>
                <option value="returned">{t('RETURNED')}</option>
                <option value="refunded">{t('REFUNDED')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('orderId')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('customer')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('totalAmount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('paymentStatus')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('deliveryStatus')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                        <div className="text-sm text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {t(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDeliveryStatusColor(order.status)}`}>
                          {t(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            {t('viewDetails')}
                          </Link>
                          <select
                            value={order.status.toLowerCase()}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value.toUpperCase())}
                            className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value="pending">{t('PENDING')}</option>
                            <option value="confirmed">{t('CONFIRMED')}</option>
                            <option value="processing">{t('PROCESSING')}</option>
                            <option value="shipped">{t('SHIPPED')}</option>
                            <option value="out-for-delivery">{t('OUT_FOR_DELIVERY')}</option>
                            <option value="delivered">{t('DELIVERED')}</option>
                            <option value="cancelled">{t('CANCELLED')}</option>
                            <option value="returned">{t('RETURNED')}</option>
                            <option value="refunded">{t('REFUNDED')}</option>
                          </select>
                          <button
                            onClick={() => handleIssueRefund(order.id)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            {t('issueRefund')}
                          </button>
                          <button
                            onClick={() => handleSendNotification(order.id)}
                            className="text-green-600 hover:text-green-900 text-xs"
                          >
                            {t('sendNotification')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      {t('noOrders')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}