'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'About Lettex Marketplace',
      content: `
        Welcome to Lettex Marketplace — Your Local Store Online.

        At Lettex, we believe every household deserves fresh, high-quality essentials at fair prices.
        Our marketplace connects you directly with trusted local suppliers and brings you the best of groceries, dairy, refined oils, and Lettex-branded products — all in one platform.

        Lettex Marketplace brings your neighborhood grocery and dairy shop to your screen — offering refined oils, milk products, fresh groceries, and our own Lettex-branded essentials with unbeatable freshness and quality.
      `,
      missionTitle: 'Our Mission',
      missionContent: 'To deliver daily essentials with trust, freshness, and local quality — combining traditional value with digital convenience.',
      visionTitle: 'Our Vision',
      visionContent: 'To make daily grocery shopping simple, fast, and enjoyable with trusted local roots and modern technology.',
      valuesTitle: 'Why Choose Lettex',
      values: [
        'Local freshness, digital convenience',
        'Quality you can taste and trust',
        'Fast and reliable delivery',
        'Transparent pricing — no hidden costs'
      ],
      commitmentTitle: 'Our Commitment to You',
      commitmentContent: `
        When you choose Lettex, you're choosing products that are:

        Fresh: Sourced and delivered with care to maintain peak freshness
        Trusted: From verified local suppliers and trusted brands
        Affordable: Competitive pricing with no hidden costs
        Convenient: Easy online shopping with fast delivery

        We believe that healthy living should be accessible to everyone. Our products are priced competitively to ensure that quality nutrition and wellness solutions are within reach for every household.
      `
    },
    hi: {
      title: 'लेटेक्स मार्केटप्लेस के बारे में',
      content: `
        लेटेक्स मार्केटप्लेस में आपका स्वागत है — आपकी ऑनलाइन स्थानीय दुकान।

        लेटेक्स में, हम मानते हैं कि प्रत्येक घर को उचित मूल्य पर ताजा, उच्च गुणवत्ता वाली आवश्यक वस्तुएं मिलनी चाहिए।
        हमारा मार्केटप्लेस आपको सीधे विश्वसनीय स्थानीय आपूर्तिकर्ताओं से जोड़ता है और आपको किराने की वस्तुएं, डेयरी, शोधित तेल और लेटेक्स-ब्रांडेड उत्पादों का सर्वश्रेष्ठ एक प्लेटफॉर्म पर प्रदान करता है।

        लेटेक्स मार्केटप्लेस आपके स्क्रीन पर आपकी पड़ोस की किराना और डेयरी की दुकान लाता है — शोधित तेल, दूध के उत्पाद, ताजा किराने की वस्तुएं और हमारे स्वयं के लेटेक्स-ब्रांडेड आवश्यक वस्तुएं प्रदान करता है जिनकी ताजगी और गुणवत्ता अतुलनीय है।
      `,
      missionTitle: 'हमारा उद्देश्य',
      missionContent: 'दैनिक आवश्यक वस्तुएं विश्वास, ताजगी और स्थानीय गुणवत्ता के साथ वितरित करना — पारंपरिक मूल्य को डिजिटल सुविधा के साथ जोड़ना।',
      visionTitle: 'हमारी दृष्टि',
      visionContent: 'विश्वसनीय स्थानीय मूलों और आधुनिक प्रौद्योगिकी के साथ दैनिक किराने की खरीदारी को सरल, तीव्र और आनंददायक बनाना।',
      valuesTitle: 'लेटेक्स क्यों चुनें?',
      values: [
        'स्थानीय ताजगी, डिजिटल सुविधा',
        'गुणवत्ता जिसे आप स्वाद और विश्वास कर सकते हैं',
        'तीव्र और विश्वसनीय डिलीवरी',
        'पारदर्शी मूल्य — कोई छिपी हुई लागत नहीं'
      ],
      commitmentTitle: 'आपके प्रति हमारी प्रतिबद्धता',
      commitmentContent: `
        जब आप लेटेक्स चुनते हैं, तो आप उन उत्पादों को चुनते हैं जो हैं:

        ताजा: सावधानीपूर्वक स्रोत लिया गया और ताजगी बनाए रखने के लिए वितरित
        विश्वसनीय: सत्यापित स्थानीय आपूर्तिकर्ताओं और विश्वसनीय ब्रांडों से
        सस्ता: प्रतिस्पर्धी मूल्य निर्धारण बिना किसी छिपी हुई लागत के
        सुविधाजनक: तीव्र डिलीवरी के साथ आसान ऑनलाइन खरीदारी

        हम मानते हैं कि स्वस्थ जीवन हर किसी के लिए सुलभ होना चाहिए। हमारे उत्पाद प्रतिस्पर्धी रूप से मूल्य निर्धारित किए गए हैं ताकि गुणवत्ता पोषण और स्वास्थ्य समाधान प्रत्येक घर तक पहुंच जाएं।
      `
    }
  };

  const t = translations[language as 'en' | 'hi'];
  const contentLines = t.content.split('\n').filter(line => line.trim() !== '');
  const commitmentLines = t.commitmentContent.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t.title}
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {contentLines.map((line, index) => (
                line.trim() === '' ? (
                  <br key={index} />
                ) : line.trim().startsWith('-') ? (
                  <li key={index} className="ml-6">{line.substring(1).trim()}</li>
                ) : (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t.missionTitle}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t.missionContent}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t.visionTitle}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {t.visionContent}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t.valuesTitle}
              </h2>
              <ul className="space-y-2">
                {t.values.map((value, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t.commitmentTitle}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {commitmentLines.map((line, index) => (
                line.trim() === '' ? (
                  <br key={index} />
                ) : line.trim().startsWith('-') ? (
                  <li key={index} className="ml-6">{line.substring(1).trim()}</li>
                ) : (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
              {language === 'en' ? 'Choose Lettex for Pure Wellness' : 'शुद्ध स्वास्थ्य के लिए लेटेक्स चुनें'}
            </h3>
            <p className="text-amber-700 dark:text-amber-300">
              {language === 'en' 
                ? 'Experience the purity and quality you deserve with Lettex Marketplace.' 
                : 'लेटेक्स मार्केटप्लेस के साथ आपके योग्य शुद्धता और गुणवत्ता का अनुभव करें।'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}