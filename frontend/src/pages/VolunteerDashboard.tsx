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
import { mockReports } from '@/data/mockData';
import { Report, ReportStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function VolunteerDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const { toast } = useToast();

  // Filter reports assigned to this volunteer (demo: volunteer id '2')
  const assignedReports = mockReports.filter((r) => r.volunteerId === '2');
  const inProgressCount = assignedReports.filter((r) => r.status === 'in-progress').length;
  const completedCount = assignedReports.filter((r) => r.status === 'completed').length;

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    
    toast({
      title: 'Status updated',
      description: `Report status changed to ${newStatus}`,
    });
    setShowUpdateDialog(false);
    setNewStatus('');
    setStatusNote('');
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
    <DashboardLayout userRole="volunteer" userName="Sarah Volunteer">
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
            value={assignedReports.length}
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

        {/* Assigned Reports */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Assigned Tasks</h2>
          {assignedReports.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No assigned tasks</h3>
              <p className="text-muted-foreground">
                You'll be notified when new tasks are assigned to you
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {assignedReports.map((report) => (
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
