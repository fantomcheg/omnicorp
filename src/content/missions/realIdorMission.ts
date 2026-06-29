import type { TrainingMission } from '../../shared/types';

export const realIdorMission = {
  id: 'mission_real_idor_profile',
  mode: 'real',
  proofType: 'flag',
  titleKey: 'mission.real_idor.title',
  descriptionKey: 'mission.real_idor.description',
  objectiveKey: 'mission.real_idor.objective',
  nearTerminalKey: 'mission.real_idor.near_terminal',
  terminalLockedKey: 'mission.real_idor.terminal_locked',
  choicesPromptKey: 'mission.real_idor.proof_prompt',
  wrongAnswerKey: 'mission.real_idor.wrong',
  completedKey: 'mission.real_idor.completed',
  remediationKey: 'mission.real_idor.remediation',
  completedReportKey: 'mission.real_idor.report_completed',
  choices: [],
  correctChoiceId: '',
  serviceUrl: 'http://localhost:3001/profile?id=1001',
  proofPromptKey: 'mission.real_idor.proof_prompt',
  expectedProof: 'OMNI-IDOR-1002',
} satisfies TrainingMission;

