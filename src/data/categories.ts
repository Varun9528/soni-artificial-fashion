import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'grocery-products',
    slug: 'grocery-products',
    name: {
      en: 'Grocery Products',
      hi: 'किराने की वस्तुएं'
    },
    description: {
      en: 'Explore fresh staples, grains, pulses, and spices — handpicked for your kitchen.',
      hi: 'ताजा अनाज, दालें और मसाले खोजें — आपके रसोई के लिए चुने गए'
    },
    image: '/images/categories/grocery.jpg',
    productCount: 24
  },
  {
    id: 'refined-oil',
    slug: 'refined-oil',
    name: {
      en: 'Refined Oil',
      hi: 'शोधित तेल'
    },
    description: {
      en: 'Healthy, refined oils for cooking, frying, and everyday use — sunflower, mustard, and groundnut oils.',
      hi: 'पकाने, तलने और दैनिक उपयोग के लिए स्वस्थ, शोधित तेल — सूरजमुखी, सरसों और मूंगफली के तेल।'
    },
    image: '/images/categories/oil.jpg',
    productCount: 18
  },
  {
    id: 'milk-products',
    slug: 'milk-products',
    name: {
      en: 'Milk Products',
      hi: 'दूध के उत्पाद'
    },
    description: {
      en: 'Fresh milk, curd, butter, paneer, and ghee — sourced directly from local dairies.',
      hi: 'ताजा दूध, दही, मक्खन, पनीर और घी — सीधे स्थानीय डेयरी से प्राप्त।'
    },
    image: '/images/categories/milk.jpg',
    productCount: 32
  },
  {
    id: 'own-products',
    slug: 'own-products',
    name: {
      en: 'Own Products',
      hi: 'अपने उत्पाद'
    },
    description: {
      en: 'Exclusive Lettex-branded items — quality you can rely on, crafted with care.',
      hi: 'विशेष लेटेक्स-ब्रांडेड वस्तुएं — गुणवत्ता जिस पर आप भरोसा कर सकते हैं, सावधानीपूर्वक बनाई गई।'
    },
    image: '/images/categories/own.jpg',
    productCount: 28
  },
  {
    id: 'beverages',
    slug: 'beverages',
    name: {
      en: 'Beverages',
      hi: 'पेय'
    },
    description: {
      en: 'Juices, tea, coffee, and refreshing drinks from trusted brands.',
      hi: 'विश्वसनीय ब्रांडों से रस, चाय, कॉफी और ताजगी भरे पेय।'
    },
    image: '/images/categories/beverages.jpg',
    productCount: 21
  },
  {
    id: 'snacks-biscuits',
    slug: 'snacks-biscuits',
    name: {
      en: 'Snacks & Biscuits',
      hi: 'नाश्ता और बिस्कुट'
    },
    description: {
      en: 'Delicious snacks, chips, and biscuits perfect for every craving.',
      hi: 'स्वादिष्ट नाश्ता, चिप्स और बिस्कुट प्रत्येक भूख के लिए उपयुक्त।'
    },
    image: '/images/categories/snacks.jpg',
    productCount: 25
  },
  {
    id: 'household-essentials',
    slug: 'household-essentials',
    name: {
      en: 'Household Essentials',
      hi: 'गृह आवश्यक वस्तुएं'
    },
    description: {
      en: 'Detergents, cleaners, and kitchen basics for your daily needs.',
      hi: 'आपकी दैनिक आवश्यकताओं के लिए डिटर्जेंट, सफाईकर्ता और रसोई की मूल वस्तुएं।'
    },
    image: '/images/categories/household.jpg',
    productCount: 30
  }
];