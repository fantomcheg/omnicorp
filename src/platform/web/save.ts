import type { GameState } from '../../core/gameState';
import type { StorageDriver } from './storage';

const SAVE_KEY = 'save-v1';

export function loadGameState(storage: StorageDriver): GameState | null {
  const raw = storage.getItem(SAVE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function saveGameState(storage: StorageDriver, state: GameState): void {
  storage.setItem(SAVE_KEY, JSON.stringify(state));
}

