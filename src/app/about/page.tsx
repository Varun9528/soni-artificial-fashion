'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'About Pachmarhi Tribal Art Marketplace',
      content: `
        Pachmarhi Tribal Art Marketplace is dedicated to preserving and promoting the indigenous arts and crafts of the Pachmarhi region in Madhya Pradesh.

        Our mission is to provide a sustainable online platform where tribal artisans can showcase their authentic creations—handcrafted bamboo items, traditional paintings, wooden carvings, and textiles—directly to buyers across India and beyond.

        By connecting artisans with customers, we aim to:

        Preserve traditional knowledge and craftsmanship

        Empower artisans with fair trade opportunities

        Provide customers with unique, eco-friendly, and meaningful art pieces

        Every purchase directly supports the livelihood of tribal artisans and helps sustain their cultural heritage.
      `,
      missionTitle: 'Our Mission',
      missionContent: 'To empower tribal artisans by providing them with a global platform to showcase their traditional crafts while ensuring fair compensation and preserving cultural heritage.',
      visionTitle: 'Our Vision',
      visionContent: 'To become the leading marketplace for authentic tribal art, fostering sustainable livelihoods for artisans and promoting cultural appreciation worldwide.',
      valuesTitle: 'Our Values',
      values: [
        'Authenticity - We ensure all products are genuine tribal art',
        'Fair Trade - We guarantee fair prices for artisans',
        'Sustainability - We promote eco-friendly practices',
        'Cultural Preservation - We help preserve traditional crafts'
      ]
    },
    hi: {
      title: 'पचमढ़ी जनजातीय कला बाजार के बारे में',
      content: `
        पचमढ़ी जनजातीय कला बाजार मध्य प्रदेश के पचमढ़ी क्षेत्र की स्वदेशी कला और शिल्प को संरक्षित और प्रचारित करने के लिए समर्पित है।

        हमारा उद्देश्य एक स्थायी ऑनलाइन मंच प्रदान करना है जहां जनजातीय कारीगर अपनी प्रामाणिक रचनाओं—हाथ से बने बांस के आइटम, पारंपरिक चित्रकारी, लकड़ी की कार्विंग और कपड़े—को सीधे भारत और उससे परे खरीदारों को प्रदर्शित कर सकते हैं।

        कारीगरों को ग्राहकों से जोड़कर, हमारा उद्देश्य है:

        पारंपरिक ज्ञान और शिल्प को संरक्षित करना

        कारीगरों को निष्पक्ष व्यापार के अवसर प्रदान करना

        ग्राहकों को अद्वितीय, पर्यावरण-अनुकूल और सार्थक कला के टुकड़े प्रदान करना

        प्रत्येक खरीदारी सीधे जनजातीय कारीगरों की आजीविका का समर्थन करती है और उनकी सांस्कृतिक विरासत को बनाए रखने में मदद करती है।
      `,
      missionTitle: 'हमारा उद्देश्य',
      missionContent: 'जनजातीय कारीगरों को सशक्त बनाना ताकि वे अपनी पारंपरिक शिल्प को प्रदर्शित करने के लिए एक वैश्विक मंच प्राप्त कर सकें जबकि साथ ही उचित प्रतिफल सुनिश्चित करें और सांस्कृतिक विरासत को संरक्षित रखें।',
      visionTitle: 'हमारी दृष्टि',
      visionContent: 'प्रामाणिक जनजातीय कला के लिए अग्रणी बाजार बनना, कारीगरों के लिए स्थायी आजीविका पैदा करना और दुनिया भर में सांस्कृतिक सराहना को बढ़ावा देना।',
      valuesTitle: 'हमारे मूल्य',
      values: [
        'प्रामाणिकता - हम सुनिश्चित करते हैं कि सभी उत्पाद प्रामाणिक जनजातीय कला हैं',
        'निष्पक्ष व्यापार - हम कारीगरों के लिए उचित मूल्य की गारंटी देते हैं',
        'स्थायित्व - हम पर्यावरण-अनुकूल प्रथाओं को बढ़ावा देते हैं',
        'सांस्कृतिक संरक्षण - हम पारंपरिक शिल्प को संरक्षित करने में मदद करते हैं'
      ]
    }
  };

  const t = translations[language as 'en' | 'hi'];
  const contentLines = t.content.split('\n').filter(line => line.trim() !== '');

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

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">
              {language === 'en' ? 'Support Our Artisans' : 'हमारे कारीगरों का समर्थन करें'}
            </h3>
            <p className="text-amber-700 dark:text-amber-300">
              {language === 'en' 
                ? 'Every purchase makes a difference in preserving our cultural heritage.' 
                : 'प्रत्येक खरीदारी हमारी सांस्कृतिक विरासत को संरक्षित करने में अंतर लाती है।'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}