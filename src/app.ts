import { Application } from 'pixi.js';
import { createInitialGameState } from './core/gameState';
import { getLocaleTable } from './content/localization';
import { mountPrototypeScene } from './ui/screens/prototypeScene';
import { createWebStorage } from './platform/web/storage';
import { loadGameState, saveGameState } from './platform/web/save';
import type { Locale } from './shared/types';

export async function bootstrapApp() {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('App root element not found');
  }

  const storage = createWebStorage('omnicorp');
  const preferredLocale = navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  const savedState = loadGameState(storage);
  const locale = (savedState?.locale ?? preferredLocale) as Locale;
  const state = savedState ?? createInitialGameState(locale);
  const table = getLocaleTable(state.locale);

  const app = new Application();
  await app.init({
    background: '#0b1020',
    resizeTo: window,
    antialias: true,
  });

  root.appendChild(app.canvas);

  mountPrototypeScene(app, state, table, (nextState) => {
    saveGameState(storage, nextState);
  });
}
