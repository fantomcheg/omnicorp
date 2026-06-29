export type Locale = 'en' | 'ru';

export type TranslationTable = Record<string, string>;

export type MissionMode = 'training' | 'real';

export interface MissionChoice {
  id: string;
  answerToken: `answer:${1 | 2 | 3 | 4}`;
  labelKey: string;
}

export interface TrainingMission {
  id: string;
  mode: MissionMode;
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
