import { Artisan } from './types';

export const artisans: Artisan[] = [
  {
    id: 'sarla-bai',
    slug: 'sarla-bai',
    name: 'Sarla Bai',
    village: 'Madhya Pradesh',
    bio: {
      en: 'Sarla Bai is a master craftswoman specializing in traditional Gond paintings and bamboo crafts with over 25 years of experience.',
      hi: 'सरला बाई 25 वर्षों के अनुभव के साथ पारंपरिक गोंड चित्रकला और बांस शिल्प में विशेषज्ञ हैं।'
    },
    photo: '/images/artisans/arti-sarla.jpg',
    specialization: ['Gond Paintings', 'Bamboo Crafts', 'Traditional Art'],
    experience: 25,
    totalProducts: 42,
    rating: 4.8,
    verified: true
  },
  {
    id: 'ramesh-uikey',
    slug: 'ramesh-uikey',
    name: 'Ramesh Uikey',
    village: 'Madhya Pradesh',
    bio: {
      en: 'Ramesh Uikey is a skilled artisan known for his exceptional work in terracotta and dokra art with 18 years of experience.',
      hi: 'रमेश उइके 18 वर्षों के अनुभव के साथ टेराकोटा और डोकरा कला में असाधारण काम के लिए जाने जाते हैं।'
    },
    photo: '/images/artisans/arti-ramesh.jpg',
    specialization: ['Terracotta', 'Dokra Art', 'Metal Crafts'],
    experience: 18,
    totalProducts: 36,
    rating: 4.7,
    verified: true
  },
  {
    id: 'meera-gond',
    slug: 'meera-gond',
    name: 'Meera Gond',
    village: 'Madhya Pradesh',
    bio: {
      en: 'Meera Gond is a textile artist specializing in handloom weaving and traditional embroidery with 20 years of experience.',
      hi: 'मीरा गोंड 20 वर्षों के अनुभव के साथ हैंडलूम बुनाई और पारंपरिक कढ़ाई में विशेषज्ञ हैं।'
    },
    photo: '/images/artisans/arti-meera.jpg',
    specialization: ['Handloom Weaving', 'Traditional Embroidery', 'Textile Art'],
    experience: 20,
    totalProducts: 58,
    rating: 4.9,
    verified: true
  },
  {
    id: 'rajesh-kumar',
    slug: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    village: 'Madhya Pradesh',
    bio: {
      en: 'Rajesh is a master woodcarver with 20 years of experience in traditional woodworking.',
      hi: 'राजेश पारंपरिक लकड़ीकारी में 20 वर्षों के अनुभव के साथ एक मास्टर लकड़ीकार हैं।'
    },
    photo: '/images/artisans/arti-raj.jpg',
    specialization: ['Wood Carving', 'Sculpture', 'Traditional Crafts'],
    experience: 20,
    totalProducts: 35,
    rating: 4.8,
    verified: true
  }
];