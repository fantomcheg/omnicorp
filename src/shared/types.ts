export type Locale = 'en' | 'ru';

export type TranslationTable = Record<string, string>;

export interface MissionChoice {
  id: string;
  answerToken: `answer:${1 | 2 | 3 | 4}`;
  labelKey: string;
}

export interface TrainingMission {
  id: string;
  titleKey: string;
  descriptionKey: string;
  objectiveKey: string;
  nearTerminalKey: string;
  terminalLockedKey: string;
  choicesPromptKey: string;
  wrongAnswerKey: string;
  completedKey: string;
  remediationKey: string;
  completedReportKey: string;
  choices: MissionChoice[];
  correctChoiceId: string;
}
