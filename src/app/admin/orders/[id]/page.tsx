'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
  paymentMethod: string;
  trackingNumber: string;
  shippingPartner: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    product: {
      title: { en: string; hi: string };
      images: { url: string }[];
    };
    quantity: number;
    price: number;
  }[];
  statusHistory: {
    status: string;
    note: string;
    createdAt: string;
  }[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // In a real implementation, fetch order details from API
    // For now, we'll use mock data
    const mockOrder: Order = {
      id: 'ORD-2024-001',
      orderNumber: 'ORD-2024-001',
      user: {
        name: 'Amit Sharma',
        email: 'amit.sharma@example.com',
        phone: '+91 9876543210'
      },
      address: {
        name: 'Amit Sharma',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210'
      },
      totalAmount: 4297,
      subtotal: 3500,
      shippingFee: 500,
      tax: 297,
      discount: 0,
      paymentStatus: 'COMPLETED',
      status: 'DELIVERED',
      paymentMethod: 'Credit Card',
      trackingNumber: 'TN123456789IN',
      shippingPartner: 'India Post',
      estimatedDelivery: '2024-01-20',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      items: [
        {
          id: '1',
          product: {
            title: { en: 'Bamboo Wall Art', hi: 'बांस की दीवार कला' },
            images: [{ url: '/images/products/prod-bamboo-wall-art.jpg' }]
          },
          quantity: 1,
          price: 1500
        },
        {
          id: '2',
          product: {
            title: { en: 'Tribal Jewelry Set', hi: 'जनजातीय आभूषण सेट' },
            images: [{ url: '/images/products/prod-tribal-jewelry.jpg' }]
          },
          quantity: 1,
          price: 1000
        }
      ],
      statusHistory: [
        {
          status: 'PENDING',
          note: 'Order placed',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          status: 'CONFIRMED',
          note: 'Order confirmed',
          createdAt: '2024-01-15T11:00:00Z'
        },
        {
          status: 'PROCESSING',
          note: 'Order processing',
          createdAt: '2024-01-15T12:00:00Z'
        },
        {
          status: 'SHIPPED',
          note: 'Order shipped',
          createdAt: '2024-01-16T09:00:00Z'
        },
        {
          status: 'OUT_FOR_DELIVERY',
          note: 'Out for delivery',
          createdAt: '2024-01-19T08:00:00Z'
        },
        {
          status: 'DELIVERED',
          note: 'Order delivered',
          createdAt: '2024-01-20T14:15:00Z'
        }
      ]
    };

    setOrder(mockOrder);
    setLoading(false);
  }, [params.id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    
    setUpdating(true);
    try {
      // In a real implementation, update via API
      setOrder({
        ...order,
        status: newStatus as any,
        statusHistory: [
          ...order.statusHistory,
          {
            status: newStatus,
            note: `Status updated to ${newStatus}`,
            createdAt: new Date().toISOString()
          }
        ]
      });
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleIssueRefund = async () => {
    if (!order) return;
    
    if (confirm('Are you sure you want to issue a refund for this order?')) {
      setUpdating(true);
      try {
        // In a real implementation, issue refund via API
        setOrder({
          ...order,
          paymentStatus: 'REFUNDED'
        });
        alert('Refund issued successfully');
      } catch (error) {
        console.error('Error issuing refund:', error);
        alert('Failed to issue refund');
      } finally {
        setUpdating(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-indigo-100 text-indigo-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RETURNED': return 'bg-gray-100 text-gray-800';
      case 'REFUNDED': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mt-2 text-gray-600">The order you're looking for doesn't exist.</p>
          <Link href="/admin/orders" className="mt-4 inline-block text-amber-600 hover:text-amber-800">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/orders" className="text-amber-600 hover:text-amber-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Items</h2>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
                        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={item.product.images[0]?.url || '/images/products/placeholder.jpg'}
                            alt={item.product.title.en}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/products/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.product.title.en}</h3>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="mt-1 text-sm text-gray-500">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{order.shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">₹{order.tax.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">-₹{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-medium">
                      <span>Total</span>
                      <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Status History</h2>
                  <div className="flow-root">
                    <ul className="relative border-l border-gray-200">
                      {order.statusHistory.map((history, index) => (
                        <li key={index} className="mb-10 ml-6">
                          <div className="absolute -left-3 mt-1.5">
                            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="text-sm font-medium text-gray-900">{history.status.replace('_', ' ')}</div>
                            <div className="mt-1 text-sm text-gray-500">{history.note}</div>
                            <div className="mt-2 text-xs text-gray-400">
                              {new Date(history.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div>
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-sm text-gray-500">{order.user.email}</p>
                        <p className="text-sm text-gray-500">{order.user.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{order.address.name}</p>
                      <p className="text-sm text-gray-500">{order.address.address}</p>
                      <p className="text-sm text-gray-500">{order.address.city}, {order.address.state} {order.address.pincode}</p>
                      <p className="text-sm text-gray-500">{order.address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="text-sm text-gray-900">{order.paymentMethod}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tracking Number</span>
                          <span className="text-sm text-gray-900">{order.trackingNumber}</span>
                        </div>
                      )}
                      {order.shippingPartner && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Shipping Partner</span>
                          <span className="text-sm text-gray-900">{order.shippingPartner}</span>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Estimated Delivery</span>
                          <span className="text-sm text-gray-900">
                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Update Status
                      </label>
                      <select
                        id="status"
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleUpdateStatus(e.target.value.toUpperCase())}
                        disabled={updating}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                    <button
                      onClick={handleIssueRefund}
                      disabled={updating || order.paymentStatus === 'REFUNDED'}
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {order.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Issue Refund'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}