import { Application, Container, Graphics } from 'pixi.js';
import type { GameState } from '../../core/gameState';
import { completeFirstMission, isFirstMissionCompleted } from '../../core/missions/firstMissionLogic';
import { firstMission } from '../../content/missions/firstMission';
import { getInputTokens, isDirectionPressed, isGameInput, type KeyHandler } from '../../platform/web/input';
import { getCenter, isNear } from '../../shared/geometry';
import type { TranslationTable } from '../../shared/types';
import { createText } from '../pixiText';

function text(table: TranslationTable, key: string): string {
  return table[key] ?? key;
}

export function mountPrototypeScene(
  app: Application,
  state: GameState,
  table: TranslationTable,
  onStateChange: (nextState: GameState) => void,
): () => void {
  let currentState = state;
  let terminalOpen = false;
  const scene = new Container();
  app.stage.addChild(scene);

  const background = new Graphics()
    .rect(0, 0, 320, 180)
    .fill({ color: 0x17213a });
  background.position.set(40, 40);
  scene.addChild(background);

  const player = new Graphics()
    .rect(0, 0, 28, 28)
    .fill({ color: 0x8fd3ff });
  player.position.set(120, 110);
  scene.addChild(player);

  const terminal = new Graphics()
    .roundRect(0, 0, 42, 34, 4)
    .fill({ color: 0x203d2b })
    .stroke({ color: 0x8df0a4, width: 2 });
  terminal.position.set(285, 112);
  scene.addChild(terminal);

  const terminalScreen = new Graphics()
    .rect(0, 0, 24, 10)
    .fill({ color: 0x8df0a4 });
  terminalScreen.position.set(294, 120);
  scene.addChild(terminalScreen);

  const panelX = 400;
  const panelY = 40;
  const panelPadding = 18;
  const panelTextWidth = 250;

  const missionConsole = new Graphics()
    .roundRect(0, 0, 290, 300, 8)
    .fill({ color: 0x0f1628 });
  missionConsole.position.set(panelX, panelY);
  scene.addChild(missionConsole);

  const title = createText({
    text: text(table, 'app.title'),
    fill: '#f4f7fb',
    fontSize: 22,
    fontWeight: '700',
    wordWrapWidth: panelTextWidth,
  });
  title.position.set(panelX + panelPadding, panelY + panelPadding);
  scene.addChild(title);

  const subtitle = createText({
    text: text(table, 'app.subtitle'),
    fill: '#9fb0d0',
    fontSize: 13,
    wordWrapWidth: panelTextWidth,
  });
  subtitle.position.set(panelX + panelPadding, panelY + 48);
  scene.addChild(subtitle);

  const missionLabel = createText({
    text: `${text(table, 'app.mission_label')}: ${text(table, firstMission.titleKey)}`,
    fill: '#f4f7fb',
    fontSize: 16,
    fontWeight: '600',
    wordWrapWidth: panelTextWidth,
  });
  missionLabel.position.set(panelX + panelPadding, panelY + 82);
  scene.addChild(missionLabel);

  const missionDescription = createText({
    text: text(table, firstMission.descriptionKey),
    fill: '#c7d4ea',
    fontSize: 13,
    wordWrapWidth: panelTextWidth,
  });
  missionDescription.position.set(panelX + panelPadding, panelY + 112);
  scene.addChild(missionDescription);

  const objective = createText({
    text: text(table, firstMission.objectiveKey),
    fill: '#ffffff',
    fontSize: 13,
    wordWrapWidth: panelTextWidth,
  });
  objective.position.set(panelX + panelPadding, panelY + 165);
  scene.addChild(objective);

  const responseText = createText({
    text: text(table, 'mission.first.terminal_locked'),
    fill: '#8df0a4',
    fontFamily: 'monospace',
    fontSize: 11,
    wordWrapWidth: panelTextWidth,
  });
  responseText.position.set(panelX + panelPadding, panelY + 220);
  scene.addChild(responseText);

  const hintMove = createText({
    text: text(table, 'ui.hint.move'),
    fill: '#a5b4cf',
    fontSize: 14,
  });
  hintMove.position.set(40, 320);
  scene.addChild(hintMove);

  const hintInteract = createText({
    text: text(table, 'ui.hint.interact'),
    fill: '#a5b4cf',
    fontSize: 14,
  });
  hintInteract.position.set(40, 345);
  scene.addChild(hintInteract);

  const resetButton = new Container();
  resetButton.position.set(40, 375);
  resetButton.eventMode = 'static';
  resetButton.cursor = 'pointer';
  scene.addChild(resetButton);

  const resetButtonBackground = new Graphics()
    .roundRect(0, 0, 150, 30, 6)
    .fill({ color: 0x1b2a45 })
    .stroke({ color: 0x6687bd, width: 1 });
  resetButton.addChild(resetButtonBackground);

  const resetButtonLabel = createText({
    text: text(table, 'ui.reset_progress'),
    fill: '#d9e6ff',
    fontSize: 12,
  });
  resetButtonLabel.position.set(12, 8);
  resetButton.addChild(resetButtonLabel);

  const renderInitialMission = () => {
    terminalOpen = false;
    objective.text = text(table, firstMission.objectiveKey);
    responseText.text = text(table, 'mission.first.terminal_locked');
  };

  const renderCompletedMission = () => {
    objective.text = text(table, 'mission.first.completed');
    responseText.text = text(table, 'mission.first.report_completed');
  };

  const resetProgress = () => {
    currentState = {
      ...currentState,
      activeMissionId: firstMission.id,
      completedMissions: currentState.completedMissions.filter((id) => id !== firstMission.id),
    };
    onStateChange(currentState);
    renderInitialMission();
  };

  resetButton.on('pointertap', resetProgress);

  const saveCompletedMission = () => {
    currentState = completeFirstMission(currentState);
    onStateChange(currentState);
    renderCompletedMission();
  };

  if (isFirstMissionCompleted(currentState)) {
    renderCompletedMission();
  }

  const keys = new Set<string>();
  const speed = 2.8;

  const handleKeyDown: KeyHandler = (event) => {
    const tokens = getInputTokens(event);
    for (const token of tokens) {
      keys.add(token);
    }

    if (isGameInput(event, tokens)) {
      event.preventDefault();
    }

    if (terminalOpen && !isFirstMissionCompleted(currentState)) {
      if (keys.has('answer:3')) {
        saveCompletedMission();
        return;
      }

      if (keys.has('answer:1') || keys.has('answer:2') || keys.has('answer:4')) {
        objective.text = text(table, 'mission.first.wrong');
        return;
      }
    }

    if (keys.has('interact')) {
      if (isFirstMissionCompleted(currentState)) {
        renderCompletedMission();
        return;
      }

      if (!isNear(getCenter(player), getCenter(terminal), 90)) {
        responseText.text = text(table, 'mission.first.terminal_locked');
        return;
      }

      terminalOpen = true;
      objective.text = text(table, 'mission.first.choose_header');
      responseText.text = text(table, 'mission.first.report');
    }
  };

  const handleKeyUp: KeyHandler = (event) => {
    const tokens = getInputTokens(event);
    for (const token of tokens) {
      keys.delete(token);
    }

    if (isGameInput(event, tokens)) {
      event.preventDefault();
    }

  };

  const eventTargets: EventTarget[] = [document, window];
  for (const target of eventTargets) {
    target.addEventListener('keydown', handleKeyDown as EventListener, { capture: true });
    target.addEventListener('keyup', handleKeyUp as EventListener, { capture: true });
  }

  const update = () => {
    let dx = 0;
    let dy = 0;

    if (isDirectionPressed(keys, 'up')) dy -= speed;
    if (isDirectionPressed(keys, 'down')) dy += speed;
    if (isDirectionPressed(keys, 'left')) dx -= speed;
    if (isDirectionPressed(keys, 'right')) dx += speed;

    player.x = Math.max(48, Math.min(360, player.x + dx));
    player.y = Math.max(48, Math.min(220, player.y + dy));

    if (!terminalOpen && !isFirstMissionCompleted(currentState)) {
      responseText.text = isNear(getCenter(player), getCenter(terminal), 90)
        ? text(table, 'mission.first.near_terminal')
        : text(table, 'mission.first.terminal_locked');
    }
  };

  app.ticker.add(update);

  return () => {
    for (const target of eventTargets) {
      target.removeEventListener('keydown', handleKeyDown as EventListener, { capture: true });
      target.removeEventListener('keyup', handleKeyUp as EventListener, { capture: true });
    }
    app.ticker.remove(update);
    scene.destroy({ children: true });
  };
}
