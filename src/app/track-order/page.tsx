'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Phone, Truck } from 'lucide-react';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [language, setLanguage] = useState('en');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Track Your Order",
        description: "Enter your order ID to track the status of your shipment",
        orderIdLabel: "Order ID",
        orderIdPlaceholder: "Enter your order ID (e.g. ORD-123456789)",
        trackButton: "Track Order",
        orderDetails: "Order Details",
        orderStatus: "Order Status",
        placedOn: "Placed On",
        estimatedDelivery: "Estimated Delivery",
        shippingAddress: "Shipping Address",
        paymentMethod: "Payment Method",
        orderItems: "Order Items",
        deliveryAgent: "Delivery Agent",
        deliveryAgentName: "Agent Name",
        deliveryAgentPhone: "Agent Phone",
        trackingNumber: "Tracking Number",
        backToHome: "Back to Home",
        status: {
          pending: "Order Placed",
          confirmed: "Order Confirmed",
          processing: "Processing",
          shipped: "Shipped",
          out_for_delivery: "Out for Delivery",
          outForDelivery: "Out for Delivery",
          delivered: "Delivered",
          cancelled: "Cancelled",
          returned: "Returned"
        }
      },
      hi: {
        title: "अपने ऑर्डर को ट्रैक करें",
        description: "अपने शिपमेंट की स्थिति को ट्रैक करने के लिए अपना ऑर्डर आईडी दर्ज करें",
        orderIdLabel: "ऑर्डर आईडी",
        orderIdPlaceholder: "अपना ऑर्डर आईडी दर्ज करें (उदा. ORD-123456789)",
        trackButton: "ऑर्डर ट्रैक करें",
        orderDetails: "ऑर्डर विवरण",
        orderStatus: "ऑर्डर की स्थिति",
        placedOn: "पर रखा गया",
        estimatedDelivery: "अनुमानित डिलीवरी",
        shippingAddress: "शिपिंग पता",
        paymentMethod: "भुगतान विधि",
        orderItems: "ऑर्डर आइटम",
        deliveryAgent: "डिलीवरी एजेंट",
        deliveryAgentName: "एजेंट का नाम",
        deliveryAgentPhone: "एजेंट फोन",
        trackingNumber: "ट्रैकिंग नंबर",
        backToHome: "होम पर वापस जाएं",
        status: {
          pending: "ऑर्डर रखा गया",
          confirmed: "ऑर्डर की पुष्टि हुई",
          processing: "प्रसंस्करण",
          shipped: "भेज दिया गया",
          out_for_delivery: "डिलीवरी के लिए निकला",
          outForDelivery: "डिलीवरी के लिए निकला",
          delivered: "डिलीवर किया गया",
          cancelled: "रद्द कर दिया गया",
          returned: "वापस कर दिया गया"
        }
      }
    };
    
    return translations[language][key] || key;
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setOrderData(null); // Clear previous order data
    
    try {
      // Check if the user entered an internal ID instead of order number
      let orderNumber = orderId.trim();
      
      // If the order ID looks like an internal ID, we need to find the actual order number
      if (orderNumber.startsWith('order-')) {
        // First, try to find the order by ID to get the actual order number
        const adminResponse = await fetch(`/api/orders?id=${orderNumber}`);
        const adminData = await adminResponse.json();
        
        if (adminData.success && adminData.order) {
          orderNumber = adminData.order.order_number;
        }
      }
      
      // Fetch order data from API using the order number
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();
      
      if (data.success && data.order) {
        // Transform the data to match the expected structure
        const order = data.order;
        
        // Parse shipping address if it's a JSON string
        let shippingAddress = order.shipping_address;
        try {
          if (typeof shippingAddress === 'string') {
            shippingAddress = JSON.parse(shippingAddress);
          }
        } catch (e) {
          // If parsing fails, keep it as is
        }
        
        setOrderData({
          id: order.id,
          orderNumber: order.order_number,
          status: order.status?.toLowerCase() || 'processing',
          placedOn: order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A',
          estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : 'N/A',
          shippingAddress: shippingAddress,
          paymentMethod: order.payment_method || 'N/A',
          trackingNumber: order.tracking_number || 'N/A',
          deliveryAgent: order.delivery_agent_name || order.delivery_agent_phone ? {
            name: order.delivery_agent_name || 'N/A',
            phone: order.delivery_agent_phone || 'N/A'
          } : null,
          items: order.items?.map((item: any) => ({
            id: item.id,
            name: item.product_name || 'Unknown Product',
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.product_image || '/images/products/placeholder.jpg'
          })) || []
        });
      } else {
        // Show error message
        alert(language === 'en' ? `Order not found. Could not find order ${orderId}. Please check the order number and try again.` : `ऑर्डर नहीं मिला। कृपया ऑर्डर आईडी जांचें।`);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      // Show error message
      alert(language === 'en' ? 'Error tracking order. Please try again.' : 'ऑर्डर ट्रैक करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'out_for_delivery':
      case 'outForDelivery': return 'bg-blue-500';
      case 'shipped': return 'bg-yellow-500';
      case 'processing':
      case 'confirmed': return 'bg-purple-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return t(`status.${status}`) || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('backToHome')}
            </button>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleTrackOrder}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('orderIdLabel')}
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder={t('orderIdPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        {t('trackButton')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {orderData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {t('orderDetails')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('orderStatus')}</h3>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(orderData.status)} mr-2`}></span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {getStatusText(orderData.status)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('placedOn')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{orderData.placedOn}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('estimatedDelivery')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{orderData.estimatedDelivery}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('paymentMethod')}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{orderData.paymentMethod}</p>
                </div>
                
                {orderData.trackingNumber && orderData.trackingNumber !== 'N/A' && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('trackingNumber')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 font-mono">{orderData.trackingNumber}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t('shippingAddress')}</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {typeof orderData.shippingAddress === 'object' ? (
                    <>
                      {orderData.shippingAddress.fullName}<br />
                      {orderData.shippingAddress.addressLine1}{orderData.shippingAddress.addressLine2 ? `, ${orderData.shippingAddress.addressLine2}` : ''}<br />
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}<br />
                      Phone: {orderData.shippingAddress.phone}
                    </>
                  ) : (
                    orderData.shippingAddress
                  )}
                </p>
              </div>
              
              {/* Delivery Agent Information */}
              {orderData.deliveryAgent && (
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    {t('deliveryAgent')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('deliveryAgentName')}</p>
                      <p className="text-gray-700 dark:text-gray-300">{orderData.deliveryAgent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('deliveryAgentPhone')}</p>
                      <p className="text-gray-700 dark:text-gray-300 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {orderData.deliveryAgent.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">{t('orderItems')}</h3>
                <div className="space-y-4">
                  {orderData.items && orderData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/products/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.name || 'Unknown Product'}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        ₹{(item.price * (item.quantity || 1)) || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}