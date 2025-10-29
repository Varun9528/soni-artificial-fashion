import { Category } from './types';

export const collections: Category[] = [
  {
    id: 'cat-006',
    slug: 'cat-006',
    name: {
      en: 'Men Collection',
      hi: 'पुरुष संग्रह'
    },
    description: {
      en: 'Elegant jewelry collection designed exclusively for men.',
      hi: 'पुरुषों के लिए विशेष रूप से डिज़ाइन किया गया सुरुचिपूर्ण आभूषण संग्रह।'
    },
    image: '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
    productCount: 0 // Will be updated dynamically
  },
  {
    id: 'cat-007',
    slug: 'cat-007',
    name: {
      en: 'Women Collection',
      hi: 'महिला संग्रह'
    },
    description: {
      en: 'Exquisite jewelry collection crafted for the modern woman.',
      hi: 'आधुनिक महिला के लिए तैयार किया गया शानदार आभूषण संग्रह।'
    },
    image: '/images/women collection/Golden_Radiance_Portrait.png',
    productCount: 0 // Will be updated dynamically
  }
];