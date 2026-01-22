import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { CategoryBadge } from '@/components/ui/category-badge';
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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Users, CheckCircle2, Clock, UserPlus, Eye } from 'lucide-react';
import { mockReports, mockAnalytics } from '@/data/mockData';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MapPreview } from '@/components/MapPreview';

const volunteers = [
  { id: '2', name: 'Sarah Volunteer' },
  { id: '3', name: 'Mike Helper' },
  { id: '4', name: 'Emily Worker' },
];

export default function AdminDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleAssignVolunteer = () => {
    if (!selectedVolunteer) return;
    
    const volunteer = volunteers.find((v) => v.id === selectedVolunteer);
    toast({
      title: 'Volunteer assigned',
      description: `${volunteer?.name} has been assigned to the report.`,
    });
    setShowAssignDialog(false);
    setSelectedVolunteer('');
  };

  const openAssignDialog = (report: Report) => {
    setSelectedReport(report);
    setShowAssignDialog(true);
  };

  const openDetailsDialog = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsDialog(true);
  };

  return (
    <DashboardLayout userRole="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage city operations</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Reports"
            value={mockAnalytics.totalReports}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Volunteers"
            value={mockAnalytics.activeVolunteers}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Resolved Issues"
            value={mockAnalytics.resolvedIssues}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Pending Reports"
            value={mockAnalytics.pendingReports}
            icon={<Clock className="w-5 h-5" />}
            variant="warning"
          />
        </div>

        {/* Reports Table */}
        <div className="card-elevated">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">All Reports</h2>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{report.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {report.location.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={report.category} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {report.citizenName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(report.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetailsDialog(report)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!report.volunteerId && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openAssignDialog(report)}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Assign Volunteer Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Volunteer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground">{selectedReport?.title}</p>
              <p className="text-sm text-muted-foreground">{selectedReport?.location.address}</p>
            </div>

            <div className="space-y-2">
              <Label>Select Volunteer</Label>
              <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a volunteer" />
                </SelectTrigger>
                <SelectContent>
                  {volunteers.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignVolunteer} disabled={!selectedVolunteer}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <CategoryBadge category={selectedReport.category} />
                <StatusBadge status={selectedReport.status} />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-foreground">{selectedReport.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                <MapPreview address={selectedReport.location.address} className="h-40" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Reported By</p>
                  <p className="text-foreground">{selectedReport.citizenName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Assigned To</p>
                  <p className="text-foreground">
                    {selectedReport.volunteerName || 'Not assigned'}
                  </p>
                </div>
              </div>

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
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
