import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import type { QuestionnaireData } from './woundModels';

interface QuestionnaireFormProps {
  onDataChange: (data: QuestionnaireData) => void;
  onDisclaimerChange: (accepted: boolean) => void;
}

export default function QuestionnaireForm({
  onDataChange,
  onDisclaimerChange,
}: QuestionnaireFormProps) {
  const [data, setData] = useState<QuestionnaireData>({
    bodyLocation: '',
    size: '',
    appearance: '',
    bleedingLevel: '',
    painLevel: 5,
    timeSinceInjury: '',
    infectionSigns: [],
  });

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    const isComplete =
      data.bodyLocation &&
      data.size &&
      data.appearance &&
      data.bleedingLevel &&
      data.timeSinceInjury;
    if (isComplete) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  useEffect(() => {
    onDisclaimerChange(disclaimerAccepted);
  }, [disclaimerAccepted, onDisclaimerChange]);

  const handleInfectionSignToggle = (sign: string, checked: boolean) => {
    setData((prev) => ({
      ...prev,
      infectionSigns: checked
        ? [...prev.infectionSigns, sign]
        : prev.infectionSigns.filter((s) => s !== sign),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bodyLocation">Body Location *</Label>
        <Input
          id="bodyLocation"
          placeholder="e.g., Left forearm, Right knee"
          value={data.bodyLocation}
          onChange={(e) => setData({ ...data, bodyLocation: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Approximate Size *</Label>
        <Select value={data.size} onValueChange={(value) => setData({ ...data, size: value })}>
          <SelectTrigger id="size">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Small (< 1cm)">Small (&lt; 1cm)</SelectItem>
            <SelectItem value="Medium (1-3cm)">Medium (1-3cm)</SelectItem>
            <SelectItem value="Large (3-5cm)">Large (3-5cm)</SelectItem>
            <SelectItem value="Very Large (> 5cm)">Very Large (&gt; 5cm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appearance">Color/Appearance *</Label>
        <Select
          value={data.appearance}
          onValueChange={(value) => setData({ ...data, appearance: value })}
        >
          <SelectTrigger id="appearance">
            <SelectValue placeholder="Select appearance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pink/Red">Pink/Red</SelectItem>
            <SelectItem value="Dark Red/Purple">Dark Red/Purple</SelectItem>
            <SelectItem value="Yellow/White">Yellow/White</SelectItem>
            <SelectItem value="Black/Brown">Black/Brown</SelectItem>
            <SelectItem value="Mixed colors">Mixed colors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bleedingLevel">Bleeding Level *</Label>
        <Select
          value={data.bleedingLevel}
          onValueChange={(value) => setData({ ...data, bleedingLevel: value })}
        >
          <SelectTrigger id="bleedingLevel">
            <SelectValue placeholder="Select bleeding level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Minimal (stopped)">Minimal (stopped)</SelectItem>
            <SelectItem value="Moderate (controlled)">Moderate (controlled)</SelectItem>
            <SelectItem value="Heavy (uncontrolled)">Heavy (uncontrolled)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="painLevel">Pain Level: {data.painLevel}/10</Label>
        <Slider
          id="painLevel"
          min={0}
          max={10}
          step={1}
          value={[data.painLevel]}
          onValueChange={([value]) => setData({ ...data, painLevel: value })}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeSinceInjury">Time Since Injury *</Label>
        <Select
          value={data.timeSinceInjury}
          onValueChange={(value) => setData({ ...data, timeSinceInjury: value })}
        >
          <SelectTrigger id="timeSinceInjury">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Less than 1 hour">Less than 1 hour</SelectItem>
            <SelectItem value="1-6 hours">1-6 hours</SelectItem>
            <SelectItem value="6-24 hours">6-24 hours</SelectItem>
            <SelectItem value="1-3 days">1-3 days</SelectItem>
            <SelectItem value="More than 3 days">More than 3 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Signs of Infection (check all that apply)</Label>
        <Card>
          <CardContent className="pt-6 space-y-3">
            {['Warmth around wound', 'Swelling', 'Pus or discharge', 'Fever'].map((sign) => (
              <div key={sign} className="flex items-center space-x-2">
                <Checkbox
                  id={sign}
                  checked={data.infectionSigns.includes(sign)}
                  onCheckedChange={(checked) =>
                    handleInfectionSignToggle(sign, checked as boolean)
                  }
                />
                <Label htmlFor={sign} className="font-normal cursor-pointer">
                  {sign}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="disclaimer"
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
            />
            <Label htmlFor="disclaimer" className="font-normal cursor-pointer leading-relaxed">
              I understand this app provides informational tracking only and does not provide
              medical diagnosis or treatment advice. I will seek professional medical care when
              needed. *
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
