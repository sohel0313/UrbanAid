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
import { mockReports } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function CitizenDashboard() {
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filter reports for current user (demo: user id '1')
  const userReports = mockReports.filter((r) => r.citizenId === '1');
  const pendingCount = userReports.filter((r) => r.status !== 'completed').length;
  const completedCount = userReports.filter((r) => r.status === 'completed').length;

  const handleSubmitReport = (data: ReportFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNewReport(false);
      toast({
        title: 'Report submitted',
        description: 'Your issue has been reported successfully.',
      });
    }, 1500);
  };

  return (
    <DashboardLayout userRole="citizen" userName="John Citizen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your reported issues</p>
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
            value={userReports.length}
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
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h2>
          {userReports.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by reporting an issue in your community
              </p>
              <Button onClick={() => setShowNewReport(true)}>Create Your First Report</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userReports.map((report) => (
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

      {/* New Report Dialog */}
      <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report a New Issue</DialogTitle>
          </DialogHeader>
          <ReportForm onSubmit={handleSubmitReport} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <ReportTimeline report={selectedReport} />
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-foreground">{selectedReport.description}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                  <p className="text-foreground">{selectedReport.location.address}</p>
                </div>
                
                {selectedReport.volunteerName && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Assigned Volunteer</p>
                    <p className="text-foreground">{selectedReport.volunteerName}</p>
                  </div>
                )}
                
                {selectedReport.imageUrl && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Photo</p>
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
