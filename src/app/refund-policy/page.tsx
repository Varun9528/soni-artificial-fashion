'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  const t = (key: string) => {
    const translations: any = {
      en: {
        title: 'Return & Refund Policy',
        intro: 'At Lettex Ayurvedic Wellness Marketplace, we want you to be completely satisfied with your purchase. If for any reason you are not satisfied, we\'re here to help.',
        policySections: [
          {
            title: 'Return Policy',
            content: `
              Items can be returned within 7 days of delivery if they are defective or damaged.
              
              Products must be unused, in original packaging, and accompanied by proof of purchase.
              
              Customized or handmade items may not be eligible for return unless defective.
              
              All returns must be authorized by our customer service team before sending back items.
            `
          },
          {
            title: 'Refund Process',
            content: `
              Once we receive your returned item and verify its condition, we will process your refund.
              
              Refunds will be processed within 5-7 business days after inspection.
              
              Refunds will be issued to the original payment method used for the purchase.
              
              Shipping charges are non-refundable unless the return is due to our error.
            `
          },
          {
            title: 'How to Initiate a Return',
            content: `
              Contact our customer support team at support@pachmarhi.com with your order number and reason for return.
              
              Our team will provide you with a Return Authorization Number (RAN) and return instructions.
              
              Pack the item securely in its original packaging if possible.
              
              Ship the item to the address provided by our team.
            `
          },
          {
            title: 'Non-Returnable Items',
            content: `
              Customized or personalized items (unless defective)
              
              Items damaged due to misuse or improper care
              
              Perishable goods or items with hygiene concerns
              
              Digital downloads or software
              
              Gift cards
            `
          }
        ],
        contactInfo: {
          title: 'Contact Information',
          email: 'support@lettex.com',
          phone: '+91 98765 43210',
          hours: 'Monday to Saturday, 9:00 AM to 6:00 PM IST'
        }
      },
      hi: {
        title: 'वापसी और धनवापसी नीति',
        intro: 'लेटेक्स आयुर्वेदिक स्वास्थ्य बाजार में, हम चाहते हैं कि आप अपनी खरीदारी से पूरी तरह संतुष्ट हों। यदि किसी कारण से आप संतुष्ट नहीं हैं, तो हम यहां सहायता के लिए हैं।',
        policySections: [
          {
            title: 'वापसी नीति',
            content: `
              यदि वस्तुएं दोषपूर्ण या क्षतिग्रस्त हैं तो डिलीवरी के 7 दिनों के भीतर वापस की जा सकती हैं।
              
              उत्पाद अप्रयुक्त, मूल पैकिंग में और खरीदारी के प्रमाण के साथ होने चाहिए।
              
              अनुकूलित या हाथ से बने वस्तुएं दोषपूर्ण होने के अलावा वापसी के लिए पात्र नहीं हो सकती हैं।
              
              सभी वापसी के लिए हमारी ग्राहक सेवा टीम द्वारा प्राधिकृत होना आवश्यक है।
            `
          },
          {
            title: 'धनवापसी प्रक्रिया',
            content: `
              एक बार जब हम आपकी वापस की गई वस्तु प्राप्त करेंगे और उसकी स्थिति का सत्यापन करेंगे, तो हम आपकी धनवापसी की प्रक्रिया करेंगे।
              
              निरीक्षण के बाद 5-7 कार्य दिवसों के भीतर धनवापसी की प्रक्रिया की जाएगी।
              
              धनवापसी मूल भुगतान विधि में की जाएगी जिसका उपयोग खरीदारी के लिए किया गया था।
              
              यदि वापसी हमारी त्रुटि के कारण है तो शिपिंग शुल्क वापस किया जाएगा।
            `
          },
          {
            title: 'वापसी कैसे शुरू करें',
            content: `
              अपने आदेश संख्या और वापसी के कारण के साथ हमारी ग्राहक समर्थन टीम से support@pachmarhi.com पर संपर्क करें।
              
              हमारी टीम आपको एक वापसी प्राधिकरण संख्या (RAN) और वापसी निर्देश प्रदान करेगी।
              
              यदि संभव हो तो वस्तु को उसके मूल पैकिंग में सुरक्षित रूप से पैक करें।
              
              हमारी टीम द्वारा प्रदान किए गए पते पर वस्तु भेजें।
            `
          },
          {
            title: 'गैर-वापसी योग्य वस्तुएं',
            content: `
              अनुकूलित या व्यक्तिगत वस्तुएं (जब तक कि दोषपूर्ण न हो)
              
              दुरुपयोग या अनुचित देखभाल के कारण क्षतिग्रस्त वस्तुएं
              
              खराब होने वाली वस्तुएं या स्वास्थ्य संबंधी चिंताएं वाली वस्तुएं
              
              डिजिटल डाउनलोड या सॉफ्टवेयर
            
              उपहार कार्ड
            `
          }
        ],
        contactInfo: {
          title: 'संपर्क जानकारी',
          email: 'support@lettex.com',
          phone: '+91 98765 43210',
          hours: 'सोमवार से शनिवार, सुबह 9:00 बजे से शाम 6:00 बजे तक IST'
        }
      }
    };
    
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('intro')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 space-y-10">
              {t('policySections').map((section: any, index: number) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {section.content.split('\n').filter((line: string) => line.trim() !== '').map((line: string, lineIndex: number) => (
                      line.trim().startsWith('-') ? (
                        <li key={lineIndex} className="ml-4">{line.substring(1).trim()}</li>
                      ) : (
                        <p key={lineIndex} className="mb-3 text-gray-700 dark:text-gray-300">
                          {line}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('contactInfo.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {language === 'en' ? 'Email' : 'ईमेल'}
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      {t('contactInfo.email')}
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {language === 'en' ? 'Phone' : 'फ़ोन'}
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      {t('contactInfo.phone')}
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                      {language === 'en' ? 'Support Hours' : 'समर्थन घंटे'}
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      {t('contactInfo.hours')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? 'For any questions about our return policy, please contact our customer support team.' 
                : 'हमारी वापसी नीति के बारे में किसी भी प्रश्न के लिए, कृपया हमारी ग्राहक समर्थन टीम से संपर्क करें।'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}