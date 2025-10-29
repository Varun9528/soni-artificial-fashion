'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [language, setLanguage] = useState('en');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: "Frequently Asked Questions",
        description: "Find answers to common questions about our products, shipping, returns, and more.",
        faq1: "How do I track my order?",
        faq1Answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll also receive email updates with tracking information.",
        faq2: "What is your return policy?",
        faq2Answer: "We offer a 7-day return policy on all items. Items must be in original condition with tags attached. Contact our support team to initiate a return.",
        faq3: "How long does shipping take?",
        faq3Answer: "Shipping typically takes 3-7 business days depending on your location. Express shipping options are available at checkout.",
        faq4: "Do you offer international shipping?",
        faq4Answer: "Currently, we only ship within India. We are working on expanding to international markets.",
        faq5: "How can I contact customer support?",
        faq5Answer: "You can reach our customer support team via email at support@sonifashion.com or by phone at +91-9876543210. We're available Monday to Saturday, 10 AM to 7 PM.",
        faq6: "What payment methods do you accept?",
        faq6Answer: "We accept all major credit cards, debit cards, UPI, and popular digital wallets. All payments are processed securely.",
        faq7: "How do I know if an item is authentic?",
        faq7Answer: "All our products are sourced directly from trusted manufacturers and artisans. Each item comes with a certificate of authenticity where applicable.",
        faq8: "Can I change or cancel my order?",
        faq8Answer: "You can cancel your order within 2 hours of placing it. After that, please contact our support team to see if modifications are possible.",
        faq9: "What if I receive a damaged item?",
        faq9Answer: "If you receive a damaged item, please contact us within 48 hours with photos of the damage. We'll arrange for a replacement or refund.",
        faq10: "Do you offer custom jewelry designs?",
        faq10Answer: "Yes, we offer custom jewelry design services. Please contact our design team at custom@sonifashion.com with your requirements."
      },
      hi: {
        title: "अक्सर पूछे जाने वाले प्रश्न",
        description: "हमारे उत्पादों, शिपिंग, रिटर्न और अधिक के बारे में सामान्य प्रश्नों के उत्तर खोजें।",
        faq1: "मैं अपने ऑर्डर को कैसे ट्रैक कर सकता हूँ?",
        faq1Answer: "आप अपने खाते में लॉग इन करके और 'मेरे ऑर्डर' अनुभाग पर जाकर अपने ऑर्डर को ट्रैक कर सकते हैं। आपको ट्रैकिंग जानकारी के साथ ईमेल अपडेट भी प्राप्त होंगे।",
        faq2: "आपकी वापसी नीति क्या है?",
        faq2Answer: "हम सभी वस्तुओं पर 7 दिन की वापसी नीति प्रदान करते हैं। वस्तुएँ मूल हालत में टैग के साथ होनी चाहिए। वापसी शुरू करने के लिए हमारी सहायता टीम से संपर्क करें।",
        faq3: "शिपिंग में कितना समय लगता है?",
        faq3Answer: "शिपिंग में आमतौर पर 3-7 व्यावसायिक दिन लगते हैं, जो आपके स्थान पर निर्भर करता है। चेकआउट पर एक्सप्रेस शिपिंग विकल्प उपलब्ध हैं।",
        faq4: "क्या आप अंतरराष्ट्रीय शिपिंग प्रदान करते हैं?",
        faq4Answer: "वर्तमान में, हम केवल भारत के भीतर शिपिंग करते हैं। हम अंतरराष्ट्रीय बाजारों में विस्तार करने पर काम कर रहे हैं।",
        faq5: "मैं ग्राहक सहायता से कैसे संपर्क कर सकता हूँ?",
        faq5Answer: "आप हमारी ग्राहक सहायता टीम तक support@sonifashion.com पर ईमेल या +91-9876543210 पर फोन करके पहुँच सकते हैं। हम सोमवार से शनिवार, सुबह 10 बजे से शाम 7 बजे तक उपलब्ध हैं।",
        faq6: "आप किन भुगतान विधियों को स्वीकार करते हैं?",
        faq6Answer: "हम सभी प्रमुख क्रेडिट कार्ड, डेबिट कार्ड, यूपीआई और लोकप्रिय डिजिटल वॉलेट स्वीकार करते हैं। सभी भुगतान सुरक्षित रूप से संसाधित किए जाते हैं।",
        faq7: "यह जानने के लिए कि कोई वस्तु प्रामाणिक है या नहीं, मैं कैसे जान सकता हूँ?",
        faq7Answer: "हमारे सभी उत्पाद सीधे विश्वसनीय निर्माताओं और कारीगरों से प्राप्त किए जाते हैं। प्रत्येक वस्तु प्रामाणिकता के प्रमाणपत्र के साथ आती है जहां लागू हो।",
        faq8: "क्या मैं अपने ऑर्डर को बदल या रद्द कर सकता हूँ?",
        faq8Answer: "आप इसे रखने के 2 घंटे के भीतर अपने ऑर्डर को रद्द कर सकते हैं। उसके बाद, कृपया देखें कि संशोधन संभव हैं या नहीं, हमारी सहायता टीम से संपर्क करें।",
        faq9: "अगर मुझे कोई क्षतिग्रस्त वस्तु प्राप्त होती है तो क्या करना चाहिए?",
        faq9Answer: "यदि आपको कोई क्षतिग्रस्त वस्तु प्राप्त होती है, तो कृपया 48 घंटे के भीतर क्षति की तस्वीरों के साथ हमसे संपर्क करें। हम एक प्रतिस्थापन या धनवापसी की व्यवस्था करेंगे।",
        faq10: "क्या आप कस्टम आभूषण डिज़ाइन प्रदान करते हैं?",
        faq10Answer: "हाँ, हम कस्टम आभूषण डिज़ाइन सेवाएँ प्रदान करते हैं। कृपया अपनी आवश्यकताओं के साथ हमारी डिज़ाइन टीम custom@sonifashion.com पर संपर्क करें।"
      }
    };
    
    return translations[language][key] || key;
  };

  const faqs = [
    { question: t('faq1'), answer: t('faq1Answer') },
    { question: t('faq2'), answer: t('faq2Answer') },
    { question: t('faq3'), answer: t('faq3Answer') },
    { question: t('faq4'), answer: t('faq4Answer') },
    { question: t('faq5'), answer: t('faq5Answer') },
    { question: t('faq6'), answer: t('faq6Answer') },
    { question: t('faq7'), answer: t('faq7Answer') },
    { question: t('faq8'), answer: t('faq8Answer') },
    { question: t('faq9'), answer: t('faq9Answer') },
    { question: t('faq10'), answer: t('faq10Answer') }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700">
                <button
                  className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'en' 
                ? "Still have questions? Our support team is here to help." 
                : "क्या आपके पास अभी भी प्रश्न हैं? हमारी सहायता टीम आपकी मदद करने के लिए यहाँ है।"}
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              {language === 'en' ? 'Contact Support' : 'सहायता से संपर्क करें'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}