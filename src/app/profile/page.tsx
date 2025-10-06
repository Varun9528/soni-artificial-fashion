'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

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

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { state: wishlistState, removeFromWishlist } = useWishlist();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch product data for wishlist items
  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistState.items.length === 0) return;
      
      try {
        // In a real application, you would fetch products from an API
        // For now, we'll use mock data or fetch from local storage
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const productsMap: Record<string, any> = {};
          // Fix: data is an object with a products array, not the array itself
          if (data.success && Array.isArray(data.products)) {
            data.products.forEach((product: any) => {
              productsMap[product.id] = product;
            });
          }
          setProducts(productsMap);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        const mockProducts: Record<string, any> = {};
        wishlistState.items.forEach(item => {
          mockProducts[item.productId] = {
            id: item.productId,
            slug: 'placeholder-product',
            title: {
              en: 'Placeholder Product',
              hi: 'प्लेसहोल्डर उत्पाद'
            },
            description: {
              en: 'Product description',
              hi: 'उत्पाद विवरण'
            },
            price: 999,
            stock: 10,
            rating: 4.5,
            reviewCount: 5,
            categoryId: '1',
            artisanId: '1',
            images: ['/images/products/placeholder.jpg'],
            material: 'Wood',
            dimensions: '10x10x10 cm',
            tags: ['handmade'],
            featured: false,
            bestSeller: false,
            trending: false,
            newArrival: false,
            createdAt: new Date().toISOString()
          };
        });
        setProducts(mockProducts);
      }
    };

    fetchProducts();
  }, [wishlistState.items]);

  const fetchProfileData = async () => {
    try {
      // Check authentication
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const savedLanguage = localStorage.getItem('language') || 'en';
      
      setLanguage(savedLanguage);
      
      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || ''
      });
      
      // Fetch orders from API
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }
      
      // Fetch addresses from API
      const addressesResponse = await fetch('/api/user/addresses');
      const addressesData = await addressesResponse.json();
      if (addressesData.success) {
        setAddresses(addressesData.addresses);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Fallback to mock data
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
        }
      ];
      setOrders(mockOrders);
      
      const mockAddresses: Address[] = [
        {
          id: '1',
          fullName: 'John Doe',
          phone: '9876543210',
          addressLine1: '123 Main Street',
          addressLine2: 'Near Market',
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          pincode: '462001',
          country: 'India',
          isDefault: true
        }
      ];
      setAddresses(mockAddresses);
    }
    
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      // Make API call to update user
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser as User);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    try {
      // Make API call to change password
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(passwordData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Password updated successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert('Failed to update password: ' + result.error);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Make API call to delete account
        const response = await fetch('/api/user/delete', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/');
          alert('Account deleted successfully.');
        } else {
          alert('Failed to delete account: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        savedAddresses: "Your saved addresses will appear here.",
        updatePassword: "Update your password for better security.",
        deleteAccount: "Deleting your account is permanent and cannot be undone.",
        addAddress: "Add Address"
      },
      hi: {
        savedAddresses: "आपके सेव किए गए पते यहाँ दिखेंगे।",
        updatePassword: "अधिक सुरक्षा के लिए अपना पासवर्ड अपडेट करें।",
        deleteAccount: "खाता डिलीट करना स्थायी है और इसे वापस नहीं किया जा सकता।",
        addAddress: "पता जोड़ें"
      }
    };
    
    return translations[language][key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full mt-1">
                    {user.role === 'super_admin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'wishlist'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'addresses'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Security
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Type
                    </label>
                    <p className="text-gray-900 dark:text-white capitalize">{user.role}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Order History
                </h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                              ₹{order.totalAmount}
                            </p>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.items.map(item => `${item.product} (${item.quantity})`).join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No orders found</p>
                    <Link
                      href="/"
                      className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  My Wishlist ({wishlistState.items.length} items)
                </h2>
                {wishlistState.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistState.items.map((item) => {
                      const product = products[item.productId];
                      if (!product) return null;
                      
                      return (
                        <div key={item.productId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="relative mb-4">
                            <Image
                              src={product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'}
                              alt={product.title.en}
                              width={200}
                              height={200}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e: any) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/placeholder.jpg';
                              }}
                            />
                            <button
                              onClick={() => removeFromWishlist(item.productId)}
                              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Remove from wishlist"
                            >
                              <span className="text-red-500">🗑️</span>
                            </button>
                          </div>
                          <div className="space-y-2">
                            <Link
                              href={`/product/${product.slug}`}
                              className="block font-medium text-gray-900 dark:text-white hover:text-amber-600 transition-colors"
                            >
                              {product.title.en}
                            </Link>
                            <p className="text-lg font-semibold text-amber-600">
                              ₹{product.price.toLocaleString()}
                            </p>
                            <div className="flex space-x-2 mt-3">
                              <Link
                                href={`/product/${product.slug}`}
                                className="flex-1 px-3 py-2 bg-amber-600 text-white text-center text-sm rounded-lg hover:bg-amber-700 transition-colors"
                              >
                                View Product
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <span className="text-6xl">💖</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Your wishlist is empty</p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Saved Addresses
                  </h2>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Add Address
                  </button>
                </div>
                
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{address.fullName}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{address.phone}</p>
                            <p className="text-gray-900 dark:text-white mt-2">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                              <br />
                              {address.city}, {address.state} - {address.pincode}
                              <br />
                              {address.country}
                            </p>
                          </div>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button className="text-sm text-amber-600 hover:text-amber-800">
                            Edit
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('savedAddresses')}</p>
                    <button className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                      {t('addAddress')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>
                
                {/* Change Password */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      Change Password
                    </h3>
                    <button
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      {isChangingPassword ? 'Cancel' : 'Change'}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('updatePassword')}
                  </p>
                  
                  {isChangingPassword && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={handleChangePassword}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => setIsChangingPassword(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Delete Account */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white">
                      Delete Account
                    </h3>
                    <button
                      onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {showDeleteAccount ? 'Cancel' : 'Delete'}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('deleteAccount')}
                  </p>
                  
                  {showDeleteAccount && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Yes, Delete Account
                        </button>
                        <button
                          onClick={() => setShowDeleteAccount(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}