'use client';

import { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onError?: () => void;
  fallback?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  sizes,
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  onError,
  fallback = '/images/products/placeholder.jpg'
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageSrc = imageError ? fallback : src;
  
  // Check if the image is an SVG to disable optimization
  const isSvg = imageSrc?.endsWith('.svg') || imageSrc?.includes('.svg?');
  const unoptimized = isSvg;

  // Generate sizes attribute if not provided
  const defaultSizes = sizes || (
    fill 
      ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
      : undefined
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={defaultSizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={unoptimized}
        style={{
          objectFit: 'cover',
        }}
      />
      
      {imageError && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <span className="text-2xl mb-2 block">🖼️</span>
            <span className="text-xs">{alt}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate blur data URL
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document?.createElement?.('canvas');
  if (!canvas) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

// Predefined blur data URLs for common use cases
export const BLUR_DATA_URLS = {
  product: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+',
  banner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwMCIgeT0iMTAwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4=',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjRTVFN0VCIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9IjgwIiByeD0iMjUiIHJ5PSIyMCIgZmlsbD0iI0U1RTdFQiIvPgo8L3N2Zz4='
};