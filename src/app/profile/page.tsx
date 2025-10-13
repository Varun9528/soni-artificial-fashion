'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, ShoppingBag, Heart, Bell, Settings, LogOut, Edit3 } from 'lucide-react';

export default function ProfilePage() {
  const { language } = useLanguage();
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrders(data.orders);
          }
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserAddresses(data.addresses);
          }
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error);
      }
    };

    if (authUser) {
      fetchUserProfile();
      fetchUserOrders();
      fetchUserAddresses();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        profile: 'Profile',
        personalInfo: 'Personal Information',
        addresses: 'Addresses',
        myOrders: 'My Orders',
        wishlist: 'Wishlist',
        notifications: 'Notifications',
        settings: 'Settings',
        logout: 'Logout',
        editProfile: 'Edit Profile',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        memberSince: 'Member since',
        addAddress: 'Add Address',
        edit: 'Edit',
        delete: 'Delete',
        setAsDefault: 'Set as Default',
        orderHistory: 'Order History',
        orderId: 'Order ID',
        date: 'Date',
        status: 'Status',
        total: 'Total',
        items: 'Items',
        viewDetails: 'View Details',
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        outForDelivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned',
        refunded: 'Refunded'
      },
      hi: {
        profile: 'प्रोफ़ाइल',
        personalInfo: 'व्यक्तिगत जानकारी',
        addresses: 'पते',
        myOrders: 'मेरे आदेश',
        wishlist: 'इच्छा-सूची',
        notifications: 'अधिसूचनाएँ',
        settings: 'सेटिंग्स',
        logout: 'लॉग आउट',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        name: 'नाम',
        email: 'ईमेल',
        phone: 'फ़ोन',
        memberSince: 'सदस्यता तारीख',
        addAddress: 'पता जोड़ें',
        edit: 'संपादित करें',
        delete: 'हटाएँ',
        setAsDefault: 'डिफ़ॉल्ट के रूप मेः सेट करें',
        orderHistory: 'आदेश इतिहास',
        orderId: 'आदेश आईडी',
        date: 'तारीख',
        status: 'स्थिति',
        total: 'कुल',
        items: 'आइटम',
        viewDetails: 'विवरण देखें',
        pending: 'लंबित',
        confirmed: 'पुष्टि की गई',
        processing: 'प्रसंस्करण',
        shipped: 'भेज दिया गया',
        outForDelivery: 'डिलीवरी के लिए निकला',
        delivered: 'डिलीवर किया गया',
        cancelled: 'रद्द किया गया',
        returned: 'वापस किया गया',
        refunded: 'धनवापसी की गई'
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'User not found' : 'उपयोगकर्ता नहीं मिला'}
          </h1>
          <button 
            onClick={() => router.push('/login')}
            className="flipkart-button"
          >
            {language === 'en' ? 'Go to Login' : 'लॉगिन पर जाएं'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('profile')}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="flipkart-card p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
              >
                <User className="w-5 h-5 mr-3" />
                {t('personalInfo')}
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${activeTab === 'addresses' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
              >
                <MapPin className="w-5 h-5 mr-3" />
                {t('addresses')}
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                {t('myOrders')}
              </button>
              
              <Link
                href="/wishlist"
                className="flex items-center px-4 py-3 text-left rounded-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Heart className="w-5 h-5 mr-3" />
                {t('wishlist')}
              </Link>
              
              <button className="w-full flex items-center px-4 py-3 text-left rounded-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <Bell className="w-5 h-5 mr-3" />
                {t('notifications')}
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left rounded-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                <Settings className="w-5 h-5 mr-3" />
                {t('settings')}
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-left rounded-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t('logout')}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          {activeTab === 'profile' && (
            <div className="flipkart-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('personalInfo')}
                </h2>
                <button className="flipkart-button px-4 py-2 flex items-center text-sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t('editProfile')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('name')}
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('email')}
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('phone')}
                  </label>
                  <p className="text-gray-900 dark:text-white">{user.phone || (language === 'en' ? 'Not provided' : 'प्रदान नहीं किया गया')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('memberSince')}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : (language === 'en' ? 'Not available' : 'उपलब्ध नहीं')}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'addresses' && (
            <div className="flipkart-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addresses')}
                </h2>
                <button className="flipkart-button px-4 py-2 text-sm">
                  {t('addAddress')}
                </button>
              </div>
              
              <div className="space-y-4">
                {userAddresses.map((address: any) => (
                  <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-sm p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {address.name}
                          {address.isDefault && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2 py-1 rounded">
                              {language === 'en' ? 'Default' : 'डिफ़ॉल्ट'}
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {address.phone}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                          {t('edit')}
                        </button>
                        {!address.isDefault && (
                          <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                            {t('delete')}
                          </button>
                        )}
                      </div>
                    </div>
                    {!address.isDefault && (
                      <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                        {t('setAsDefault')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="flipkart-card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t('orderHistory')}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderId')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('date')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('total')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('items')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map((order: any) => (
                      <tr key={order.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN') : ''}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status || 'pending')}`}>
                            {getStatusText(order.status || 'pending')}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{order.total_amount ? order.total_amount.toLocaleString() : '0'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {order.items ? order.items.length : 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            {t('viewDetails')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}