import type { TrainingMission } from '../../shared/types';

export const secondMission = {
  id: 'mission_cookie_flags',
  mode: 'training',
  proofType: 'choice',
  titleKey: 'mission.second.title',
  descriptionKey: 'mission.second.description',
  objectiveKey: 'mission.second.objective',
  nearTerminalKey: 'mission.second.near_terminal',
  terminalLockedKey: 'mission.second.terminal_locked',
  choicesPromptKey: 'mission.second.choose_cookie',
  wrongAnswerKey: 'mission.second.wrong',
  completedKey: 'mission.second.completed',
  remediationKey: 'mission.second.remediation',
  completedReportKey: 'mission.second.report_completed',
  choices: [
    {
      id: 'plain_session',
      answerToken: 'answer:1',
      labelKey: 'mission.second.choice.plain_session',
    },
    {
      id: 'httponly_session',
      answerToken: 'answer:2',
      labelKey: 'mission.second.choice.httponly_session',
    },
    {
      id: 'secure_session',
      answerToken: 'answer:3',
      labelKey: 'mission.second.choice.secure_session',
    },
    {
      id: 'theme_cookie',
      answerToken: 'answer:4',
      labelKey: 'mission.second.choice.theme_cookie',
    },
  ],
  correctChoiceId: 'secure_session',
} satisfies TrainingMission;
