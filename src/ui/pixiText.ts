import { Text, TextStyle, type TextStyleFontWeight } from 'pixi.js';

interface TextOptions {
  text: string;
  fill: string;
  fontSize: number;
  fontWeight?: TextStyleFontWeight;
  fontFamily?: string;
  wordWrapWidth?: number;
}

export function createText(options: TextOptions): Text {
  const styleOptions: ConstructorParameters<typeof TextStyle>[0] = {
    fill: options.fill,
    fontSize: options.fontSize,
  };

  if (options.fontWeight !== undefined) {
    styleOptions.fontWeight = options.fontWeight;
  }

  if (options.fontFamily !== undefined) {
    styleOptions.fontFamily = options.fontFamily;
  }

  if (options.wordWrapWidth !== undefined) {
    styleOptions.wordWrap = true;
    styleOptions.wordWrapWidth = options.wordWrapWidth;
  }

  return new Text({
    text: options.text,
    style: new TextStyle(styleOptions),
  });
}
