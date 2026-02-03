import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import * as ReportsService from '@/lib/services/reports';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function VolunteerMessages() {
  const { userId, userName } = useAuth();
  const { toast } = useToast();
  const { data: myReports = [], isLoading } = useQuery({
    queryKey: ['myReports', userId],
    queryFn: () => ReportsService.getMyReports(),
    enabled: !!userId,
  });

  const reports: Report[] = (myReports || []).map((r: any) => ReportsService.mapDtoToReport(r));
  const assignedReports = reports.filter((r) => r.status === 'assigned' || r.volunteerId === String(userId));

  const [selectedReport, setSelectedReport] = useState<Report | null>(assignedReports[0] ?? null);
  const [messages, setMessages] = useState<Array<{ id: string; author: string; text: string; time: Date }>>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    // Initialize messages for the selected report using its description as the initial citizen message
    if (!selectedReport) {
      setMessages([]);
      return;
    }

    const initial = [
      {
        id: `c-${selectedReport.id}`,
        author: selectedReport.citizenName ?? 'Citizen',
        text: selectedReport.description ?? 'Hello, please help with this issue',
        time: selectedReport.createdAt ?? new Date(),
      },
      {
        id: `v-${selectedReport.id}`,
        author: userName ?? 'You',
        text: 'Thanks — I will check this out and update you shortly.',
        time: new Date(+new Date() + 1000 * 60 * 10),
      },
    ];

    setMessages(initial);
  }, [selectedReport, userName]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedReport) return;

    const msg = { id: `m-${Date.now()}`, author: userName ?? 'You', text: newMsg.trim(), time: new Date() };
    setMessages((s) => [...s, msg]);
    setNewMsg('');

    // optimistic UI — show toast. Backend comment endpoint not yet implemented.
    toast({ title: 'Message sent', description: 'Your message was delivered.' });
  };

  return (
    <DashboardLayout userRole="volunteer" userName={userName ?? 'Volunteer'}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-4">Conversations</h2>

          {assignedReports.length === 0 ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">No conversations yet. Assigned reports with citizen messages will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedReports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`w-full text-left p-3 rounded-lg border ${selectedReport?.id === r.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <div className="font-medium text-foreground">{r.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{r.location.address}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">{selectedReport ? `Conversation — ${selectedReport.title}` : 'Select a conversation'}</h2>

          {!selectedReport ? (
            <div className="card-elevated p-6 text-center">
              <p className="text-muted-foreground">Choose an assigned report to view messages and chat with the citizen.</p>
            </div>
          ) : (
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/50 rounded-lg">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[70%] p-3 rounded-lg ${m.author === (userName ?? 'You') ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <div className="text-sm">{m.text}</div>
                    <div className="text-xs text-muted-foreground mt-1">{m.author} • {m.time.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Label>Type a message</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Write a message to the citizen..." />
                  <Button onClick={handleSend}>Send</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This chat is currently simulated on the client. Backend comment/chat endpoints can be wired later.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
