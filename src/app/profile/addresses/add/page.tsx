'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddAddressPage() {
  const { language } = useLanguage();
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    address_type: 'home',
    is_default: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Translations
  const t = (key: string) => {
    const translations: any = {
      en: {
        addAddress: 'Add Address',
        fullName: 'Full Name',
        phone: 'Phone Number',
        addressLine1: 'Address Line 1',
        addressLine2: 'Address Line 2 (Optional)',
        city: 'City',
        state: 'State',
        pincode: 'Pincode',
        country: 'Country',
        addressType: 'Address Type',
        home: 'Home',
        work: 'Work',
        other: 'Other',
        setAsDefault: 'Set as Default Address',
        save: 'Save Address',
        cancel: 'Cancel',
        addressAdded: 'Address added successfully!',
        errorAdding: 'Error adding address. Please try again.',
        backToProfile: 'Back to Profile'
      },
      hi: {
        addAddress: 'पता जोड़ें',
        fullName: 'पूरा नाम',
        phone: 'फ़ोन नंबर',
        addressLine1: 'पता पंक्ति 1',
        addressLine2: 'पता पंक्ति 2 (वैकल्पिक)',
        city: 'शहर',
        state: 'राज्य',
        pincode: 'पिनकोड',
        country: 'देश',
        addressType: 'पता प्रकार',
        home: 'घर',
        work: 'कार्यालय',
        other: 'अन्य',
        setAsDefault: 'डिफ़ॉल्ट पते के रूप में सेट करें',
        save: 'पता सहेजें',
        cancel: 'रद्द करें',
        addressAdded: 'पता सफलतापूर्वक जोड़ा गया!',
        errorAdding: 'पता जोड़ने में त्रुटि। कृपया पुन: प्रयास करें।',
        backToProfile: 'प्रोफ़ाइल पर वापस जाएं'
      }
    };
    
    return translations[language][key] || key;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(t('addressAdded'));
        router.push('/profile?tab=addresses');
      } else {
        alert(t('errorAdding'));
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert(t('errorAdding'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Please login to add an address' : 'पता जोड़ने के लिए कृपया लॉगिन करें'}
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
            {t('addAddress')}
          </h1>
          <Link 
            href="/profile?tab=addresses" 
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
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('addressLine1')}
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('addressLine2')}
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('state')}
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('pincode')}
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('country')}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('addressType')}
                </label>
                <select
                  name="address_type"
                  value={formData.address_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="home">{t('home')}</option>
                  <option value="work">{t('work')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('setAsDefault')}
                </label>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/profile?tab=addresses')}
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