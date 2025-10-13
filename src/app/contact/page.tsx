'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('en');

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: { en: 'Email Us', hi: 'हमें ईमेल करें' },
      content: { en: 'support@lettex.com', hi: 'support@lettex.com' },
      action: { en: 'Send Email', hi: 'ईमेल भेजें' },
      link: 'mailto:support@lettex.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: { en: 'Call Us', hi: 'हमें कॉल करें' },
      content: { en: '+91 98765 43210', hi: '+91 98765 43210' },
      action: { en: 'Call Now', hi: 'अभी कॉल करें' },
      link: 'tel:+919876543210'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: { en: 'Visit Us', hi: 'हमें देखें' },
      content: { 
        en: 'Mumbai, Maharashtra, India', 
        hi: 'मुंबई, महाराष्ट्र, भारत' 
      },
      action: { en: 'Get Directions', hi: 'दिशा-निर्देश प्राप्त करें' },
      link: 'https://maps.google.com'
    }
  ];

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Contact Us",
        description: "We're here to help! Reach out to us for any queries or support.",
        supportChannels: "Support Channels",
        email: "Email",
        phone: "Phone",
        supportHours: "Support Hours",
        monSat: "Mon–Sat",
        faqTitle: "Frequently Asked Questions",
        faq1: "When will I receive my order?",
        faq1Answer: "Orders are delivered within 3-7 business days depending on your location.",
        faq2: "What if I receive a damaged item?",
        faq2Answer: "You can request a return or replacement within 7 days.",
        faq3: "How can I track my order?",
        faq3Answer: "Go to \"My Orders\" in your profile to track your order status.",
        contactForm: "Send us a Message",
        nameLabel: "Name",
        emailLabel: "Email",
        subjectLabel: "Subject",
        messageLabel: "Message",
        sendMessage: "Send Message",
        emailPlaceholder: "your@email.com",
        subjectPlaceholder: "What is this regarding?",
        messagePlaceholder: "Your message here...",
        monSatHours: "10 AM – 7 PM"
      }
    };
    
    return translations[language][key] || key;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend
    alert('Thank you for your message! We will get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

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
            {/* Support Information */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('supportChannels')}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <span className="text-amber-600 dark:text-amber-400">📧</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{t('email')}</h3>
                      <p className="text-gray-600 dark:text-gray-400">support@pachmarhiart.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <span className="text-amber-600 dark:text-amber-400">📞</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{t('phone')}</h3>
                      <p className="text-gray-600 dark:text-gray-400">+91-9876543210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <span className="text-amber-600 dark:text-amber-400">🕒</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{t('supportHours')}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('monSat')}: {t('monSatHours')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('faqTitle')}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('faq1')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {t('faq1Answer')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('faq2')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {t('faq2Answer')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t('faq3')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {t('faq3Answer')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('contactForm')}
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t('emailPlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('subjectLabel')}
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t('subjectPlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('messageLabel')}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                        placeholder={t('messagePlaceholder')}
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      {t('sendMessage')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}