
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerificationBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  size = 'md',
  className
}) => {
  const sizeClasses = {
    'sm': 'h-4 w-4',
    'md': 'h-5 w-5',
    'lg': 'h-6 w-6',
  };
  
  const iconSizes = {
    'sm': 10,
    'md': 12,
    'lg': 14,
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className={cn(
              "rounded-full bg-blue-600 flex items-center justify-center text-white",
              sizeClasses[size],
              className
            )}
          >
            <Check size={iconSizes[size]} strokeWidth={3} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified Writer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
