'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const { language } = useLanguage();
  const { user: authUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authUser) {
      router.push('/login');
      return;
    }

    fetchOrderDetails();
  }, [authUser, router]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching order details for order number:', params.id);
      const response = await fetch(`/api/user/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Order details API response:', data);
      
      if (response.ok && data.success) {
        setOrder(data.order);
        console.log('Order details set:', data.order);
      } else {
        // Handle error responses
        console.error('Error fetching order details for order number', params.id, ':', data.error || 'Unknown error');
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error('Network error fetching order details:', error);
      // You might want to show a network error message to the user
    } finally {
      setLoading(false);
    }
  };

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        orderDetails: 'Order Details',
        orderId: 'Order ID',
        orderDate: 'Order Date',
        paymentStatus: 'Payment Status',
        deliveryStatus: 'Delivery Status',
        shippingAddress: 'Shipping Address',
        billingAddress: 'Billing Address',
        items: 'Items',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax',
        discount: 'Discount',
        orderTotal: 'Order Total',
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        outForDelivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned',
        refunded: 'Refunded',
        backToOrders: 'Back to Orders'
      },
      hi: {
        orderDetails: 'आदेश विवरण',
        orderId: 'आदेश आईडी',
        orderDate: 'आदेश तारीख',
        paymentStatus: 'भुगतान की स्थिति',
        deliveryStatus: 'डिलीवरी की स्थिति',
        shippingAddress: 'शिपिंग पता',
        billingAddress: 'बिलिंग पता',
        items: 'आइटम',
        quantity: 'मात्रा',
        price: 'कीमत',
        total: 'कुल',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        tax: 'कर',
        discount: 'छूट',
        orderTotal: 'आदेश कुल',
        pending: 'लंबित',
        confirmed: 'पुष्टि की गई',
        processing: 'प्रसंस्करण',
        shipped: 'भेज दिया गया',
        outForDelivery: 'डिलीवरी के लिए निकला',
        delivered: 'डिलीवर किया गया',
        cancelled: 'रद्द किया गया',
        returned: 'वापस किया गया',
        refunded: 'धनवापसी की गई',
        backToOrders: 'आदेशों पर वापस जाएं'
      }
    };
    
    return translations[language][key] || key;
  };

  const getStatusText = (status: string) => {
    const statusMap: any = {
      pending: t('pending'),
      confirmed: t('confirmed'),
      processing: t('processing'),
      shipped: t('shipped'),
      'out-for-delivery': t('outForDelivery'),
      delivered: t('delivered'),
      cancelled: t('cancelled'),
      returned: t('returned'),
      refunded: t('refunded')
    };
    
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'cancelled':
      case 'returned':
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Please login to view order details' : 'आदेश विवरण देखने के लिए कृपया लॉगिन करें'}
          </h1>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            {language === 'en' ? 'Go to Login' : 'लॉगिन पर जाएं'}
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Order not found' : 'आदेश नहीं मिला'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {language === 'en' 
              ? `Could not find order ${params.id}. Please check the order number and try again.` 
              : `आदेश ${params.id} नहीं मिला। कृपया आदेश संख्या जांचें और पुनः प्रयास करें।`}
          </p>
          <button 
            onClick={() => router.push('/profile?tab=orders')}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            {language === 'en' ? 'Back to Orders' : 'आदेशों पर वापस जाएं'}
          </button>
        </div>
      </div>
    );
  }

  // Parse address data if it's a JSON string
  const shippingAddress = typeof order.shipping_address === 'string' 
    ? JSON.parse(order.shipping_address || '{}') 
    : order.shipping_address || {};
    
  const billingAddress = typeof order.billing_address === 'string' 
    ? JSON.parse(order.billing_address || '{}') 
    : order.billing_address || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('orderDetails')}
          </h1>
          <button 
            onClick={() => router.push('/profile?tab=orders')}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
          >
            {t('backToOrders')}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('orderId')}: #{order.order_number || order.orderNumber || 'N/A'}
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{t('orderDate')}:</span> {
                    order.created_at 
                      ? new Date(order.created_at).toLocaleDateString() 
                      : 'Invalid Date'
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{t('paymentStatus')}:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status || 'N/A'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{t('deliveryStatus')}:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              {/* Delivery Agent Information */}
              {(order.deliveryAgentName || order.delivery_agent_name) && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Delivery Agent</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Name:</strong> {order.deliveryAgentName || order.delivery_agent_name}
                  </p>
                  {(order.deliveryAgentPhone || order.delivery_agent_phone) && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Phone:</strong> {order.deliveryAgentPhone || order.delivery_agent_phone}
                    </p>
                  )}
                </div>
              )}
              
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('orderTotal')}: ₹{(order.total_amount || order.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('shippingAddress')}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>{shippingAddress.fullName || shippingAddress.full_name || 'N/A'}</p>
            <p>{shippingAddress.addressLine1 || 'N/A'}</p>
            {(shippingAddress.addressLine2) && <p>{shippingAddress.addressLine2}</p>}
            <p>
              {shippingAddress.city || 'N/A'}, {shippingAddress.state || 'N/A'} - {shippingAddress.pincode || 'N/A'}
            </p>
            <p>Phone: {shippingAddress.phone || 'N/A'}</p>
          </div>
        </div>
        
        {/* Billing Address */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('billingAddress')}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>{billingAddress.fullName || billingAddress.full_name || 'N/A'}</p>
            <p>{billingAddress.addressLine1 || 'N/A'}</p>
            {(billingAddress.addressLine2) && <p>{billingAddress.addressLine2}</p>}
            <p>
              {billingAddress.city || 'N/A'}, {billingAddress.state || 'N/A'} - {billingAddress.pincode || 'N/A'}
            </p>
            <p>Phone: {billingAddress.phone || 'N/A'}</p>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('items')}</h2>
          <div className="space-y-4">
            {order.items && order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  {item.product_image ? (
                    <img 
                      src={item.product_image} 
                      alt={item.product_name || 'Product Image'} 
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center">No Image</div>
                  )}
                </div>
                
                <div className="ml-4 flex-grow">
                  <h4 className="text-gray-900 dark:text-white font-medium">
                    {item.product_name || 'Unknown Product'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('quantity')}: {item.quantity || 1}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white font-medium">
                    ₹{(item.price || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t('total')}: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('subtotal')}</span>
              <span className="text-gray-900 dark:text-white">₹{(order.subtotal || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
              <span className="text-gray-900 dark:text-white">₹{(order.shipping_cost || 0).toLocaleString()}</span>
            </div>
            
            {(order.tax_amount > 0) && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('tax')}</span>
                <span className="text-gray-900 dark:text-white">₹{(order.tax_amount || 0).toLocaleString()}</span>
              </div>
            )}
            
            {(order.discount_amount > 0) && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('discount')}</span>
                <span className="text-green-600 dark:text-green-400">-₹{(order.discount_amount || 0).toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{t('orderTotal')}</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">₹{(order.total_amount || order.totalAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}