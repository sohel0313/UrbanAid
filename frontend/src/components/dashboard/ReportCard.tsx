import { Report } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
import { MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportCardProps {
  report: Report;
  showActions?: boolean;
  onViewDetails?: (report: Report) => void;
  onUpdateStatus?: (report: Report) => void;
  className?: string;
}

export function ReportCard({ report, showActions = false, onViewDetails, onUpdateStatus, className }: ReportCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('card-interactive p-4 sm:p-5 space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{report.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={report.category} />
            <StatusBadge status={report.status} />
          </div>
        </div>
        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {report.description}
      </p>

      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span className="truncate max-w-[150px]">{report.location.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(report.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          <span>{report.citizenName}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(report)}
          >
            View Details
          </Button>
          {report.status !== 'completed' && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus?.(report)}
            >
              Update Status
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
