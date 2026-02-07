import { useNavigate, useParams } from '@tanstack/react-router';
import { useWoundHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { deserializeQuestionnaire } from '../components/wound/woundModels';
import type { WoundReport } from '../components/wound/report/generateReport';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

export default function HistoryDetailPage() {
  const navigate = useNavigate();
  const { entryId } = useParams({ from: '/history/$entryId' });
  const { data: history, isLoading } = useWoundHistory();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const entryIndex = parseInt(entryId);
  const entry = history?.[entryIndex];

  useEffect(() => {
    if (entry?.photo) {
      const url = entry.photo.getDirectURL();
      setImageUrl(url);
    }
  }, [entry]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Entry Not Found</AlertTitle>
          <AlertDescription>The requested wound entry could not be found.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate({ to: '/history' })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  const questionnaire = deserializeQuestionnaire(entry.questionnaireResponses);
  const report: WoundReport = JSON.parse(entry.generatedReport);
  const date = new Date(Number(entry.timestamp) / 1000000);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/history' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wound Entry Details</h2>
          <p className="text-muted-foreground mt-1">
            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {report.hasHighRiskFlags && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>High Risk Flags Identified</AlertTitle>
          <AlertDescription>{report.escalationAdvice}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Wound"
                className="w-full h-auto rounded-lg border border-border"
              />
            ) : (
              <Skeleton className="w-full aspect-video" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wound Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Location:</span> {questionnaire.bodyLocation}
            </div>
            <div>
              <span className="font-medium">Size:</span> {questionnaire.size}
            </div>
            <div>
              <span className="font-medium">Appearance:</span> {questionnaire.appearance}
            </div>
            <div>
              <span className="font-medium">Bleeding:</span> {questionnaire.bleedingLevel}
            </div>
            <div>
              <span className="font-medium">Pain Level:</span> {questionnaire.painLevel}/10
            </div>
            <div>
              <span className="font-medium">Time Since Injury:</span>{' '}
              {questionnaire.timeSinceInjury}
            </div>
            {questionnaire.infectionSigns.length > 0 && (
              <div>
                <span className="font-medium">Infection Signs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {questionnaire.infectionSigns.map((sign) => (
                    <Badge key={sign} variant="outline">
                      {sign}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {report.riskFlags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No immediate risk flags identified</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {report.riskFlags.map((flag, index) => (
                <Badge key={index} variant="destructive">
                  {flag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
          <CardTitle>Care Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">{report.careGuidance}</p>
        </CardContent>
      </Card>
    </div>
  );
}
