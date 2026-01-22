import { Report, ReportStatus } from '@/types';
import { Check, Clock, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportTimelineProps {
  report: Report;
}

const timelineSteps: { status: ReportStatus; label: string; icon: React.ElementType }[] = [
  { status: 'created', label: 'Created', icon: AlertCircle },
  { status: 'assigned', label: 'Assigned', icon: User },
  { status: 'in-progress', label: 'In Progress', icon: Clock },
  { status: 'completed', label: 'Completed', icon: Check },
];

const statusOrder: ReportStatus[] = ['created', 'assigned', 'in-progress', 'completed'];

export function ReportTimeline({ report }: ReportTimelineProps) {
  const currentIndex = statusOrder.indexOf(report.status);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  isCompleted
                    ? isCurrent
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-success border-success text-success-foreground'
                    : 'bg-background border-border text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connecting line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-0">
        <div
          className="h-full bg-success transition-all duration-500"
          style={{ width: `${(currentIndex / (timelineSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
