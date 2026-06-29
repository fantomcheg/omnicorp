import type { GameState } from './gameState';

export function completeMission(state: GameState, missionId: string): GameState {
  if (state.completedMissions.includes(missionId)) {
    return state;
  }

  return {
    ...state,
    activeMissionId: null,
    completedMissions: [...state.completedMissions, missionId],
  };
}

