import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReportCard } from '@/components/dashboard/ReportCard';
import { ReportTimeline } from '@/components/dashboard/ReportTimeline';
import { ReportForm, ReportFormData } from '@/components/forms/ReportForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Clock, CheckCircle2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ReportsService from '@/lib/services/reports';

export default function CitizenDashboard() {
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { userId, userName } = useAuth();
  const queryClient = useQueryClient();

  // 🔹 Fetch reports
  const { data: userReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['myReports', userId],
    queryFn: () => ReportsService.getMyReports(),
    enabled: !!userId,
  });

  const displayReports = (userReports || []).map((r: any) =>
    ReportsService.mapDtoToReport(r)
  );

  const pendingCount = displayReports.filter(
    (r: any) => r.status !== 'completed'
  ).length;

  const completedCount = displayReports.filter(
    (r: any) => r.status === 'completed'
  ).length;

  // 🔹 Create report (lat/lng already included in payload)
  const createMutation = useMutation({
    mutationFn: (payload: ReportFormData) =>
      ReportsService.createReport(payload, userId!),

    onSuccess: () => {
      queryClient.invalidateQueries(['myReports', userId]);
      setShowNewReport(false);
      toast({
        title: 'Report submitted',
        description: 'Your issue has been reported successfully.',
      });
    },

    onError: (err: any) => {
      console.error('CreateReport error:', err);

      let msg = 'Failed to submit report';

      if (err?.message === 'Failed to fetch' || err instanceof TypeError) {
        msg =
          'Network error: backend not reachable. Please check if server is running.';
      } else if (err?.body?.message) {
        msg = err.body.message;
      } else if (err?.message) {
        msg = err.message;
      }

      toast({
        title: 'Error submitting report',
        description: msg,
      });
    },
  });

  const handleSubmitReport = (data: ReportFormData) => {
    setIsSubmitting(true);
    createMutation.mutate(data, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <DashboardLayout userRole="citizen" userName={userName ?? 'User'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage your reported issues
            </p>
          </div>
          <Button onClick={() => setShowNewReport(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Reports"
            value={displayReports.length}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="Pending"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            variant="warning"
          />
          <StatsCard
            title="Resolved"
            value={completedCount}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* Recent Reports */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Reports
          </h2>

          {reportsLoading ? (
            <p className="text-muted-foreground">Loading reports...</p>
          ) : displayReports.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                No reports yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by reporting an issue in your community
              </p>
              <Button onClick={() => setShowNewReport(true)}>
                Create Your First Report
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {displayReports.map((report: any) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  showActions
                  onViewDetails={setSelectedReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🆕 New Report Dialog */}
      <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report a New Issue</DialogTitle>
          </DialogHeader>
          <ReportForm
            onSubmit={handleSubmitReport}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* 📄 Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <ReportTimeline report={selectedReport} />

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-foreground">
                    {selectedReport.description}
                  </p>
                </div>

                {/* 📍 Latitude / Longitude */}
                {selectedReport.latitude && selectedReport.longitude && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Coordinates
                    </p>
                    <p className="text-foreground">
                      Lat: {selectedReport.latitude.toFixed(6)}, Lng:{' '}
                      {selectedReport.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                {selectedReport.volunteerName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Assigned Volunteer
                    </p>
                    <p className="text-foreground">
                      {selectedReport.volunteerName}
                    </p>
                  </div>
                )}

                {selectedReport.imageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Photo
                    </p>
                    <img
                      src={selectedReport.imageUrl}
                      alt={selectedReport.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
