// Declare process variable for TypeScript
declare const process: {
  env: {
    [key: string]: string | undefined;
    NEXT_PUBLIC_APP_URL?: string;
  };
};

// SEO helper functions
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
  siteName?: string;
}

export class SEOService {
  private defaultConfig: SEOConfig = {
    title: 'Lettex Ayurvedic Wellness Marketplace',
    description: 'Discover authentic Ayurvedic and organic wellness products from Lettex. Support traditional knowledge and buy unique natural remedies.',
    keywords: ['Ayurvedic products', 'organic wellness', 'natural remedies', 'herbal powders', 'organic honey', 'handmade soap'],
    image: '/images/og-image.jpg',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lettex Ayurvedic Wellness'
  };

  // Generate meta tags for a page
  generateMetaTags(config: Partial<SEOConfig> = {}): Record<string, string> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    return {
      title: mergedConfig.title,
      description: mergedConfig.description,
      keywords: mergedConfig.keywords?.join(', ') || this.defaultConfig.keywords?.join(', ') || '',
      'og:title': mergedConfig.title,
      'og:description': mergedConfig.description,
      'og:image': mergedConfig.image || this.defaultConfig.image || '',
      'og:url': mergedConfig.url || this.defaultConfig.url || '',
      'og:type': mergedConfig.type || this.defaultConfig.type || 'website',
      'og:locale': mergedConfig.locale || this.defaultConfig.locale || 'en_US',
      'og:site_name': mergedConfig.siteName || this.defaultConfig.siteName || 'Lettex Ayurvedic Wellness',
      'twitter:card': 'summary_large_image',
      'twitter:title': mergedConfig.title,
      'twitter:description': mergedConfig.description,
      'twitter:image': mergedConfig.image || this.defaultConfig.image || '',
    };
  }

  // Generate JSON-LD structured data
  generateJSONLD(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  // Generate organization schema
  generateOrganizationSchema(): any {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': 'Lettex Ayurvedic Wellness Marketplace',
      'url': baseUrl,
      'logo': `${baseUrl}/logo.jpg`,
      'description': 'Authentic Ayurvedic and organic wellness products from Lettex',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Mumbai',
        'addressRegion': 'Maharashtra',
        'addressCountry': 'IN'
      },
      'sameAs': [
        // Social media links would go here
      ]
    };
  }

  // Generate product schema
  generateProductSchema(product: any): any {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.title?.en || product.name || '',
      'image': product.images?.map((img: string) => `${baseUrl}${img}`) || [],
      'description': product.description?.en || product.shortDescription || '',
      'sku': product.sku || '',
      'brand': {
        '@type': 'Brand',
        'name': 'Lettex Ayurvedic Wellness'
      },
      'offers': {
        '@type': 'Offer',
        'url': `${baseUrl}/product/${product.slug || ''}`,
        'priceCurrency': 'INR',
        'price': product.price || 0,
        'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Lettex Ayurvedic Wellness Marketplace'
        }
      },
      'review': product.reviews?.map((review: any) => ({
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': review.rating || 0,
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': review.user?.name || 'Anonymous'
        },
        'reviewBody': review.comment || ''
      })) || []
    };
  }

  // Generate breadcrumb schema
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): any {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `${baseUrl}${crumb.url}`
      }))
    };
  }

  // Generate article schema
  generateArticleSchema(article: any): any {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title || '',
      'description': article.description || '',
      'image': article.image ? `${baseUrl}${article.image}` : undefined,
      'author': {
        '@type': 'Person',
        'name': article.author?.name || 'Lettex Wellness Team'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Lettex Ayurvedic Wellness Marketplace',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.jpg`
        }
      },
      'datePublished': article.publishedAt || '',
      'dateModified': article.updatedAt || ''
    };
  }

  // Optimize images for SEO
  optimizeImage(src: string, alt: string, width?: number, height?: number): string {
    // In a real implementation, you would use a service like Cloudinary or Next.js Image component
    // For now, we'll return a basic img tag with SEO attributes
    const attributes = [
      `src="${src}"`,
      `alt="${alt}"`,
      width ? `width="${width}"` : '',
      height ? `height="${height}"` : '',
      'loading="lazy"',
      'decoding="async"'
    ].filter(Boolean).join(' ');
    
    return `<img ${attributes} />`;
  }

  // Generate canonical URL
  generateCanonicalUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    return `${baseUrl}${path}`;
  }

  // Generate hreflang tags for multilingual support
  generateHreflangTags(availableLanguages: string[], currentPath: string): Array<{ href: string; hreflang: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
    
    return availableLanguages.map(lang => ({
      href: `${baseUrl}/${lang}${currentPath}`,
      hreflang: lang
    }));
  }
}

// Singleton instance
export const seoService = new SEOService();

export const getDefaultMetadata = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
  
  return {
    title: {
      default: process.env.NEXT_PUBLIC_APP_NAME || 'Lettex Ayurvedic Wellness Marketplace',
      template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Lettex'}`
    },
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover authentic Ayurvedic and organic wellness products from Lettex',
    keywords: ['Ayurvedic products', 'organic wellness', 'natural remedies', 'herbal powders', 'organic honey', 'handmade soap'],
    authors: [{ name: 'Lettex' }],
    creator: 'Lettex',
    publisher: 'Lettex',
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title: process.env.NEXT_PUBLIC_APP_NAME || 'Lettex Ayurvedic Wellness Marketplace',
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover authentic Ayurvedic and organic wellness products from Lettex',
      url: baseUrl,
      siteName: process.env.NEXT_PUBLIC_APP_NAME || 'Lettex',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: process.env.NEXT_PUBLIC_APP_NAME || 'Lettex Ayurvedic Wellness Marketplace'
        }
      ],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: process.env.NEXT_PUBLIC_APP_NAME || 'Lettex Ayurvedic Wellness Marketplace',
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Discover authentic Ayurvedic and organic wellness products from Lettex',
      images: [`${baseUrl}/images/og-image.jpg`],
      creator: '@lettexwellness'
    },
    alternates: {
      canonical: baseUrl
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION
    }
  };
};

export const getProductMetadata = (product: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
  
  return {
    title: `${product.title_en} | Lettex`,
    description: product.description_en.substring(0, 160),
    openGraph: {
      title: `${product.title_en} | Lettex`,
      description: product.description_en.substring(0, 160),
      url: `${baseUrl}/product/${product.slug}`,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.title_en
        }
      ],
      type: 'product'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title_en} | Lettex`,
      description: product.description_en.substring(0, 160),
      images: [product.images[0]]
    }
  };
};

export const getCategoryMetadata = (category: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lettex-marketplace.com';
  
  return {
    title: `${category.name.en} | Lettex`,
    description: category.description.en.substring(0, 160),
    openGraph: {
      title: `${category.name.en} | Lettex`,
      description: category.description.en.substring(0, 160),
      url: `${baseUrl}/category/${category.slug}`,
      images: [
        {
          url: category.image,
          width: 800,
          height: 600,
          alt: category.name.en
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name.en} | Lettex`,
      description: category.description.en.substring(0, 160),
      images: [category.image]
    }
  };
};
