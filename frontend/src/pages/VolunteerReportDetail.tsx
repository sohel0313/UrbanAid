import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import * as ReportsService from '@/lib/services/reports';
import { useToast } from '@/hooks/use-toast';

export default function VolunteerReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!id || id === '{}' || id === '%7B%7D') {
        toast({ title: 'Invalid report', description: 'Invalid report id in URL' });
        setLoading(false);
        return;
      }

      const rid = Number(id);
      if (isNaN(rid)) {
        toast({ title: 'Invalid report', description: 'Report id is not a number' });
        setLoading(false);
        return;
      }

      try {
        const resp = await ReportsService.getReportById(rid);
        setReport(resp);
      } catch (e: any) {
        toast({ title: 'Load failed', description: e?.message || 'Unable to load report', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <DashboardLayout userRole="volunteer" userName={''}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report Details</h1>
          <p className="text-muted-foreground">View full details about the report</p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : report ? (
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
            <p className="text-sm">Status: {report.status}</p>
            <p className="text-sm">Location: {report.location?.address}</p>

            <div className="mt-4 flex gap-2">
              <Button onClick={() => navigate('/volunteer')}>Back</Button>
            </div>
          </div>
        ) : (
          <div className="card-elevated p-6 text-center">
            <p className="text-muted-foreground">No report found for this id</p>
            <div className="mt-4">
              <Button onClick={() => navigate('/volunteer')}>Back to dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}