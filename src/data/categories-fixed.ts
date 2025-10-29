import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: {
      en: 'Jewelry',
      hi: 'आभूषण'
    },
    description: {
      en: 'Beautiful artificial jewelry crafted with precision and elegance.',
      hi: 'परिशुद्धता और सौंदर्य के साथ निर्मित सुंदर कृत्रिम आभूषण।'
    },
    image: '/images/categories/jewelry.jpg',
    productCount: 15
  },
  {
    id: 'necklaces',
    slug: 'necklaces',
    name: {
      en: 'Necklaces',
      hi: 'हार'
    },
    description: {
      en: 'Elegant necklaces for every occasion.',
      hi: 'प्रत्येक अवसर के लिए सुरुचिपूर्ण हार।'
    },
    image: '/images/categories/necklaces.jpg',
    productCount: 8
  },
  {
    id: 'earrings',
    slug: 'earrings',
    name: {
      en: 'Earrings',
      hi: 'कान के आभूषण'
    },
    description: {
      en: 'Stylish earrings to complement your look.',
      hi: 'आपके स्वरूप को पूरा करने के लिए फैशनेबल कान के आभूषण।'
    },
    image: '/images/categories/earrings.jpg',
    productCount: 12
  },
  {
    id: 'bracelets',
    slug: 'bracelets',
    name: {
      en: 'Bracelets',
      hi: 'कंघाइयाँ'
    },
    description: {
      en: 'Chic bracelets for a fashionable touch.',
      hi: 'फैशनेबल स्पर्श के लिए चिक कंघाइयाँ।'
    },
    image: '/images/categories/bracelets.jpg',
    productCount: 7
  },
  {
    id: 'rings',
    slug: 'rings',
    name: {
      en: 'Rings',
      hi: 'अंगूठियाँ'
    },
    description: {
      en: 'Beautiful rings to adorn your fingers.',
      hi: 'आपकी अंगुलियों को सजाने के लिए सुंदर अंगूठियाँ।'
    },
    image: '/images/categories/rings.jpg',
    productCount: 9
  }
];