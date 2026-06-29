export type MoveDirection = 'up' | 'down' | 'left' | 'right';
export type InputToken = `move:${MoveDirection}` | `answer:${1 | 2 | 3 | 4}` | 'interact' | string;

export type KeyHandler = (event: KeyboardEvent) => void;

export const gameCodes = new Set([
  'keyw',
  'keya',
  'keys',
  'keyd',
  'keyf',
  'keye',
  'digit1',
  'digit2',
  'digit3',
  'digit4',
  'arrowup',
  'arrowleft',
  'arrowdown',
  'arrowright',
]);

export function getInputTokens(event: KeyboardEvent): InputToken[] {
  const code = event.code.toLowerCase();
  const key = event.key.toLowerCase();
  const keyCode = String(event.keyCode);

  const aliases: Record<string, string[]> = {
    'move:up': ['keyw', 'w', 'ц', '87', 'arrowup'],
    'move:left': ['keya', 'a', 'ф', '65', 'arrowleft'],
    'move:down': ['keys', 's', 'ы', '83', 'arrowdown'],
    'move:right': ['keyd', 'keyf', 'd', 'f', 'в', 'а', '68', '70', 'arrowright'],
    interact: ['keye', 'e', 'у', '69'],
    'answer:1': ['digit1', '1', '49'],
    'answer:2': ['digit2', '2', '50'],
    'answer:3': ['digit3', '3', '51'],
    'answer:4': ['digit4', '4', '52'],
  };

  const tokens = new Set<InputToken>([code, key, keyCode]);
  for (const [alias, values] of Object.entries(aliases)) {
    if (values.includes(code) || values.includes(key) || values.includes(keyCode)) {
      tokens.add(alias);
      for (const value of values) {
        tokens.add(value);
      }
    }
  }

  return [...tokens];
}

export function isGameInput(event: KeyboardEvent, tokens: InputToken[]): boolean {
  return gameCodes.has(event.code.toLowerCase())
    || tokens.some((token) => token.startsWith('move:') || token === 'interact' || token.startsWith('answer:'));
}

export function isDirectionPressed(keys: Set<string>, direction: MoveDirection): boolean {
  return keys.has(`move:${direction}`);
}

