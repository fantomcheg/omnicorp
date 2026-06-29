export interface Point {
  x: number;
  y: number;
}

export interface RectLike extends Point {
  width: number;
  height: number;
}

export function isNear(a: Point, b: Point, distance: number): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= distance;
}

export function getCenter(rect: RectLike): Point {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

