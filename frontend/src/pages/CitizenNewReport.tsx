import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportForm, ReportFormData } from '@/components/forms/ReportForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import * as ReportsService from '@/lib/services/reports';

export default function CitizenNewReport() {
  const { userId, userName } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ReportFormData) => {
    if (!userId) {
      toast({ title: 'Not signed in', description: 'Please sign in to create a report.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await ReportsService.createReport(data, userId);
      toast({ title: 'Report submitted', description: 'Your report has been created.' });
      navigate('/citizen/reports');
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to submit report' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout userRole="citizen" userName={userName ?? 'User'}>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Report a New Issue</h1>
        <p className="text-muted-foreground mb-6">Provide details and optionally attach a photo</p>
        <ReportForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </DashboardLayout>
  );
}
