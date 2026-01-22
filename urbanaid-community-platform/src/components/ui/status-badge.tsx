import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig: Record<ReportStatus, { label: string; className: string }> = {
  created: {
    label: 'Created',
    className: 'bg-secondary text-secondary-foreground',
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-info/10 text-info border border-info/20',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-warning/10 text-warning border border-warning/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success border border-success/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'created' && 'bg-muted-foreground',
          status === 'assigned' && 'bg-info',
          status === 'in-progress' && 'bg-warning animate-pulse-soft',
          status === 'completed' && 'bg-success'
        )}
      />
      {config.label}
    </span>
  );
}
