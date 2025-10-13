'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  // Mock localization function
  const t = (key: string) => {
    const translations: any = {
      en: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: January 15, 2024',
        intro: 'This Privacy Policy describes how Lettex Ayurvedic Wellness Marketplace collects, uses, and protects your personal information when you visit our website or make a purchase.',
        policySections: [
          {
            title: 'Information We Collect',
            content: 'We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, shipping address, and payment information.'
          },
          {
            title: 'How We Use Your Data',
            content: 'We use your information to process orders, communicate with you, personalize your experience, and improve our services. We may also use your information for marketing purposes with your consent.'
          },
          {
            title: 'Sharing with Third Parties',
            content: 'We may share your information with trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.'
          },
          {
            title: 'Data Security Measures',
            content: 'We implement a variety of security measures to maintain the safety of your personal information. All supplied sensitive/credit information is stored behind secured networks and is only accessible by a limited number of persons.'
          },
          {
            title: 'Your Rights',
            content: 'You have the right to access, update, or delete your personal information at any time. You may also opt-out of marketing communications and manage your cookie preferences.'
          },
          {
            title: 'Cookies and Tracking Technologies',
            content: 'We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.'
          },
          {
            title: 'Changes to This Policy',
            content: 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.'
          },
          {
            title: 'Contact Us',
            content: "If you have any questions about this privacy policy, please contact us at privacy@lettex.com.",
            contactInfo: {
              email: 'privacy@lettex.com',
              address: 'Mumbai, Maharashtra, India'
            }
          }
        ],
        contactUsTitle: 'Contact Us',
        contactUsContent: "If you have any questions about this privacy policy, please contact us at privacy@lettex.com.",
        contactInfo: {
          email: 'privacy@lettex.com',
          address: 'Mumbai, Maharashtra, India'
        }
      },
      hi: {
        title: 'गोपनीयता नीति',
        lastUpdated: 'अंतिम अपडेट: 15 जनवरी, 2024',
        intro: 'यह गोपनीयता नीति वर्णन करती है कि लेटेक्स आयुर्वेदिक स्वास्थ्य बाजार कैसे आपकी व्यक्तिगत जानकारी को एकत्र, उपयोग और सुरक्षित करता है जब आप हमारी वेबसाइट पर जाते हैं या खरीदारी करते हैं।',
        policySections: [
          {
            title: 'हम आपसे कैसे जानकारी एकत्र करते हैं',
            content: 'हम आपसे जो जानकारी आप हमें निर्दिष्ट रूप से प्रदान करते हैं, उसे एकत्र करते हैं, जैसे जब आप एक खाता बनाते हैं, आदेश देते हैं, या हमसे संपर्क करते हैं। यह आपका नाम, ईमेल पता, फोन नंबर, शिपिंग पता, और भुगतान जानकारी शामिल हो सकता है।'
          },
          {
            title: 'हम आपकी जानकारी कैसे उपयोग करते हैं',
            content: 'हम आपकी जानकारी को आदेशों को प्रसंस्कृत करने, आपसे संपर्क करने, आपका अनुभव व्यक्तिगत करने, और हमारी सेवाओं को सुधारने के लिए उपयोग करते हैं। हम आपकी सहमति के साथ आपकी जानकारी को विवाद के लिए भी उपयोग कर सकते हैं।'
          },
          {
            title: 'तीसरे पक्षों के साथ साझा करना',
            content: 'हम आपकी जानकारी उन विश्वसनीय तीसरे पक्षों के साथ साझा कर सकते हैं जो हमें हमारी वेबसाइट का संचालन, अपना व्यवसाय कार्य करना, या हमारे उपयोगकर्ताओं को सेवा करना मदद करते हैं, जब तक उन पक्षों को यह जानकारी गुप्त रखने की सहमति हो।'
          },
          {
            title: 'जानकारी सुरक्षा मापांक',
            content: 'हम आपकी व्यक्तिगत जानकारी की सुरक्षा रखने के लिए विभिन्न सुरक्षा मापांक लागू करते हैं। सभी प्रदान की गई संवेदनशील/क्रेडिट जानकारी सुरक्षित नेटवर्कों पीछे संग्रहीत की जाती है और केवल कुछ व्यक्तियों द्वारा ही उपलब्ध है।'
          },
          {
            title: 'आपका अधिकार',
            content: 'आप किसी भी समय पर आपकी व्यक्तिगत जानकारी पहुँच, अद्यतन या मिटाने का अधिकार रखते हैं। आप विवाद संचालनों से बाहर निकल सकते हैं और कुकी पसंदावली का प्रबंधन कर सकते हैं।'
          },
          {
            title: 'कुकीज़ और ट्रैकिंग तकनीक',
            content: 'हम आपका ब्राउज़िंग अनुभव बढ़ावा देने और वेबसाइट ट्रैफिक का विश्लेषण करने के लिए कुकीज़ और समान ट्रैकिंग तकनीकों का उपयोग करते हैं।'
          },
          {
            title: 'यह नीति में परिवर्तन',
            content: 'हम इस गोपनीयता नीति को समय समय पर अपडेट कर सकते हैं। हम आपको किसी भी परिवर्तनों की सूचना देंगे जिसे यह पृष्ठ पर नई गोपनीयता नीति पोस्ट करके।'
          },
          {
            title: 'संपर्क करें',
            content: "यदि आपके इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमें privacy@lettex.com पर संपर्क करें।",
            contactInfo: {
              email: 'privacy@lettex.com',
              address: 'मुंबई, महाराष्ट्र, भारत'
            }
          }
        ],
        contactUsTitle: 'संपर्क करें',
        contactUsContent: "यदि आपके इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, तो कृपया हमें privacy@lettex.com पर संपर्क करें।",
        contactInfo: {
          email: 'privacy@lettex.com',
          address: 'मुंबई, महाराष्ट्र, भारत'
        }
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('introduction')}
              </p>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('informationWeCollect')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('informationWeCollectContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('howWeUseData')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('howWeUseDataContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('sharingWithThirdParties')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('sharingWithThirdPartiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('dataSecurity')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('dataSecurityContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('yourRights')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('yourRightsContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('cookies')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('cookiesContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('changesToPolicy')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('changesToPolicyContent')}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {t('contactUs')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('contactUsContent')}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('lastUpdated')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}