import { useState, useEffect } from 'react';
import { useCamera } from '../../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Upload, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { validateImageFile } from './photoUtils';
import { toast } from 'sonner';

interface PhotoInputProps {
  photo: File | null;
  onPhotoChange: (photo: File | null) => void;
}

export default function PhotoInput({ photo, onPhotoChange }: PhotoInputProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    currentFacingMode,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
  });

  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPreviewUrl(url);
      setMode('preview');
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
      setMode('select');
    }
  }, [photo]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    onPhotoChange(file);
  };

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (success) {
      setMode('camera');
    }
  };

  const handleCapture = async () => {
    const capturedFile = await capturePhoto();
    if (capturedFile) {
      onPhotoChange(capturedFile);
      await stopCamera();
    }
  };

  const handleClear = async () => {
    onPhotoChange(null);
    if (isActive) {
      await stopCamera();
    }
    setMode('select');
  };

  const handleRetake = async () => {
    onPhotoChange(null);
    setMode('select');
  };

  if (mode === 'preview' && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          <img src={previewUrl} alt="Wound preview" className="w-full h-full object-contain" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRetake} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Change Photo
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'camera') {
    return (
      <div className="space-y-4">
        {cameraError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>{cameraError.message}</AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCapture}
            disabled={!isActive || isLoading}
            className="flex-1"
            size="lg"
          >
            <Camera className="h-4 w-4 mr-2" />
            Capture Photo
          </Button>
          {isSupported && (
            <Button
              variant="outline"
              onClick={() => switchCamera()}
              disabled={!isActive || isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={async () => {
            await stopCamera();
            setMode('select');
          }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isSupported !== false && (
          <Button
            variant="outline"
            onClick={handleStartCamera}
            disabled={isLoading}
            className="h-32 flex-col gap-2"
          >
            <Camera className="h-8 w-8" />
            <span>Use Camera</span>
          </Button>
        )}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="h-32 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors">
            <Upload className="h-8 w-8" />
            <span>Upload Image</span>
          </div>
        </label>
      </div>

      {isSupported === false && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Camera Not Available</AlertTitle>
          <AlertDescription>
            Camera is not supported on this device. Please upload an image instead.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
