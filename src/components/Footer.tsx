'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { language } = useLanguage();
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert(language === 'en' ? 'Newsletter signup coming soon!' : 'न्यूज़लेटर सदस्यता जल्द आ रही है!');
    setEmail('');
  };

  const t = (key: string) => {
    const translations: any = {
      en: {
        brandDescription: "Lettex crafts handmade, herbal, and organic products rooted in the traditional knowledge of India.",
        newsletterTitle: "Stay Updated",
        newsletterSubtitle: "Subscribe to our newsletter for the latest updates and offers",
        newsletterPlaceholder: "Enter your email",
        subscribe: "Subscribe",
        about: "About",
        aboutText: "Lettex crafts handmade, herbal, and organic products rooted in the traditional knowledge of India.",
        customerService: "Customer Service",
        faq: "FAQ",
        shippingReturns: "Shipping & Returns",
        contactUs: "Contact Us",
        categories: "Categories",
        woodenCarvings: "Herbal Powders",
        tribalPaintings: "Organic Candy",
        jewelryAccessories: "Natural Honey",
        handwovenTextiles: "Handmade Soap",
        homeDecor: "Ayurvedic Products",
        legal: "Legal",
        termsConditions: "Terms & Conditions",
        privacyPolicy: "Privacy Policy",
        refundPolicy: "Refund Policy",
        rights: "All rights reserved.",
        quickLinks: "Quick Links"
      },
      hi: {
        brandDescription: "लेटेक्स पारंपरिक ज्ञान पर आधारित हस्तनिर्मित, हर्बल और जैविक उत्पाद बनाता है।",
        newsletterTitle: "अपडेट रहें",
        newsletterSubtitle: "नवीनतम अपडेट और ऑफर के लिए हमारे न्यूज़लेटर की सदस्यता लें",
        newsletterPlaceholder: "अपना ईमेल दर्ज करें",
        subscribe: "सदस्यता लें",
        about: "बारे में",
        aboutText: "लेटेक्स पारंपरिक ज्ञान पर आधारित हस्तनिर्मित, हर्बल और जैविक उत्पाद बनाता है।",
        customerService: "ग्राहक सेवा",
        faq: "सामान्य प्रश्न",
        shippingReturns: "शिपिंग और वापसी",
        contactUs: "संपर्क करें",
        categories: "श्रेणियाँ",
        woodenCarvings: "हर्बल पाउडर",
        tribalPaintings: "जैविक कैंडी",
        jewelryAccessories: "प्राकृतिक शहद",
        handwovenTextiles: "हस्तनिर्मित साबुन",
        homeDecor: "आयुर्वेदिक उत्पाद",
        legal: "कानूनी",
        termsConditions: "नियम और शर्तें",
        privacyPolicy: "गोपनीयता नीति",
        refundPolicy: "धनवापसी नीति",
        rights: "सर्वाधिकार सुरक्षित।",
        quickLinks: "त्वरित लिंक"
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Lettex</h3>
                <p className="text-sm text-gray-400">Natural Wellness Products</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('brandDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="YouTube">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('about')}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('aboutText')}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('customerService')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">{t('faq')}</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">{t('shippingReturns')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('contactUs')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('categories')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/wooden-carvings" className="text-gray-400 hover:text-white transition-colors">{t('woodenCarvings')}</Link></li>
              <li><Link href="/category/tribal-paintings" className="text-gray-400 hover:text-white transition-colors">{t('tribalPaintings')}</Link></li>
              <li><Link href="/category/jewelry-accessories" className="text-gray-400 hover:text-white transition-colors">{t('jewelryAccessories')}</Link></li>
              <li><Link href="/category/handwoven-textiles" className="text-gray-400 hover:text-white transition-colors">{t('handwovenTextiles')}</Link></li>
              <li><Link href="/category/home-decor" className="text-gray-400 hover:text-white transition-colors">{t('homeDecor')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">{t('termsConditions')}</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">{t('refundPolicy')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-semibold mb-2">{t('newsletterTitle')}</h4>
            <p className="text-gray-400 mb-6">{t('newsletterSubtitle')}</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2024 Lettex. {t('rights')}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">
                {t('termsConditions')}
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">
                {t('refundPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}