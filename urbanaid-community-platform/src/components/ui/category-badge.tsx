import { cn } from '@/lib/utils';
import { ReportCategory } from '@/types';
import { 
  AlertTriangle, 
  Lightbulb, 
  Trash2, 
  Paintbrush, 
  Droplets, 
  Volume2, 
  HelpCircle 
} from 'lucide-react';

interface CategoryBadgeProps {
  category: ReportCategory;
  className?: string;
  showIcon?: boolean;
}

const categoryConfig: Record<ReportCategory, { label: string; icon: React.ElementType; className: string }> = {
  'road-damage': {
    label: 'Road Damage',
    icon: AlertTriangle,
    className: 'bg-destructive/10 text-destructive',
  },
  streetlight: {
    label: 'Streetlight',
    icon: Lightbulb,
    className: 'bg-warning/10 text-warning',
  },
  garbage: {
    label: 'Garbage',
    icon: Trash2,
    className: 'bg-muted text-muted-foreground',
  },
  graffiti: {
    label: 'Graffiti',
    icon: Paintbrush,
    className: 'bg-primary/10 text-primary',
  },
  'water-leak': {
    label: 'Water Leak',
    icon: Droplets,
    className: 'bg-info/10 text-info',
  },
  noise: {
    label: 'Noise',
    icon: Volume2,
    className: 'bg-secondary text-secondary-foreground',
  },
  other: {
    label: 'Other',
    icon: HelpCircle,
    className: 'bg-muted text-muted-foreground',
  },
};

export function CategoryBadge({ category, className, showIcon = true }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium gap-1.5',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
