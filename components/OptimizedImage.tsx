"use client";

import { useState } from 'react';

interface OptimizedImageProps {
  src: string | { src: string; height: number; width: number };
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  width,
  height 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Create blur placeholder
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: 'cover'
          }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={typeof src === 'string' ? src : src.src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          ${className}
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
};
