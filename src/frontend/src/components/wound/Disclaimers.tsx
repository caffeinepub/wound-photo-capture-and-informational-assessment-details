import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Medical Disclaimer</AlertTitle>
      <AlertDescription className="text-sm leading-relaxed">
        This application provides informational tracking only and does not diagnose, treat, or
        provide medical advice. The information generated is based solely on your input and should
        not replace professional medical evaluation. Always seek the advice of a qualified
        healthcare provider for any medical concerns.
      </AlertDescription>
    </Alert>
  );
}

export function PrivacyNotice() {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Privacy & Storage Notice</AlertTitle>
      <AlertDescription className="text-sm leading-relaxed">
        Photos and information you submit are stored securely via blockchain-based storage and
        associated with your identity. Avoid uploading images containing personally identifying
        information if you prefer not to have them stored. You can view your stored entries in the
        History section.
      </AlertDescription>
    </Alert>
  );
}
