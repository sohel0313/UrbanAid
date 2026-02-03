import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ReportCard } from '@/components/dashboard/ReportCard';
import { MapPreview } from '@/components/MapPreview';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Clock, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { Report, ReportStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as ReportsService from '@/lib/services/reports';

export default function VolunteerDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const { userId, userName } = useAuth();
  const queryClient = useQueryClient();

  // Nearby unassigned reports (reports volunteers can claim)
  const { data: nearby = [], isLoading: isNearbyLoading } = useQuery({
    queryKey: ['nearbyReports', userId],
    queryFn: () => ReportsService.getNearbyReports(userId!),
    enabled: !!userId,
  });

  // Reports assigned to this volunteer (their tasks)
  const { data: myReports = [], isLoading: isMyLoading } = useQuery({
    queryKey: ['myReports', userId],
    queryFn: () => ReportsService.getMyReports(),
    enabled: !!userId,
  });

  // volunteer profile (to access skill & availability)
  const { data: volunteerProfile } = useQuery({
    queryKey: ['volunteerProfile', userId],
    queryFn: () => import('@/lib/services/volunteer').then(m => m.getMyProfile()),
    enabled: !!userId,
  });

  const nearbyReports = (nearby || []).map((r: any) => ReportsService.mapDtoToReport(r));
  const myMapped = (myReports || []).map((r: any) => ReportsService.mapDtoToReport(r));

  const visibleNearby = nearbyReports.filter(r => !claimedIds.includes(String(r.id)));

  const assignedCount = myMapped.filter((r) => r.status === 'assigned').length;
  const inProgressCount = myMapped.filter((r) => r.status === 'in-progress').length;
  const completedCount = myMapped.filter((r) => r.status === 'completed').length;

  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (report: any) => {
    if (!userId) return;
    setClaimingId(report.id);

    // Optimistically mark as claimed so it disappears from nearby list immediately
    setClaimedIds((s) => Array.from(new Set([...s, String(report.id)])));

    try {
      const resp = await ReportsService.claimReport(Number(report.id), Number(userId));

      // Add the freshly assigned report to 'myReports' cache immediately
      queryClient.setQueryData(['myReports', userId], (old: any) => {
        const list = old || [];
        // prepend the raw server response (so existing mapping logic will show it)
        return [resp, ...list];
      });

      toast({ title: 'Report claimed', description: 'You have been assigned this task' });

      // Ensure authoritative data is fetched (in case other fields changed)
      queryClient.invalidateQueries(['nearbyReports', userId]);
      queryClient.invalidateQueries(['myReports', userId]);
    } catch (err: any) {
      // Roll back optimistic hide by invalidating and removing id from claimedIds
      queryClient.invalidateQueries(['nearbyReports', userId]);
      queryClient.invalidateQueries(['myReports', userId]);
      setClaimedIds((s) => s.filter((id) => id !== String(report.id)));

      if (err?.status === 409) {
        toast({ title: 'Claim failed', description: 'Someone else claimed this report', variant: 'destructive' });
      } else {
        toast({ title: 'Claim failed', description: err?.message || 'Unable to claim report', variant: 'destructive' });
      }
    } finally {
      setClaimingId(null);
    }
  };

  function doesMatchSkill(reportCategory?: string) {
    if (!volunteerProfile || !volunteerProfile.skill || !reportCategory) return false;
    const skill = (volunteerProfile.skill as string).toLowerCase();
    const cat = (reportCategory as string).toLowerCase();
    return skill.includes(cat) || cat.includes(skill);
  }

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedReport || !userId) return;
    setUpdatingStatus(true);

    // map frontend status to backend enum names
    const mapToBackend = (s: ReportStatus | '') => {
      switch (s) {
        case 'in-progress':
          return 'IN_PROGRESS';
        case 'created':
          return 'CREATED';
        case 'assigned':
          return 'ASSIGNED';
        case 'completed':
          return 'COMPLETED';
        default:
          return s;
      }
    };

    try {
      await ReportsService.updateReportStatus(Number(selectedReport.id), mapToBackend(newStatus), Number(userId));
      toast({ title: 'Status updated', description: `Report status changed to ${newStatus}` });

      // refresh lists
      queryClient.invalidateQueries(['myReports', userId]);
      queryClient.invalidateQueries(['nearbyReports', userId]);

      setShowUpdateDialog(false);
      setNewStatus('');
      setStatusNote('');
    } catch (err: any) {
      toast({ title: 'Update failed', description: err?.message || 'Unable to update status', variant: 'destructive' });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: 'Message sent',
      description: 'Your message has been delivered to the citizen.',
    });
    setChatMessage('');
  };

  const openUpdateDialog = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setShowUpdateDialog(true);
  };

  const openChatDialog = (report: Report) => {
    setSelectedReport(report);
    setShowChatDialog(true);
  };

  return (
    <DashboardLayout userRole="volunteer" userName={userName ?? 'User'}> 
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned tasks and help the community</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard
            title="Assigned Tasks"
            value={assignedCount}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="In Progress"
            value={inProgressCount}
            icon={<Clock className="w-5 h-5" />}
            variant="warning"
          />
          <StatsCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* My Assigned Reports */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">My Tasks</h2>
          {myMapped.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No assigned tasks</h3>
              <p className="text-muted-foreground">
                You'll be notified when new tasks are assigned to you
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {myMapped.map((report) => (
                <div key={report.id} className="card-elevated p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <StatusBadge status={report.status} />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{report.description}</p>

                  <MapPreview address={report.location.address} className="h-32" />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => openChatDialog(report)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => openUpdateDialog(report)}
                      disabled={report.status === 'completed'}
                    >
                      Update Status
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/volunteer/reports/${report.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nearby (Claimable) Reports */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Nearby Tasks</h2>
          {visibleNearby.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No nearby tasks</h3>
              <p className="text-muted-foreground">
                There are no unassigned reports near you right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleNearby.map((report) => (
                <div key={report.id} className="card-elevated p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{report.title} {doesMatchSkill(report.category) && <span className="text-xs text-primary ml-2">Matches your skill</span>}</h3>
                      <StatusBadge status={report.status} />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{report.description}</p>

                  <MapPreview address={report.location.address} className="h-32" />

                  <div className="flex gap-2">
                    {report.status === 'created' ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleClaim(report)}
                        disabled={claimingId === report.id}
                      >
                        {claimingId === report.id ? 'Claiming...' : 'Claim'}
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground">Already claimed</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ReportStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Add a note about this update..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={!newStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat with {selectedReport?.citizenName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Chat messages placeholder */}
            <div className="h-64 bg-muted/50 rounded-lg p-4 overflow-y-auto space-y-3">
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg rounded-bl-none px-3 py-2 max-w-[80%]">
                  <p className="text-sm">Hi, thanks for taking on this issue!</p>
                  <span className="text-xs text-muted-foreground">10:30 AM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg rounded-br-none px-3 py-2 max-w-[80%]">
                  <p className="text-sm">Hello! I'll be there this afternoon to assess the situation.</p>
                  <span className="text-xs text-primary-foreground/70">10:32 AM</span>
                </div>
              </div>
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0 self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
