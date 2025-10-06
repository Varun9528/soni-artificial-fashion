import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'wooden-carvings',
    slug: 'wooden-carvings',
    name: {
      en: 'Wooden Carvings',
      hi: 'लकड़ी की कार्विंग'
    },
    description: {
      en: 'Intricate wooden carvings crafted by skilled artisans',
      hi: 'कुशल कारीगरों द्वारा बनाई गई जटिल लकड़ी की कार्विंग'
    },
    image: '/images/categories/cat-wooden-carvings.jpg',
    productCount: 24
  },
  {
    id: 'tribal-paintings',
    slug: 'tribal-paintings',
    name: {
      en: 'Tribal Paintings',
      hi: 'जनजातीय चित्रकला'
    },
    description: {
      en: 'Traditional tribal paintings with cultural significance',
      hi: 'सांस्कृतिक महत्व के साथ पारंपरिक जनजातीय चित्रकला'
    },
    image: '/images/categories/cat-tribal-paintings.jpg',
    productCount: 18
  },
  {
    id: 'handwoven-textiles',
    slug: 'handwoven-textiles',
    name: {
      en: 'Handwoven Textiles',
      hi: 'हाथ से बुने वस्त्र'
    },
    description: {
      en: 'Traditional handwoven fabrics and textiles',
      hi: 'पारंपरिक हाथ से बुने कपड़े और वस्त्र'
    },
    image: '/images/categories/cat-handwoven-textiles.jpg',
    productCount: 32
  },
  {
    id: 'jewelry-accessories',
    slug: 'jewelry-accessories',
    name: {
      en: 'Jewelry & Accessories',
      hi: 'आभूषण और सामान'
    },
    description: {
      en: 'Handcrafted jewelry and lifestyle accessories',
      hi: 'हस्तनिर्मित आभूषण और जीवनशैली सामान'
    },
    image: '/images/categories/cat-jewelry-accessories.jpg',
    productCount: 28
  },
  {
    id: 'home-decor',
    slug: 'home-decor',
    name: {
      en: 'Home Decor',
      hi: 'घर की सजावट'
    },
    description: {
      en: 'Artistic home decoration items with tribal aesthetics',
      hi: 'जनजातीय सौंदर्यशास्त्र के साथ कलात्मक घर सजावट की वस्तुएं'
    },
    image: '/images/categories/cat-home-decor.jpg',
    productCount: 21
  }
];