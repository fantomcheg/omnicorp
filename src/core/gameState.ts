import type { Locale } from '../shared/types';

export interface GameState {
  locale: Locale;
  activeMissionId: string | null;
  completedMissions: string[];
}

export function createInitialGameState(locale: Locale): GameState {
  return {
    locale,
    activeMissionId: 'mission_http_intro',
    completedMissions: [],
  };
}

