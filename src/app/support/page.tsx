'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Customer Support",
        description: "Our dedicated support team is here to help you with any questions or concerns.",
        contactMethods: "Contact Methods",
        email: "Email Support",
        emailDesc: "For general inquiries and support requests",
        emailLink: "support@sonifashion.com",
        phone: "Phone Support",
        phoneDesc: "For immediate assistance",
        phoneLink: "+91-9876543210",
        chat: "Live Chat",
        chatDesc: "Chat with our support team",
        chatLink: "Start Chat",
        faqTitle: "Frequently Asked Questions",
        faq1: "How do I track my order?",
        faq1Answer: "You can track your order by logging into your account and visiting the 'My Orders' section.",
        faq2: "What is your return policy?",
        faq2Answer: "We offer a 7-day return policy on all items. Items must be in original condition with tags attached.",
        faq3: "How long does shipping take?",
        faq3Answer: "Shipping typically takes 3-7 business days depending on your location.",
        faq4: "Do you offer international shipping?",
        faq4Answer: "Currently, we only ship within India. We are working on expanding to international markets.",
        hours: "Support Hours",
        hoursDesc: "Monday to Saturday: 10 AM - 7 PM",
        emergency: "Emergency Support",
        emergencyDesc: "For urgent issues outside business hours",
        emergencyLink: "+91-9876543210"
      },
      hi: {
        title: "ग्राहक सहायता",
        description: "हमारी समर्पित सहायता टीम आपके किसी भी प्रश्न या चिंता के साथ मदद करने के लिए यहाँ है।",
        contactMethods: "संपर्क विधियाँ",
        email: "ईमेल सहायता",
        emailDesc: "सामान्य पूछताछ और सहायता अनुरोध के लिए",
        emailLink: "support@sonifashion.com",
        phone: "फोन सहायता",
        phoneDesc: "तत्काल सहायता के लिए",
        phoneLink: "+91-9876543210",
        chat: "लाइव चैट",
        chatDesc: "हमारी सहायता टीम के साथ चैट करें",
        chatLink: "चैट शुरू करें",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        faq1: "मैं अपने ऑर्डर को कैसे ट्रैक कर सकता हूँ?",
        faq1Answer: "आप अपने खाते में लॉग इन करके और 'मेरे ऑर्डर' अनुभाग पर जाकर अपने ऑर्डर को ट्रैक कर सकते हैं।",
        faq2: "आपकी वापसी नीति क्या है?",
        faq2Answer: "हम सभी वस्तुओं पर 7 दिन की वापसी नीति प्रदान करते हैं। वस्तुएँ मूल हालत में टैग के साथ होनी चाहिए।",
        faq3: "शिपिंग में कितना समय लगता है?",
        faq3Answer: "शिपिंग में आमतौर पर 3-7 व्यावसायिक दिन लगते हैं, जो आपके स्थान पर निर्भर करता है।",
        faq4: "क्या आप अंतरराष्ट्रीय शिपिंग प्रदान करते हैं?",
        faq4Answer: "वर्तमान में, हम केवल भारत के भीतर शिपिंग करते हैं। हम अंतरराष्ट्रीय बाजारों में विस्तार करने पर काम कर रहे हैं।",
        hours: "सहायता के घंटे",
        hoursDesc: "सोमवार से शनिवार: सुबह 10 बजे - शाम 7 बजे",
        emergency: "आपातकालीन सहायता",
        emergencyDesc: "व्यावसायिक घंटों के बाहर तत्काल समस्याओं के लिए",
        emergencyLink: "+91-9876543210"
      }
    };
    
    return translations[language][key] || key;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('contactMethods')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">✉️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('email')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('emailDesc')}</p>
                    <a href="mailto:support@sonifashion.com" className="text-amber-600 dark:text-amber-400 font-medium mt-2 inline-block">
                      {t('emailLink')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">📞</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('phone')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('phoneDesc')}</p>
                    <a href="tel:+919876543210" className="text-amber-600 dark:text-amber-400 font-medium mt-2 inline-block">
                      {t('phoneLink')}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('chat')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('chatDesc')}</p>
                    <button className="text-amber-600 dark:text-amber-400 font-medium mt-2 inline-block">
                      {t('chatLink')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('hours')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">🕒</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('hours')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {t('hoursDesc')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">🚨</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{t('emergency')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{t('emergencyDesc')}</p>
                    <a href="tel:+919876543210" className="text-amber-600 dark:text-amber-400 font-medium mt-2 inline-block">
                      {t('emergencyLink')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {t('faqTitle')}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('faq1')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('faq1Answer')}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('faq2')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('faq2Answer')}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('faq3')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('faq3Answer')}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('faq4')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {t('faq4Answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}