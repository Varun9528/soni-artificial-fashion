'use client';

import { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { language } = useLanguage();
  const router = useRouter();
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert(language === 'en' ? 'Newsletter signup coming soon!' : 'न्यूज़लेटर सदस्यता जल्द आ रही है!');
    setEmail('');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const t = (key: string) => {
    const translations: any = {
      en: {
        brandDescription: "Soni Artificial Fashion offers beautiful artificial gold plated jewelry and fashion accessories for every occasion.",
        newsletterTitle: "Stay Updated",
        newsletterSubtitle: "Subscribe to our newsletter for the latest updates and offers",
        newsletterPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        about: "About",
        aboutText: "Soni Artificial Fashion offers beautiful artificial gold plated jewelry and fashion accessories for every occasion.",
        customerService: "Customer Service",
        faq: "FAQ",
        shippingReturns: "Shipping & Returns",
        contactUs: "Contact Us",
        categories: "Categories",
        necklaces: "Necklaces",
        earrings: "Earrings",
        bracelets: "Bracelets",
        rings: "Rings",
        fashionAccessories: "Fashion Accessories",
        legal: "Legal",
        termsConditions: "Terms & Conditions",
        privacyPolicy: "Privacy Policy",
        refundPolicy: "Refund Policy",
        rights: "All rights reserved.",
        quickLinks: "Quick Links",
        support: "Support",
        supportEmail: "support@soniartificialfashion.com",
        supportPhone: "+91 98765 43210",
        address: "Delhi, India"
      },
      hi: {
        brandDescription: "सोनी आर्टिफिशियल फैशन हर अवसर के लिए सुंदर कृत्रिम सोने की प्लेटेड आभूषण और फैशन सहायक उत्पाद प्रदान करता है।",
        newsletterTitle: "अपडेट रहें",
        newsletterSubtitle: "नवीनतम अपडेट और ऑफर के लिए हमारे न्यूज़लेटर की सदस्यता लें",
        newsletterPlaceholder: "अपना ईमेल दर्ज करें",
        subscribe: "सदस्यता लें",
        about: "बारे में",
        aboutText: "सोनी आर्टिफिशियल फैशन हर अवसर के लिए सुंदर कृत्रिम सोने की प्लेटेड आभूषण और फैशन सहायक उत्पाद प्रदान करता है।",
        customerService: "ग्राहक सेवा",
        faq: "सामान्य प्रश्न",
        shippingReturns: "शिपिंग और वापसी",
        contactUs: "संपर्क करें",
        categories: "श्रेणियाँ",
        necklaces: "हार",
        earrings: "कान के आभूषण",
        bracelets: "कंगन",
        rings: "अंगूठियाँ",
        fashionAccessories: "फैशन सहायक उत्पाद",
        legal: "कानूनी",
        termsConditions: "नियम और शर्तें",
        privacyPolicy: "गोपनीयता नीति",
        refundPolicy: "धनवापसी नीति",
        rights: "सर्वाधिकार सुरक्षित।",
        quickLinks: "त्वरित लिंक",
        support: "सहायता",
        supportEmail: "support@soniartificialfashion.com",
        supportPhone: "+91 98765 43210",
        address: "दिल्ली, भारत"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-amber-900 font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Soni Fashion</h3>
                <p className="text-amber-200 text-sm">Artificial Jewelry & Fashion</p>
              </div>
            </div>
            <p className="text-amber-100 text-sm mb-4">
              {t('brandDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-200 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors" title="YouTube">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-amber-200 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-700">{t('about')}</h4>
            <p className="text-amber-100 text-sm mb-4">
              {t('aboutText')}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-700">{t('customerService')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('/faq')} className="text-amber-100 hover:text-white transition-colors text-left">{t('faq')}</button></li>
              <li><button onClick={() => navigateTo('/shipping-policy')} className="text-amber-100 hover:text-white transition-colors text-left">{t('shippingReturns')}</button></li>
              <li><button onClick={() => navigateTo('/contact')} className="text-amber-100 hover:text-white transition-colors text-left">{t('contactUs')}</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-700">{t('categories')}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('/necklaces')} className="text-amber-100 hover:text-white transition-colors text-left">{t('necklaces')}</button></li>
              <li><button onClick={() => navigateTo('/earrings')} className="text-amber-100 hover:text-white transition-colors text-left">{t('earrings')}</button></li>
              <li><button onClick={() => navigateTo('/bracelets')} className="text-amber-100 hover:text-white transition-colors text-left">{t('bracelets')}</button></li>
              <li><button onClick={() => navigateTo('/rings')} className="text-amber-100 hover:text-white transition-colors text-left">{t('rings')}</button></li>
              <li><button onClick={() => navigateTo('/fashion-accessories')} className="text-amber-100 hover:text-white transition-colors text-left">{t('fashionAccessories')}</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 pb-2 border-b border-amber-700">{t('support')}</h4>
            <ul className="space-y-2 text-sm text-amber-100">
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{t('supportEmail')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{t('supportPhone')}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-amber-700 mt-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-semibold mb-2">{t('newsletterTitle')}</h4>
            <p className="text-amber-100 mb-6">{t('newsletterSubtitle')}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-grow px-4 py-3 rounded-lg bg-amber-800 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-white"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-amber-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-amber-200 mb-4 md:mb-0">
              <p>&copy; 2025 Soni Artificial Fashion. {t('rights')}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <button onClick={() => navigateTo('/terms-conditions')} className="text-amber-200 hover:text-white transition-colors">
                {t('termsConditions')}
              </button>
              <button onClick={() => navigateTo('/privacy-policy')} className="text-amber-200 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </button>
              <button onClick={() => navigateTo('/refund-policy')} className="text-amber-200 hover:text-white transition-colors">
                {t('refundPolicy')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}