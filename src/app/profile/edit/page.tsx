'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { language } = useLanguage();
  const { user: authUser, logout, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authUser) {
      router.push('/login');
      return;
    }

    // Set form data from user
    setFormData({
      name: authUser.name || '',
      email: authUser.email || '',
      phone: authUser.phone || ''
    });
    
    setLoading(false);
  }, [authUser, router]);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        editProfile: 'Edit Profile',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        save: 'Save Changes',
        cancel: 'Cancel',
        profileUpdated: 'Profile updated successfully!',
        errorUpdating: 'Error updating profile. Please try again.',
        backToProfile: 'Back to Profile'
      },
      hi: {
        editProfile: 'प्रोफ़ाइल संपादित करें',
        name: 'नाम',
        email: 'ईमेल',
        phone: 'फ़ोन',
        save: 'परिवर्तन सहेजें',
        cancel: 'रद्द करें',
        profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!',
        errorUpdating: 'प्रोफ़ाइल अपडेट करने में त्रुटि। कृपया पुन: प्रयास करें।',
        backToProfile: 'प्रोफ़ाइल पर वापस जाएं'
      }
    };
    
    return translations[language][key] || key;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update user in context
        updateUser(data.user);
        alert(t('profileUpdated'));
        router.push('/profile');
      } else {
        alert(t('errorUpdating'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('errorUpdating'));
    } finally {
      setSubmitting(false);
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
            {language === 'en' ? 'Please login to edit your profile' : 'अपनी प्रोफ़ाइल संपादित करने के लिए कृपया लॉगिन करें'}
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('editProfile')}
          </h1>
          <Link 
            href="/profile" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
          >
            {t('backToProfile')}
          </Link>
        </div>
        
        <div className="flipkart-card p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {submitting ? (language === 'en' ? 'Saving...' : 'सहेजा जा रहा है...') : t('save')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}