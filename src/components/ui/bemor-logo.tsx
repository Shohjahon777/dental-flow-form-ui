
import React from 'react';
import { cn } from '@/lib/utils';

interface BemorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'text' | 'svg';
}

export const BemorLogo: React.FC<BemorLogoProps> = ({ 
  className, 
  size = 'md',
  variant = 'text'
}) => {
  const sizeClasses = {
    sm: variant === 'svg' ? 'w-8 h-8' : 'text-lg',
    md: variant === 'svg' ? 'w-12 h-12' : 'text-2xl',
    lg: variant === 'svg' ? 'w-16 h-16' : 'text-4xl'
  };

  if (variant === 'svg') {
    return (
      <div className={cn("flex items-center", className)}>
        <svg 
          className={cn(sizeClasses[size])} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Medical cross background */}
          <circle cx="50" cy="50" r="45" fill="url(#gradient1)" stroke="url(#gradient2)" strokeWidth="2"/>
          
          {/* Dental tooth symbol */}
          <path 
            d="M35 25 C35 20, 40 15, 50 15 C60 15, 65 20, 65 25 L65 35 C65 45, 60 55, 50 65 C40 55, 35 45, 35 35 Z" 
            fill="white" 
            stroke="url(#gradient2)" 
            strokeWidth="1.5"
          />
          
          {/* Modern geometric accent */}
          <path 
            d="M45 30 L55 30 L55 40 L45 40 Z" 
            fill="url(#gradient3)" 
            opacity="0.8"
          />
          
          {/* Tech accent dots */}
          <circle cx="30" cy="30" r="2" fill="url(#gradient3)"/>
          <circle cx="70" cy="30" r="2" fill="url(#gradient3)"/>
          <circle cx="30" cy="70" r="2" fill="url(#gradient3)"/>
          <circle cx="70" cy="70" r="2" fill="url(#gradient3)"/>
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488"/>
              <stop offset="50%" stopColor="#14b8a6"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9"/>
              <stop offset="100%" stopColor="#0d9488"/>
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0fdfa"/>
              <stop offset="100%" stopColor="#e6fffa"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="ml-2">
          <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg">
            bemor
          </span>
          <span className="text-gray-600 ml-1 text-sm font-normal">
            portal
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("font-bold tracking-tight", sizeClasses[size], className)}>
      <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
        bemor
      </span>
      <span className="text-gray-600 ml-1 text-sm font-normal">
        portal
      </span>
    </div>
  );
};
