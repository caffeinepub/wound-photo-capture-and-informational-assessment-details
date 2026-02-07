import { useNavigate } from '@tanstack/react-router';
import { useWoundHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Clock, MapPin } from 'lucide-react';
import { deserializeQuestionnaire } from '../components/wound/woundModels';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { data: history, isLoading, error } = useWoundHistory();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Wound History</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Error Loading History</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load wound history'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="py-12">
          <img
            src="/assets/generated/hero-illustration.dim_1600x900.png"
            alt="No entries yet"
            className="mx-auto max-w-md w-full h-auto opacity-60"
          />
          <h2 className="text-2xl font-bold tracking-tight mt-8">No Wound Entries Yet</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Start documenting wounds by creating your first entry. Your history will appear here.
          </p>
          <Button onClick={() => navigate({ to: '/' })} className="mt-6" size="lg">
            <Camera className="h-4 w-4 mr-2" />
            Create First Entry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wound History</h2>
          <p className="text-muted-foreground mt-2">
            {history.length} {history.length === 1 ? 'entry' : 'entries'} recorded
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/' })}>
          <Camera className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((entry, index) => {
          const questionnaire = deserializeQuestionnaire(entry.questionnaireResponses);
          const date = new Date(Number(entry.timestamp) / 1000000);

          return (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate({ to: `/history/${index}` })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      Wound Entry - {questionnaire.bodyLocation}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {questionnaire.bodyLocation}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  Size: {questionnaire.size} • Pain: {questionnaire.painLevel}/10 • Time since
                  injury: {questionnaire.timeSinceInjury}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
