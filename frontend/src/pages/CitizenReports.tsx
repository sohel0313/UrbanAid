import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportCard } from '@/components/dashboard/ReportCard';
import { useQuery } from '@tanstack/react-query';
import * as ReportsService from '@/lib/services/reports';
import { useAuth } from '@/hooks/useAuth';

export default function CitizenReports() {
  const { userId, userName } = useAuth();
  const navigate = useNavigate();

  const { data: userReports = [], isLoading } = useQuery({
    queryKey: ['myReports'],
    queryFn: () => ReportsService.getMyReports(),
    enabled: !!userId,
  });

  const displayReports = (userReports || []).map((r: any) => ReportsService.mapDtoToReport(r));

  return (
    <DashboardLayout userRole="citizen" userName={userName ?? 'User'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Reports</h1>
            <p className="text-muted-foreground">All issues you've reported</p>
          </div>
          <Button onClick={() => navigate('/citizen/new-report')}>Create New Report</Button>
        </div>

        {displayReports.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">Create a new report to get help from volunteers</p>
            <Button onClick={() => navigate('/citizen/new-report')}>Report an Issue</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {displayReports.map((report) => (
              <ReportCard key={report.id} report={report} showActions />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
