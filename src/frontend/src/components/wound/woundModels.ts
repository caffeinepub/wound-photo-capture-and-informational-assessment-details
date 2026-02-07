export interface QuestionnaireData {
  bodyLocation: string;
  size: string;
  appearance: string;
  bleedingLevel: string;
  painLevel: number;
  timeSinceInjury: string;
  infectionSigns: string[];
}

export function serializeQuestionnaire(data: QuestionnaireData): string {
  return JSON.stringify(data);
}

export function deserializeQuestionnaire(json: string): QuestionnaireData {
  return JSON.parse(json);
}
