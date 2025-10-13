'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Edit3, Key, Bell, Shield } from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would update the user profile
    alert('Profile updated successfully!');
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // In a real implementation, you would update the password
    alert('Password updated successfully!');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Profile</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-1">
                  {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${
                  activeTab === 'profile' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile Information
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${
                  activeTab === 'security' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Key className="w-5 h-5 mr-3" />
                Security
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${
                  activeTab === 'notifications' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('permissions')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-sm ${
                  activeTab === 'permissions' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                Permissions
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-grow">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <button className="flipkart-button px-4 py-2 flex items-center text-sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              </div>
              
              <form onSubmit={handleSubmitProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="flipkart-button px-6 py-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={handleSubmitPassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="flipkart-button px-6 py-2"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Product Updates</h3>
                    <p className="text-sm text-gray-500">Get notified about product changes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Security Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified about security events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'permissions' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Role & Permissions</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Role</h3>
                <div className="bg-gray-50 rounded-sm p-4">
                  <p className="font-medium text-gray-900">
                    {user.role === 'super_admin' ? 'Super Administrator' : 'Administrator'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.role === 'super_admin' 
                      ? 'Full access to all administrative functions' 
                      : 'Access to standard administrative functions'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-sm p-4">
                    <h4 className="font-medium text-gray-900">Product Management</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>✓ Create products</li>
                      <li>✓ Edit products</li>
                      <li>✓ Delete products</li>
                      <li>✓ Manage inventory</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-sm p-4">
                    <h4 className="font-medium text-gray-900">Order Management</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>✓ View orders</li>
                      <li>✓ Update order status</li>
                      <li>✓ Process refunds</li>
                      <li>✓ Manage returns</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-sm p-4">
                    <h4 className="font-medium text-gray-900">User Management</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>✓ View user accounts</li>
                      <li>✓ Edit user information</li>
                      <li>✓ Suspend accounts</li>
                      <li>✓ Reset passwords</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-sm p-4">
                    <h4 className="font-medium text-gray-900">System Settings</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>✓ Manage categories</li>
                      <li>✓ Manage banners</li>
                      <li>✓ View analytics</li>
                      <li>✓ Configure settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}