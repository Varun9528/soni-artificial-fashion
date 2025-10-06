// Performance optimization utilities
export class PerformanceService {
  // Cache management
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  // Set cache with TTL (time to live in milliseconds)
  setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get cache data if not expired
  getCache(key: string): any {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  // Clear expired cache entries
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
  }

  // Debounce function to limit how often a function can be called
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: any = null;
    
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  // Throttle function to limit how often a function can be called
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Lazy load images
  lazyLoadImages(): void {
    if (typeof window === 'undefined') return;
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }

  // Prefetch important resources
  prefetchResources(resources: string[]): void {
    if (typeof window === 'undefined') return;
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Measure component render time
  measureRenderTime(componentName: string, callback: () => void): void {
    if (typeof performance === 'undefined') {
      callback();
      return;
    }
    
    const start = performance.now();
    callback();
    const end = performance.now();
    
    console.log(`Render time for ${componentName}: ${end - start}ms`);
  }

  // Optimize API calls with caching and deduplication
  private pendingRequests: Map<string, Promise<any>> = new Map();
  
  async fetchWithCache(
    url: string,
    options: RequestInit = {},
    cacheTTL: number = 5 * 60 * 1000
  ): Promise<any> {
    // Check cache first
    const cached = this.getCache(url);
    if (cached) {
      return cached;
    }
    
    // Check if request is already pending
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url);
    }
    
    // Make new request
    const requestPromise = fetch(url, options)
      .then(response => response.json())
      .then(data => {
        // Cache the result
        this.setCache(url, data, cacheTTL);
        // Remove from pending requests
        this.pendingRequests.delete(url);
        return data;
      })
      .catch(error => {
        // Remove from pending requests on error
        this.pendingRequests.delete(url);
        throw error;
      });
    
    // Store pending request
    this.pendingRequests.set(url, requestPromise);
    
    return requestPromise;
  }

  // Batch API requests
  async batchRequests(requests: Array<{ url: string; options?: RequestInit }>): Promise<any[]> {
    // Group requests by domain to avoid overwhelming servers
    const groupedRequests: Record<string, Array<{ url: string; options?: RequestInit }>> = {};
    
    requests.forEach(request => {
      try {
        const url = new URL(request.url);
        const domain = url.origin;
        
        if (!groupedRequests[domain]) {
          groupedRequests[domain] = [];
        }
        
        groupedRequests[domain].push(request);
      } catch (e) {
        console.warn('Invalid URL in batch request:', request.url);
      }
    });
    
    // Process each group with a small delay between groups
    const results: any[] = [];
    
    for (const domain in groupedRequests) {
      const groupResults = await Promise.all(
        groupedRequests[domain].map(req => 
          fetch(req.url, req.options).then(res => res.json())
        )
      );
      
      results.push(...groupResults);
      
      // Small delay between domains to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Image optimization helper
  optimizeImageUrl(src: string, width?: number, height?: number, quality?: number): string {
    // In a real implementation, you would use a service like Cloudinary or Imgix
    // For now, we'll return the original URL with optimization parameters as query strings
    try {
      const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      if (quality) url.searchParams.set('q', quality.toString());
      
      return url.toString();
    } catch (e) {
      console.warn('Invalid URL for optimization:', src);
      return src;
    }
  }

  // Critical CSS inlining helper
  inlineCriticalCSS(css: string): void {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Resource hinting
  addResourceHints(): void {
    if (typeof document === 'undefined') return;
    
    // Preconnect to important third-party domains
    const preconnectDomains = [
      '//fonts.googleapis.com',
      '//fonts.gstatic.com'
    ];
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // Memory usage monitoring
  monitorMemoryUsage(): void {
    // Memory monitoring is browser-specific and may not be available
    if (typeof window === 'undefined') return;
    
    // Check if performance.memory is available (Chrome-specific)
    const win = window as any;
    if (win.performance && win.performance.memory) {
      const memory = win.performance.memory;
      console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`);
    }
  }

  // Long task monitoring
  monitorLongTasks(): void {
    if (typeof PerformanceObserver === 'undefined') return;
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) {
          console.warn(`Long task detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
}

// Singleton instance
export const performanceService = new PerformanceService();