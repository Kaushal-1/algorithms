
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeType = 'topic' | 'difficulty' | 'duration' | 'type';

interface CourseBadgeProps {
  label: string;
  type: BadgeType;
}

const CourseBadge: React.FC<CourseBadgeProps> = ({ label, type }) => {
  const getBadgeColor = (type: BadgeType) => {
    switch (type) {
      case 'topic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30';
      case 'difficulty':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30';
      case 'duration':
        return 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30';
      case 'type':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40 hover:bg-gray-500/30';
    }
  };

  return (
    <Badge 
      className={cn(
        "font-medium border text-xs py-0.5 px-2", 
        getBadgeColor(type)
      )}
      variant="outline"
    >
      {label}
    </Badge>
  );
};

export default CourseBadge;
