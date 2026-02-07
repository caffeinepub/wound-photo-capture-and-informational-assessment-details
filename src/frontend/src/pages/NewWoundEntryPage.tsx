import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import PhotoInput from '../components/wound/PhotoInput';
import QuestionnaireForm from '../components/wound/QuestionnaireForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAddWoundEntry } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { fileToUint8Array } from '../components/wound/photoUtils';
import { generateReport } from '../components/wound/report/generateReport';
import type { QuestionnaireData } from '../components/wound/woundModels';
import { serializeQuestionnaire } from '../components/wound/woundModels';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { MedicalDisclaimer, PrivacyNotice } from '../components/wound/Disclaimers';

// Store for passing data to report page
let reportData: {
  photo: File;
  questionnaireData: QuestionnaireData;
  generatedReport: string;
} | null = null;

export function getReportData() {
  return reportData;
}

export function clearReportData() {
  reportData = null;
}

export default function NewWoundEntryPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const navigate = useNavigate();
  const addWoundEntry = useAddWoundEntry();

  const handleSubmit = async () => {
    if (!photo || !questionnaireData || !disclaimerAccepted) {
      toast.error('Please complete all required fields and accept the disclaimer');
      return;
    }

    try {
      const photoBytes = await fileToUint8Array(photo);
      // Cast to the expected type
      const typedArray = new Uint8Array(photoBytes.buffer) as Uint8Array<ArrayBuffer>;
      const externalBlob = ExternalBlob.fromBytes(typedArray).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const questionnaireResponses = serializeQuestionnaire(questionnaireData);
      const generatedReport = generateReport(questionnaireData);

      await addWoundEntry.mutateAsync({
        photo: externalBlob,
        contentType: photo.type,
        questionnaireResponses,
        generatedReport,
      });

      toast.success('Wound entry saved successfully');
      
      // Store data for report page
      reportData = {
        photo,
        questionnaireData,
        generatedReport,
      };
      
      // Navigate to report page
      navigate({ to: '/report' });
    } catch (error) {
      console.error('Failed to save wound entry:', error);
      toast.error('Failed to save wound entry. Please try again.');
    }
  };

  const isSubmitting = addWoundEntry.isPending;
  const canSubmit = photo && questionnaireData && disclaimerAccepted && !isSubmitting;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Wound Entry</h2>
        <p className="text-muted-foreground mt-2">
          Document a wound with a photo and details for informational tracking
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photo</CardTitle>
          <CardDescription>
            Capture or upload a clear photo of the wound
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoInput photo={photo} onPhotoChange={setPhoto} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wound Details</CardTitle>
          <CardDescription>
            Provide information about the wound for tracking purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionnaireForm
            onDataChange={setQuestionnaireData}
            onDisclaimerChange={setDisclaimerAccepted}
          />
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardContent className="pt-6 space-y-4">
          <MedicalDisclaimer />
          <PrivacyNotice />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setPhoto(null);
            setQuestionnaireData(null);
            setDisclaimerAccepted(false);
          }}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
            </>
          ) : (
            'Save Entry'
          )}
        </Button>
      </div>
    </div>
  );
}
