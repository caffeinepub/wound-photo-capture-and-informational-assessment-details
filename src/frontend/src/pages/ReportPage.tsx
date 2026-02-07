import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Home, History } from 'lucide-react';
import { MedicalDisclaimer } from '../components/wound/Disclaimers';
import type { WoundReport } from '../components/wound/report/generateReport';
import { getReportData, clearReportData } from './NewWoundEntryPage';
import { useEffect, useState } from 'react';

export default function ReportPage() {
  const navigate = useNavigate();
  const [reportState, setReportState] = useState<{
    photo: File;
    questionnaireData: any;
    generatedReport: string;
  } | null>(null);

  useEffect(() => {
    const data = getReportData();
    if (data) {
      setReportState(data);
    }
    
    // Cleanup on unmount
    return () => {
      clearReportData();
    };
  }, []);

  if (!reportState?.generatedReport) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Report Available</AlertTitle>
          <AlertDescription>
            Please submit a wound entry first to view a report.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/' })}>
            <Home className="h-4 w-4 mr-2" />
            Go to New Entry
          </Button>
        </div>
      </div>
    );
  }

  const report: WoundReport = JSON.parse(reportState.generatedReport);
  const photoUrl = reportState.photo ? URL.createObjectURL(reportState.photo) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wound Assessment Report</h2>
        <p className="text-muted-foreground mt-2">
          Informational summary based on your provided details
        </p>
      </div>

      <Card className="border-accent">
        <CardContent className="pt-6">
          <MedicalDisclaimer />
        </CardContent>
      </Card>

      {report.hasHighRiskFlags && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Urgent: Seek Medical Attention</AlertTitle>
          <AlertDescription className="mt-2">
            {report.escalationAdvice}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {photoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={photoUrl}
                alt="Wound"
                className="w-full h-auto rounded-lg border border-border"
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Identified concerns based on your responses</CardDescription>
          </CardHeader>
          <CardContent>
            {report.riskFlags.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                No immediate risk flags identified
              </div>
            ) : (
              <div className="space-y-2">
                {report.riskFlags.map((flag, index) => (
                  <Badge key={index} variant="destructive" className="mr-2">
                    {flag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">{report.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Care Guidance</CardTitle>
          <CardDescription>Basic wound care information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">{report.careGuidance}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={() => navigate({ to: '/history' })}>
          <History className="h-4 w-4 mr-2" />
          View History
        </Button>
        <Button onClick={() => navigate({ to: '/' })}>
          <Home className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>
    </div>
  );
}
