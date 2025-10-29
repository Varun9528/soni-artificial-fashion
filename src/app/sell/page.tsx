'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export default function SellOnSoniFashionPage() {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    products: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Sell on Soni Fashion",
        description: "Join our platform and reach millions of customers across India",
        formTitle: "Partner With Us",
        nameLabel: "Full Name",
        namePlaceholder: "Enter your full name",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email address",
        phoneLabel: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        businessNameLabel: "Business Name",
        businessNamePlaceholder: "Enter your business name",
        businessTypeLabel: "Business Type",
        businessTypePlaceholder: "Select business type",
        productsLabel: "Products You Sell",
        productsPlaceholder: "Describe the products you want to sell",
        messageLabel: "Additional Information",
        messagePlaceholder: "Any additional information you'd like to share",
        submitButton: "Submit Application",
        benefitsTitle: "Why Sell on Soni Fashion?",
        benefit1: "Access to millions of customers",
        benefit2: "Easy to use seller dashboard",
        benefit3: "Competitive commission rates",
        benefit4: "Marketing and promotional support",
        benefit5: "Fast and reliable payment processing",
        benefit6: "Dedicated seller support",
        requirementsTitle: "Requirements",
        requirement1: "Valid business registration",
        requirement2: "GSTIN (if applicable)",
        requirement3: "Bank account details",
        requirement4: "Product images and descriptions",
        requirement5: "Quality products that meet our standards",
        successTitle: "Application Submitted!",
        successMessage: "Thank you for your interest in selling on Soni Fashion. Our team will review your application and get back to you within 3-5 business days.",
        backToHome: "Back to Home"
      },
      hi: {
        title: "सोनी फैशन पर बेचें",
        description: "हमारे प्लेटफॉर्म से जुड़ें और भारत भर के लाखों ग्राहकों तक पहुँचें",
        formTitle: "हमारे साथ भागीदार बनें",
        nameLabel: "पूरा नाम",
        namePlaceholder: "अपना पूरा नाम दर्ज करें",
        emailLabel: "ईमेल पता",
        emailPlaceholder: "अपना ईमेल पता दर्ज करें",
        phoneLabel: "फोन नंबर",
        phonePlaceholder: "अपना फोन नंबर दर्ज करें",
        businessNameLabel: "व्यवसाय का नाम",
        businessNamePlaceholder: "अपने व्यवसाय का नाम दर्ज करें",
        businessTypeLabel: "व्यवसाय का प्रकार",
        businessTypePlaceholder: "व्यवसाय का प्रकार चुनें",
        productsLabel: "आप जो उत्पाद बेचते हैं",
        productsPlaceholder: "उन उत्पादों का वर्णन करें जिन्हें आप बेचना चाहते हैं",
        messageLabel: "अतिरिक्त जानकारी",
        messagePlaceholder: "कोई भी अतिरिक्त जानकारी जो आप साझा करना चाहें",
        submitButton: "आवेदन जमा करें",
        benefitsTitle: "सोनी फैशन पर बेचने के क्यों?",
        benefit1: "लाखों ग्राहकों तक पहुँच",
        benefit2: "उपयोग करने में आसान विक्रेता डैशबोर्ड",
        benefit3: "प्रतिस्पर्धी कमीशन दरें",
        benefit4: "मार्केटिंग और प्रचार समर्थन",
        benefit5: "तेज और विश्वसनीय भुगतान प्रसंस्करण",
        benefit6: "समर्पित विक्रेता समर्थन",
        requirementsTitle: "आवश्यकताएँ",
        requirement1: "मान्य व्यवसाय पंजीकरण",
        requirement2: "जीएसटीआईएन (यदि लागू हो)",
        requirement3: "बैंक खाता विवरण",
        requirement4: "उत्पाद चित्र और विवरण",
        requirement5: "गुणवत्तापूर्ण उत्पाद जो हमारे मानकों को पूरा करते हैं",
        successTitle: "आवेदन जमा किया गया!",
        successMessage: "सोनी फैशन पर बेचने में आपकी रुचि के लिए धन्यवाद। हमारी टीम आपके आवेदन की समीक्षा करेगी और 3-5 व्यावसायिक दिनों के भीतर आपको वापस आएगी।",
        backToHome: "होम पर वापस जाएं"
      }
    };
    
    return translations[language][key] || key;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('successTitle')}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('successMessage')}
              </p>
              
              <a 
                href="/" 
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                {t('backToHome')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('formTitle')}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('nameLabel')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('namePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('emailLabel')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('emailPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('phoneLabel')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('businessNameLabel')}
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder={t('businessNamePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('businessTypeLabel')}
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">{t('businessTypePlaceholder')}</option>
                        <option value="individual">Individual Seller</option>
                        <option value="small-business">Small Business</option>
                        <option value="manufacturer">Manufacturer</option>
                        <option value="brand">Brand Owner</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="products" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('productsLabel')}
                      </label>
                      <textarea
                        id="products"
                        name="products"
                        value={formData.products}
                        onChange={handleChange}
                        placeholder={t('productsPlaceholder')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('messageLabel')}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('messagePlaceholder')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {t('submitButton')}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('benefitsTitle')}
                </h2>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit1')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit2')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit3')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit4')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit5')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">✓</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('benefit6')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('requirementsTitle')}
                </h2>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">1</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('requirement1')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">2</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('requirement2')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">3</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('requirement3')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">4</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('requirement4')}</span>
                  </li>
                  
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">5</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{t('requirement5')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}