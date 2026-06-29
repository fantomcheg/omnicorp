import type { GameState } from '../gameState';
import { firstMission } from '../../content/missions/firstMission';

export function isFirstMissionCompleted(state: GameState): boolean {
  return state.completedMissions.includes(firstMission.id);
}

export function completeFirstMission(state: GameState): GameState {
  if (isFirstMissionCompleted(state)) {
    return state;
  }

  return {
    ...state,
    activeMissionId: null,
    completedMissions: [...state.completedMissions, firstMission.id],
  };
}

