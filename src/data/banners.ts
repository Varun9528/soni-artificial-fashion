import { Banner } from './types';

export const banners: Banner[] = [
  {
    id: 'banner-1',
    title: {
      en: 'Handmade Bamboo Crafts',
      hi: 'हस्तनिर्मित बाँस शिल्प'
    },
    subtitle: {
      en: 'Eco-friendly traditional crafts from the heart of Madhya Pradesh',
      hi: 'मध्य प्रदेश के दिल से पर्यावरण अनुकूल पारंपरिक शिल्प'
    },
    image: '/images/hero/hero1.jpg',
    link: '/category/home-decor',
    active: true,
    order: 1
  },
  {
    id: 'banner-2',
    title: {
      en: 'Traditional Gond Paintings',
      hi: 'पारंपरिक गोंड चित्रकला'
    },
    subtitle: {
      en: 'Authentic tribal art telling stories of nature and mythology',
      hi: 'प्रकृति और पुराणों की कहानियां कहती प्रामाणिक जनजातीय कला'
    },
    image: '/images/hero/hero2.jpg',
    link: '/category/tribal-shirts',
    active: true,
    order: 2
  },
  {
    id: 'banner-3',
    title: {
      en: 'Authentic Tribal Jewelry',
      hi: 'प्रामाणिक जनजातीय आभूषण'
    },
    subtitle: {
      en: 'Handcrafted ornaments with cultural significance and beauty',
      hi: 'सांस्कृतिक महत्व और सुंदरता के साथ हस्तनिर्मित आभूषण'
    },
    image: '/images/hero/hero3.jpg',
    link: '/category/jewelry',
    active: true,
    order: 3
  },
  {
    id: 'banner-4',
    title: {
      en: 'Eco-friendly Cane Products',
      hi: 'पर्यावरण अनुकूल बेंत उत्पाद'
    },
    subtitle: {
      en: 'Sustainable lifestyle products made with traditional techniques',
      hi: 'पारंपरिक तकनीकों से बने टिकाऊ जीवनशैली उत्पाद'
    },
    image: '/images/hero/hero4.jpg',
    link: '/category/accessories',
    active: true,
    order: 4
  },
  {
    id: 'banner-5',
    title: {
      en: 'Handloom Sarees',
      hi: 'हैंडलूम साड़ियाँ'
    },
    subtitle: {
      en: 'Exquisite textiles woven with tradition and artistry',
      hi: 'परंपरा और कलात्मकता के साथ बुनी गई उत्कृष्ट वस्त्र'
    },
    image: '/images/hero/hero5.jpg',
    link: '/category/handloom-textiles',
    active: true,
    order: 5
  }
];