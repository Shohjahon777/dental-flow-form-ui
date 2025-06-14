
import React from 'react';
import { cn } from '@/lib/utils';

interface BemorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BemorLogo: React.FC<BemorLogoProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

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
