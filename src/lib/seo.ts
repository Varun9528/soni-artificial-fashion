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
    title: 'Pachmarhi Tribal Art Marketplace',
    description: 'Discover authentic tribal art and handicrafts from Pachmarhi. Support local artisans and buy unique handmade products.',
    keywords: ['tribal art', 'handicrafts', 'Pachmarhi', 'artisans', 'handmade', 'traditional crafts'],
    image: '/images/og-image.jpg',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'Pachmarhi Tribal Art'
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
      'og:site_name': mergedConfig.siteName || this.defaultConfig.siteName || 'Pachmarhi Tribal Art',
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': 'Pachmarhi Tribal Art Marketplace',
      'url': baseUrl,
      'logo': `${baseUrl}/logo.jpg`,
      'description': 'Authentic tribal art and handicrafts from Pachmarhi',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Pachmarhi',
        'addressRegion': 'Madhya Pradesh',
        'addressCountry': 'IN'
      },
      'sameAs': [
        // Social media links would go here
      ]
    };
  }

  // Generate product schema
  generateProductSchema(product: any): any {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.title?.en || product.name || '',
      'image': product.images?.map((img: string) => `${baseUrl}${img}`) || [],
      'description': product.description?.en || product.shortDescription || '',
      'sku': product.sku || '',
      'brand': {
        '@type': 'Brand',
        'name': 'Pachmarhi Tribal Art'
      },
      'offers': {
        '@type': 'Offer',
        'url': `${baseUrl}/product/${product.slug || ''}`,
        'priceCurrency': 'INR',
        'price': product.price || 0,
        'availability': product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Pachmarhi Tribal Art Marketplace'
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title || '',
      'description': article.description || '',
      'image': article.image ? `${baseUrl}${article.image}` : undefined,
      'author': {
        '@type': 'Person',
        'name': article.author?.name || 'Pachmarhi Tribal Art Team'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Pachmarhi Tribal Art Marketplace',
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    return `${baseUrl}${path}`;
  }

  // Generate hreflang tags for multilingual support
  generateHreflangTags(availableLanguages: string[], currentPath: string): Array<{ href: string; hreflang: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pachmarhi-marketplace.com';
    
    return availableLanguages.map(lang => ({
      href: `${baseUrl}/${lang}${currentPath}`,
      hreflang: lang
    }));
  }
}

// Singleton instance
export const seoService = new SEOService();