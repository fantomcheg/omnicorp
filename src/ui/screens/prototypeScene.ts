import { Application, Container, Graphics } from 'pixi.js';
import type { GameState } from '../../core/gameState';
import { completeMission } from '../../core/missionProgress';
import { firstMission } from '../../content/missions/firstMission';
import { missions } from '../../content/missions';
import { getInputTokens, isDirectionPressed, isGameInput, type KeyHandler } from '../../platform/web/input';
import { getCenter, isNear } from '../../shared/geometry';
import type { TrainingMission, TranslationTable } from '../../shared/types';
import { createText } from '../pixiText';
import { createButton, createPlayer, createTerminal, createTrainingRoom } from '../sceneFactories';

function text(table: TranslationTable, key: string): string {
  return table[key] ?? key;
}

function getChoicesText(mission: TrainingMission, table: TranslationTable): string {
  return mission.choices
    .map((choice, index) => `${index + 1}. ${text(table, choice.labelKey)}`)
    .join('\n');
}

function getSelectedChoiceId(mission: TrainingMission, keys: Set<string>): string | null {
  return mission.choices.find((choice) => keys.has(choice.answerToken))?.id ?? null;
}

export function mountPrototypeScene(
  app: Application,
  state: GameState,
  table: TranslationTable,
  onStateChange: (nextState: GameState) => void,
): () => void {
  let currentState = state;
  let activeMission: TrainingMission = missions.find((mission) => !state.completedMissions.includes(mission.id)) ?? firstMission;
  let terminalOpen = false;
  const scene = new Container();
  app.stage.addChild(scene);

  const worldX = 32;
  const worldY = 32;
  const worldWidth = 336;
  const worldHeight = 240;

  const room = createTrainingRoom({
    x: worldX,
    y: worldY,
    width: worldWidth,
    height: worldHeight,
  });
  scene.addChild(room);

  const player = createPlayer();
  player.position.set(120, 110);
  scene.addChild(player);

  const firstTerminal = createTerminal({
    x: 285,
    y: 104,
    label: 'HTTP',
    bodyColor: 0x16291f,
    accentColor: 0x8df0a4,
  });
  scene.addChild(firstTerminal);

  const secondTerminal = createTerminal({
    x: 88,
    y: 188,
    label: 'COOKIE',
    bodyColor: 0x2b2535,
    accentColor: 0xffd166,
  });
  scene.addChild(secondTerminal);

  const terminalNodes = [
    { mission: firstMission, body: firstTerminal },
    { mission: missions[1], body: secondTerminal },
  ] as const;

  const panelX = 400;
  const panelY = 40;
  const panelPadding = 18;
  const panelTextWidth = 250;

  const missionConsole = new Graphics()
    .roundRect(0, 0, 290, 360, 8)
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
    text: `${text(table, 'app.mission_label')}: ${text(table, activeMission.titleKey)}`,
    fill: '#f4f7fb',
    fontSize: 16,
    fontWeight: '600',
    wordWrapWidth: panelTextWidth,
  });
  missionLabel.position.set(panelX + panelPadding, panelY + 82);
  scene.addChild(missionLabel);

  const missionDescription = createText({
    text: text(table, activeMission.descriptionKey),
    fill: '#c7d4ea',
    fontSize: 13,
    wordWrapWidth: panelTextWidth,
  });
  missionDescription.position.set(panelX + panelPadding, panelY + 112);
  scene.addChild(missionDescription);

  const objective = createText({
    text: text(table, activeMission.objectiveKey),
    fill: '#ffffff',
    fontSize: 12,
    wordWrapWidth: panelTextWidth,
  });
  objective.position.set(panelX + panelPadding, panelY + 162);
  scene.addChild(objective);

  const responseText = createText({
    text: text(table, activeMission.terminalLockedKey),
    fill: '#8df0a4',
    fontFamily: 'monospace',
    fontSize: 10,
    wordWrapWidth: panelTextWidth,
  });
  responseText.position.set(panelX + panelPadding, panelY + 250);
  scene.addChild(responseText);

  const layoutPanelText = () => {
    const gap = 12;
    missionDescription.position.set(panelX + panelPadding, missionLabel.y + missionLabel.height + gap);
    objective.position.set(panelX + panelPadding, missionDescription.y + missionDescription.height + gap);
    responseText.position.set(panelX + panelPadding, objective.y + objective.height + gap);
  };

  layoutPanelText();

  const isMissionCompleted = (mission: TrainingMission) => currentState.completedMissions.includes(mission.id);

  const renderMissionIntro = (mission: TrainingMission, responseKey = mission.terminalLockedKey) => {
    activeMission = mission;
    missionLabel.text = `${text(table, 'app.mission_label')}: ${text(table, mission.titleKey)}`;
    missionDescription.text = text(table, mission.descriptionKey);
    objective.text = text(table, mission.objectiveKey);
    responseText.text = text(table, responseKey);
    layoutPanelText();
  };

  const renderCompletedMission = (mission: TrainingMission) => {
    activeMission = mission;
    missionLabel.text = `${text(table, 'app.mission_label')}: ${text(table, mission.titleKey)}`;
    missionDescription.text = text(table, mission.descriptionKey);
    objective.text = `${text(table, mission.completedKey)}\n\n${text(table, mission.remediationKey)}`;
    responseText.text = text(table, mission.completedReportKey);
    layoutPanelText();
  };

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

  const missionStatus = createText({
    text: '',
    fill: '#c7d4ea',
    fontSize: 12,
    wordWrapWidth: 320,
  });
  const statusPanel = new Graphics()
    .roundRect(0, 0, 336, 76, 6)
    .fill({ color: 0x0f1628 })
    .stroke({ color: 0x2c405d, width: 1 });
  statusPanel.position.set(32, 286);
  scene.addChild(statusPanel);

  missionStatus.position.set(46, 296);
  scene.addChild(missionStatus);

  const renderMissionStatus = () => {
    missionStatus.text = [
      text(table, 'ui.mission_status'),
      ...missions.map((mission) => {
        const statusKey = isMissionCompleted(mission) ? 'ui.status_done' : 'ui.status_todo';
        return `${text(table, statusKey)} [${text(table, `ui.mode.${mission.mode}`)}] - ${text(table, mission.titleKey)}`;
      }),
    ].join('\n');
  };

  const resetButton = createButton({
    label: text(table, 'ui.reset_progress'),
    width: 150,
    height: 30,
  });
  resetButton.position.set(32, 380);
  scene.addChild(resetButton);

  const renderInitialMission = () => {
    terminalOpen = false;
    const nextMission = missions.find((mission) => !currentState.completedMissions.includes(mission.id)) ?? firstMission;
    renderMissionIntro(nextMission);
  };

  const resetProgress = () => {
    currentState = {
      ...currentState,
      activeMissionId: firstMission.id,
      completedMissions: [],
    };
    onStateChange(currentState);
    renderMissionStatus();
    renderInitialMission();
  };

  resetButton.on('pointertap', resetProgress);

  const saveCompletedMission = () => {
    currentState = completeMission(currentState, activeMission.id);
    onStateChange(currentState);
    renderMissionStatus();
    renderCompletedMission(activeMission);
  };

  renderMissionStatus();

  if (isMissionCompleted(activeMission)) {
    renderCompletedMission(activeMission);
  }

  const getNearestTerminal = () => terminalNodes.find((terminalNode) => isNear(getCenter(player), getCenter(terminalNode.body), 90)) ?? null;

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

    if (terminalOpen && !isMissionCompleted(activeMission)) {
      const selectedChoiceId = getSelectedChoiceId(activeMission, keys);
      if (selectedChoiceId === activeMission.correctChoiceId) {
        saveCompletedMission();
        return;
      }

      if (selectedChoiceId !== null) {
        objective.text = text(table, activeMission.wrongAnswerKey);
        layoutPanelText();
        return;
      }
    }

    if (keys.has('interact')) {
      const nearestTerminal = getNearestTerminal();

      if (nearestTerminal === null) {
        responseText.text = text(table, activeMission.terminalLockedKey);
        layoutPanelText();
        return;
      }

      activeMission = nearestTerminal.mission;

      if (isMissionCompleted(activeMission)) {
        renderCompletedMission(activeMission);
        return;
      }

      terminalOpen = true;
      renderMissionIntro(activeMission);
      objective.text = text(table, activeMission.choicesPromptKey);
      responseText.text = getChoicesText(activeMission, table);
      layoutPanelText();
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

    player.x = Math.max(worldX + 8, Math.min(worldX + worldWidth - 40, player.x + dx));
    player.y = Math.max(worldY + 8, Math.min(worldY + worldHeight - 54, player.y + dy));

    if (!terminalOpen) {
      const nearestTerminal = getNearestTerminal();
      if (nearestTerminal !== null && nearestTerminal.mission.id !== activeMission.id) {
        renderMissionIntro(nearestTerminal.mission, nearestTerminal.mission.nearTerminalKey);
      } else if (nearestTerminal !== null && !isMissionCompleted(nearestTerminal.mission)) {
        responseText.text = text(table, nearestTerminal.mission.nearTerminalKey);
        layoutPanelText();
      } else if (nearestTerminal === null && !isMissionCompleted(activeMission)) {
        responseText.text = text(table, activeMission.terminalLockedKey);
        layoutPanelText();
      }
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
