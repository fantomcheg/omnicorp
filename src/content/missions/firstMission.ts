import type { TrainingMission } from '../../shared/types';

export const firstMission = {
  id: 'mission_http_intro',
  mode: 'training',
  titleKey: 'mission.first.title',
  descriptionKey: 'mission.first.description',
  objectiveKey: 'mission.first.objective',
  nearTerminalKey: 'mission.first.near_terminal',
  terminalLockedKey: 'mission.first.terminal_locked',
  choicesPromptKey: 'mission.first.choose_header',
  wrongAnswerKey: 'mission.first.wrong',
  completedKey: 'mission.first.completed',
  remediationKey: 'mission.first.remediation',
  completedReportKey: 'mission.first.report_completed',
  choices: [
    {
      id: 'content_type',
      answerToken: 'answer:1',
      labelKey: 'mission.first.choice.content_type',
    },
    {
      id: 'set_cookie',
      answerToken: 'answer:2',
      labelKey: 'mission.first.choice.set_cookie',
    },
    {
      id: 'debug_token',
      answerToken: 'answer:3',
      labelKey: 'mission.first.choice.debug_token',
    },
    {
      id: 'cache_control',
      answerToken: 'answer:4',
      labelKey: 'mission.first.choice.cache_control',
    },
  ],
  correctChoiceId: 'debug_token',
} satisfies TrainingMission;
