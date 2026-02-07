import { useState, useEffect } from 'react';
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
import { FileText, Clock, CheckCircle2, PlusCircle, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ReportsService from '@/lib/services/reports';
import { cn } from '@/lib/utils';

export default function CitizenDashboard() {
  const [showNewReport, setShowNewReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 📍 Geolocation State
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { toast } = useToast();
  const { userId, userName } = useAuth();
  const queryClient = useQueryClient();

  // 🔹 Fetch location whenever the "New Report" dialog is opened
  useEffect(() => {
    if (showNewReport) {
      handleGetLocation();
    } else {
      setCoords(null); // Clear coordinates when dialog closes
    }
  }, [showNewReport]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support location services.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        toast({ title: "Location Captured", description: "GPS coordinates linked to report." });
      },
      (error) => {
        setIsLocating(false);
        console.error("Location error:", error);
        toast({
          title: "Location Access Denied",
          description: "Please enable GPS to submit a report.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  // 🔹 Fetch reports
  const { data: userReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['myReports', userId],
    queryFn: () => ReportsService.getMyReports(),
    enabled: !!userId,
  });

  const displayReports = (userReports || []).map((r: any) =>
    ReportsService.mapDtoToReport(r)
  );

  const pendingCount = displayReports.filter((r: any) => r.status !== 'completed').length;
  const completedCount = displayReports.filter((r: any) => r.status === 'completed').length;

  // 🔹 Create report mutation
  const createMutation = useMutation({
    mutationFn: (payload: any) => ReportsService.createReport(payload, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries(['myReports', userId]);
      setShowNewReport(false);
      toast({ title: 'Report submitted successfully' });
    },
    onError: (err: any) => {
      toast({
        title: 'Error submitting report',
        description: err?.message || "Check backend connection.",
        variant: 'destructive',
      });
    },
  });

  const handleSubmitReport = (data: ReportFormData) => {
    if (!coords) {
      toast({ title: "Location Missing", description: "Wait for GPS to lock.", variant: "destructive" });
      return;
    }

    // 🎯 PAYLOAD MATCHING Report.java Entity
    const payload = {
      description: data.description,
      location: data.locationName || "Current", // Maps to 'location' string
      latitude: coords.lat,
      longitude: coords.lng,
      category: data.category, // Matches Category Enum
      status: 'PENDING',       // Matches Status Enum
      imagepath: data.imagePath || null, 
    };

    setIsSubmitting(true);
    createMutation.mutate(payload, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  return (
    <DashboardLayout userRole="citizen" userName={userName ?? 'User'}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Track your community impact</p>
          </div>
          <Button onClick={() => setShowNewReport(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" /> New Report
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard title="Total Reports" value={displayReports.length} icon={<FileText />} variant="primary" />
          <StatsCard title="Pending" value={pendingCount} icon={<Clock />} variant="warning" />
          <StatsCard title="Resolved" value={completedCount} icon={<CheckCircle2 />} variant="success" />
        </div>

        {/* Reports List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {reportsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Loading...</div>
          ) : displayReports.length === 0 ? (
            <div className="card-elevated p-8 text-center border-dashed border-2">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="mb-4">No issues reported yet.</p>
              <Button onClick={() => setShowNewReport(true)}>Report First Issue</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {displayReports.map((report: any) => (
                <ReportCard key={report.id} report={report} showActions onViewDetails={setSelectedReport} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🆕 New Report Dialog */}
      <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Community Report</DialogTitle>
          </DialogHeader>
          
          {/* 📍 GPS Feedback UI */}
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-sm mb-4 border transition-colors",
            coords ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          )}>
            <MapPin className={cn("w-4 h-4", isLocating && "animate-pulse")} />
            <div className="flex-1">
              {isLocating ? "Detecting location..." : 
               coords ? `GPS Ready: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 
               "Waiting for GPS signal..."}
            </div>
            {!isLocating && !coords && (
              <Button variant="ghost" size="sm" onClick={handleGetLocation} className="h-7 text-xs">Retry</Button>
            )}
          </div>

          <ReportForm onSubmit={handleSubmitReport} isLoading={isSubmitting || isLocating} />
        </DialogContent>
      </Dialog>

      {/* 📄 Details Dialog */}
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
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedReport.description}</p>
                </div>
                {selectedReport.latitude && (
                  <div>
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Location Data</p>
                    <p className="text-xs font-mono">LAT: {selectedReport.latitude}, LNG: {selectedReport.longitude}</p>
                  </div>
                )}
                {selectedReport.imageUrl && (
                  <img src={selectedReport.imageUrl} className="w-full rounded-lg object-cover max-h-60" alt="Incident" />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}