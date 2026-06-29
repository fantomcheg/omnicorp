import { Container, Graphics } from 'pixi.js';
import { createText } from './pixiText';

interface RoomOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TerminalOptions {
  x: number;
  y: number;
  label: string;
  bodyColor: number;
  accentColor: number;
}

interface ButtonOptions {
  label: string;
  width: number;
  height: number;
}

export function createTrainingRoom(options: RoomOptions): Container {
  const room = new Container();
  room.position.set(options.x, options.y);

  const background = new Graphics()
    .roundRect(0, 0, options.width, options.height, 6)
    .fill({ color: 0x101827 })
    .stroke({ color: 0x31415e, width: 2 });
  room.addChild(background);

  const grid = new Graphics();
  for (let x = 24; x < options.width; x += 24) {
    grid.moveTo(x, 0).lineTo(x, options.height).stroke({ color: 0x1d2a3d, width: 1 });
  }
  for (let y = 24; y < options.height; y += 24) {
    grid.moveTo(0, y).lineTo(options.width, y).stroke({ color: 0x1d2a3d, width: 1 });
  }
  room.addChild(grid);

  const trainingLane = new Graphics()
    .roundRect(18, 82, 300, 76, 8)
    .fill({ color: 0x17213a })
    .stroke({ color: 0x2c405d, width: 1 });
  room.addChild(trainingLane);

  return room;
}

export function createPlayer(): Graphics {
  return new Graphics()
    .circle(14, 9, 9)
    .fill({ color: 0x8fd3ff })
    .roundRect(5, 18, 18, 20, 5)
    .fill({ color: 0x4f9fcb })
    .rect(9, 38, 5, 10)
    .fill({ color: 0x8fd3ff })
    .rect(18, 38, 5, 10)
    .fill({ color: 0x8fd3ff });
}

export function createTerminal(options: TerminalOptions): Container {
  const terminal = new Container();
  terminal.position.set(options.x, options.y);

  const body = new Graphics()
    .roundRect(0, 0, 52, 44, 5)
    .fill({ color: options.bodyColor })
    .stroke({ color: options.accentColor, width: 2 });
  terminal.addChild(body);

  const screen = new Graphics()
    .roundRect(9, 10, 34, 14, 3)
    .fill({ color: options.accentColor });
  terminal.addChild(screen);

  const label = createText({
    text: options.label,
    fill: `#${options.accentColor.toString(16).padStart(6, '0')}`,
    fontSize: options.label.length > 4 ? 9 : 10,
  });
  label.position.set(options.label.length > 4 ? 7 : 12, 28);
  terminal.addChild(label);

  return terminal;
}

export function createButton(options: ButtonOptions): Container {
  const button = new Container();
  button.eventMode = 'static';
  button.cursor = 'pointer';

  const background = new Graphics()
    .roundRect(0, 0, options.width, options.height, 6)
    .fill({ color: 0x1b2a45 })
    .stroke({ color: 0x6687bd, width: 1 });
  button.addChild(background);

  const label = createText({
    text: options.label,
    fill: '#d9e6ff',
    fontSize: 12,
  });
  label.position.set(12, 8);
  button.addChild(label);

  return button;
}

