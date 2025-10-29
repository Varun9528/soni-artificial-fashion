'use client';

import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'About Soni Artificial Fashion',
      content: `
        Welcome to Soni Artificial Fashion — Your Premier Destination for Exquisite Gold-Plated Jewelry.

        At Soni Artificial Fashion, we believe that everyone deserves to adorn themselves with beautiful, high-quality jewelry at affordable prices. Our brand specializes in crafting stunning artificial gold-plated jewelry that combines traditional Indian craftsmanship with contemporary design aesthetics.

        Founded in the heart of India's jewelry capital, Soni Artificial Fashion brings you an extensive collection of gold-plated accessories, from elegant necklaces and statement earrings to trendy bracelets and rings. Each piece in our collection is meticulously designed to offer you the luxury and elegance of real gold jewelry without the premium price tag.
      `,
      missionTitle: 'Our Mission',
      missionContent: 'To make exquisite gold-plated jewelry accessible to everyone by combining traditional craftsmanship with modern design and affordable pricing.',
      visionTitle: 'Our Vision',
      visionContent: 'To become the most trusted brand for artificial gold-plated jewelry, recognized for our quality, design innovation, and customer satisfaction.',
      valuesTitle: 'Why Choose Soni Artificial Fashion',
      values: [
        'Premium quality gold-plated jewelry crafted with precision',
        'Affordable luxury for every budget and occasion',
        'Contemporary designs with traditional Indian touch',
        'Fast and reliable delivery across India',
        'Hassle-free returns and exchanges with customer support',
        'Eco-friendly materials and sustainable practices'
      ],
      commitmentTitle: 'Our Commitment to You',
      commitmentContent: `
        When you choose Soni Artificial Fashion, you're choosing products that are:

        Exquisite Design: Each piece is thoughtfully designed by our expert artisans who blend traditional techniques with modern aesthetics
        Premium Quality: We use high-quality base materials and advanced plating techniques for long-lasting beauty
        Affordable Luxury: Enjoy the look of real gold at a fraction of the cost with our carefully priced collections
        Durable: Our jewelry is built to last with proper care and maintenance
        Trendy: Stay fashionable with our regularly updated collections that follow the latest fashion trends
        Hypoallergenic: Our materials are carefully selected to minimize allergic reactions

        We believe that jewelry is more than just an accessory—it's a form of self-expression. Our collections are designed to complement every outfit and occasion, from daily wear to special celebrations. Whether you're looking for traditional pieces for weddings or contemporary designs for everyday elegance, Soni Artificial Fashion has something perfect for you.
      `,
      historyTitle: 'Our Journey',
      historyContent: `
        Soni Artificial Fashion began as a small family business with a passion for creating beautiful jewelry that everyone could afford. Over the years, we've grown into a trusted brand known for our quality and craftsmanship.

        Our journey started in a small workshop where our founder, Mr. Soni, began experimenting with different plating techniques to create affordable yet beautiful jewelry. Today, we have a state-of-the-art manufacturing facility and a team of skilled artisans who continue to innovate and create stunning pieces.

        We take pride in our heritage and are committed to preserving traditional Indian jewelry-making techniques while embracing modern technology to enhance quality and efficiency.
      `
    },
    hi: {
      title: 'सोनी आर्टिफिशियल फैशन के बारे में',
      content: `
        सोनी आर्टिफिशियल फैशन में आपका स्वागत है — सुंदर सोने की प्लेटेड आभूषण के लिए आपकी प्रीमियम गंतव्य स्थल।

        सोनी आर्टिफिशियल फैशन में, हम मानते हैं कि प्रत्येक व्यक्ति को सुंदर, उच्च गुणवत्ता वाले आभूषण को सस्ती कीमत पर सजाने का अधिकार है। हमारा ब्रांड कलाकृतियों द्वारा निर्मित सुंदर कृत्रिम सोने की प्लेटेड आभूषण को आधुनिक डिज़ाइन के साथ पेश करता है जो पारंपरिक भारतीय शिल्पकला को जोड़ता है।

        भारत की आभूषण राजधानी के हृदय में स्थापित, सोनी आर्टिफिशियल फैशन आपको सोने की प्लेटेड सहायक उत्पादों का विस्तृत संग्रह प्रदान करता है, शानदार हार और वक्तव्य कान के आभूषण से लेकर ट्रेंडी कंगन और अंगूठियों तक। हमारे संग्रह का प्रत्येक टुकड़ा ध्यान से डिज़ाइन किया गया है ताकि आप वास्तविक सोने के आभूषण की शान और सौंदर्य का आनंद ले सकें बिना प्रीमियम मूल्य के।
      `,
      missionTitle: 'हमारा उद्देश्य',
      missionContent: 'पारंपरिक शिल्पकला को आधुनिक डिज़ाइन और सस्ती कीमत के साथ जोड़कर सभी के लिए शानदार सोने की प्लेटेड आभूषण को सुलभ बनाना।',
      visionTitle: 'हमारी दृष्टि',
      visionContent: 'कृत्रिम सोने की प्लेटेड आभूषण के लिए सबसे विश्वसनीय ब्रांड बनना, जिसे हमारी गुणवत्ता, डिज़ाइन नवाचार और ग्राहक संतुष्टि के लिए जाना जाता है।',
      valuesTitle: 'सोनी आर्टिफिशियल फैशन क्यों चुनें?',
      values: [
        'सटीकता के साथ निर्मित प्रीमियम गुणवत्ता वाले सोने की प्लेटेड आभूषण',
        'प्रत्येक बजट और अवसर के लिए सस्ती शान',
        'पारंपरिक भारतीय स्पर्श के साथ समकालीन डिज़ाइन',
        'भारत भर में तीव्र और विश्वसनीय डिलीवरी',
        'ग्राहक समर्थन के साथ परेशानी मुक्त वापसी और अदला-बदली',
        'पर्यावरण अनुकूल सामग्री और टिकाऊ प्रथाएँ'
      ],
      commitmentTitle: 'आपके प्रति हमारी प्रतिबद्धता',
      commitmentContent: `
        जब आप सोनी आर्टिफिशियल फैशन चुनते हैं, तो आप उन उत्पादों को चुनते हैं जो हैं:

        शानदार डिज़ाइन: प्रत्येक टुकड़ा हमारे विशेषज्ञ कलाकारों द्वारा ध्यान से डिज़ाइन किया गया है जो पारंपरिक तकनीकों को आधुनिक सौंदर्यशास्त्र के साथ मिलाते हैं
        प्रीमियम गुणवत्ता: हम उच्च गुणवत्ता वाली आधार सामग्री और उन्नत प्लेटिंग तकनीकों का उपयोग करते हैं ताकि लंबे समय तक सौंदर्य बना रहे
        सस्ती शान: हमारे सावधानीपूर्वक मूल्य निर्धारित संग्रह के साथ वास्तविक सोने के मूल्य का केवल एक अंश में सोने की शान का आनंद लें
        टिकाऊ: हमारे आभूषण उचित देखभाल और रखरखाव के साथ बनाए रखने के लिए बनाए गए हैं
        ट्रेंडी: नवीनतम फैशन ट्रेंड का अनुसरण करने वाले हमारे नियमित रूप से अद्यतन संग्रह के साथ फैशनेबल रहें
        हाइपोएलर्जेनिक: हमारी सामग्री को एलर्जी प्रतिक्रियाओं को कम करने के लिए सावधानीपूर्वक चुना जाता है

        हम मानते हैं कि आभूषण केवल एक सहायक उत्पाद नहीं है—यह आत्म-अभिव्यक्ति का एक रूप है। हमारे संग्रह को प्रत्येक पोशाक और अवसर के अनुकूल डिज़ाइन किया गया है, दैनिक पहनावे से लेकर विशेष समारोहों तक। चाहे आप शादियों के लिए पारंपरिक टुकड़ों की तलाश कर रहे हों या दैनिक सौंदर्य के लिए समकालीन डिज़ाइन, सोनी आर्टिफिशियल फैशन के पास आपके लिए कुछ सही है।
      `,
      historyTitle: 'हमारी यात्रा',
      historyContent: `
        सोनी आर्टिफिशियल फैशन एक छोटे परिवार के व्यवसाय के रूप में शुरू हुआ था, जिसके पास हर कोई छोड़ सके ऐसे सुंदर आभूषण बनाने के लिए जुनून था। वर्षों के दौरान, हम गुणवत्ता और शिल्पकला के लिए जाने जाने वाले एक विश्वसनीय ब्रांड में विकसित हुए हैं।

        हमारी यात्रा एक छोटे से कार्यशाला में शुरू हुई थी जहां हमारे संस्थापक, श्री सोनी, ने सस्ते लेकिन सुंदर आभूषण बनाने के लिए विभिन्न प्लेटिंग तकनीकों के साथ प्रयोग करना शुरू किया। आज, हमारे पास एक अत्याधुनिक विनिर्माण सुविधा है और कौशली कलाकारों की एक टीम है जो नवाचार जारी रखते हैं और शानदार टुकड़े बनाते हैं।

        हम अपनी विरासत पर गर्व करते हैं और पारंपरिक भारतीय आभूषण निर्माण तकनीकों को संरक्षित करने के लिए प्रतिबद्ध हैं जबकि गुणवत्ता और दक्षता को बढ़ाने के लिए आधुनिक प्रौद्योगिकी को अपनाते हैं।
      `
    }
  };

  const t = translations[language as 'en' | 'hi'];
  const contentLines = t.content.split('\n').filter(line => line.trim() !== '');
  const commitmentLines = t.commitmentContent.split('\n').filter(line => line.trim() !== '');
  const historyLines = t.historyContent.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 dark:text-amber-200 mb-6">
              {t.title}
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-12 border border-amber-100 dark:border-amber-900/50">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {contentLines.map((line, index) => (
                line.trim() === '' ? (
                  <br key={index} />
                ) : line.trim().startsWith('-') ? (
                  <li key={index} className="ml-6">{line.substring(1).trim()}</li>
                ) : (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">✨</span>
                {t.missionTitle}
              </h2>
              <p className="text-lg">
                {t.missionContent}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">🎯</span>
                {t.visionTitle}
              </h2>
              <p className="text-lg">
                {t.visionContent}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-12 border border-amber-100 dark:border-amber-900/50">
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-8 text-center">
              {t.valuesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.values.map((value, index) => (
                <div key={index} className="bg-amber-50 dark:bg-gray-700 rounded-xl p-6 border border-amber-200 dark:border-amber-900/50 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-amber-500 text-white rounded-full p-2 mr-4">
                      <span className="text-xl">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl shadow-xl p-6 md:p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="mr-3">💖</span>
              {t.commitmentTitle}
            </h2>
            <div className="prose prose-lg prose-invert max-w-none">
              {commitmentLines.map((line, index) => (
                line.trim() === '' ? (
                  <br key={index} />
                ) : line.trim().startsWith('-') ? (
                  <li key={index} className="ml-6">{line.substring(1).trim()}</li>
                ) : (
                  <p key={index} className="mb-4 text-lg">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-12 border border-amber-100 dark:border-amber-900/50">
            <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-200 mb-8 text-center">
              {t.historyTitle}
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {historyLines.map((line, index) => (
                line.trim() === '' ? (
                  <br key={index} />
                ) : line.trim().startsWith('-') ? (
                  <li key={index} className="ml-6">{line.substring(1).trim()}</li>
                ) : (
                  <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {line}
                  </p>
                )
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Choose Soni Artificial Fashion for Timeless Elegance' : 'शाश्वत सौंदर्य के लिए सोनी आर्टिफिशियल फैशन चुनें'}
            </h3>
            <p className="text-xl mb-6">
              {language === 'en' 
                ? 'Experience the perfect blend of style and affordability with Soni Artificial Fashion.' 
                : 'सोनी आर्टिफिशियल फैशन के साथ शैली और सस्ती कीमत के पूर्ण मिश्रण का अनुभव करें।'}
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-900 font-bold py-3 px-8 rounded-full hover:from-yellow-300 hover:to-amber-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              {language === 'en' ? 'Shop Our Collection' : 'हमारा संग्रह खरीदें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}