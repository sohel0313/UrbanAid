import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatsCard({ title, value, icon, trend, className, variant = 'default' }: StatsCardProps) {
  return (
    <div
      className={cn(
        'card-elevated p-6 flex items-start justify-between',
        variantStyles[variant],
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className={cn('text-sm font-medium', trend.isPositive ? 'text-success' : 'text-destructive')}>
            {trend.isPositive ? '+' : ''}{trend.value}%
            <span className="text-muted-foreground ml-1">from last month</span>
          </p>
        )}
      </div>
      <div className={cn('p-3 rounded-xl', iconVariantStyles[variant])}>
        {icon}
      </div>
    </div>
  );
}
