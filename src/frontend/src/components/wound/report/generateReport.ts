import type { QuestionnaireData } from '../woundModels';

export interface WoundReport {
  summary: string;
  riskFlags: string[];
  careGuidance: string;
  hasHighRiskFlags: boolean;
  escalationAdvice: string;
}

export function generateReport(data: QuestionnaireData): string {
  const riskFlags: string[] = [];
  let hasHighRiskFlags = false;

  // Check for high-risk conditions
  if (data.bleedingLevel === 'Heavy (uncontrolled)') {
    riskFlags.push('Uncontrolled bleeding');
    hasHighRiskFlags = true;
  }

  if (data.painLevel >= 8) {
    riskFlags.push('Severe pain');
    hasHighRiskFlags = true;
  }

  if (data.infectionSigns.includes('Fever')) {
    riskFlags.push('Fever present');
    hasHighRiskFlags = true;
  }

  if (data.infectionSigns.includes('Pus or discharge')) {
    riskFlags.push('Pus or discharge');
  }

  if (data.infectionSigns.length >= 2) {
    riskFlags.push('Multiple infection signs');
    hasHighRiskFlags = true;
  }

  if (data.size === 'Very Large (> 5cm)') {
    riskFlags.push('Large wound size');
  }

  // Generate summary
  const summary = `Wound located on ${data.bodyLocation}, approximately ${data.size.toLowerCase()} in size. 
Appearance: ${data.appearance}. 
Bleeding level: ${data.bleedingLevel}. 
Pain level reported as ${data.painLevel} out of 10.
Time since injury: ${data.timeSinceInjury}.
${data.infectionSigns.length > 0 ? `Infection signs noted: ${data.infectionSigns.join(', ')}.` : 'No infection signs reported.'}`;

  // Generate care guidance
  let careGuidance = `General wound care recommendations:

• Keep the wound clean and dry
• Wash hands before touching the wound
• Change dressings regularly as directed
• Monitor for changes in appearance, pain, or discharge
• Avoid picking at scabs or crusts
• Protect the wound from further injury

`;

  if (hasHighRiskFlags) {
    careGuidance += `⚠️ IMPORTANT: Based on your responses, this wound requires immediate medical attention.`;
  } else if (riskFlags.length > 0) {
    careGuidance += `Note: Some concerning signs were identified. Consider consulting a healthcare provider if symptoms worsen.`;
  } else {
    careGuidance += `Continue monitoring the wound. Seek medical care if you notice increasing pain, redness, swelling, discharge, or fever.`;
  }

  const escalationAdvice = hasHighRiskFlags
    ? 'Seek immediate medical attention. Visit an emergency room or urgent care facility as soon as possible. Do not delay treatment.'
    : '';

  const report: WoundReport = {
    summary: summary.trim(),
    riskFlags,
    careGuidance: careGuidance.trim(),
    hasHighRiskFlags,
    escalationAdvice,
  };

  return JSON.stringify(report);
}
