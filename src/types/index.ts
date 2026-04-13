export type Direction = 'left' | 'right';

export type ObstacleType = 'rock' | 'stump' | 'mushroom' | 'pond';

export type CharacterType = 'kobito' | 'kitsune' | 'kuma' | 'shika';

export interface Position {
  x: number;
  y: number;
}

export interface ObstacleData {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RiverZone {
  startOffset: number;      // scrollOffset when river appears
  riverHeight: number;      // pixel height of the river
  bridgeDirection: 'left-to-right' | 'right-to-left'; // bridge diagonal direction
  safeMarginBefore: number; // no obstacles before river
  safeMarginAfter: number;  // no obstacles after river
}

export interface GameState {
  characterX: number;
  characterY: number;
  direction: Direction;
  bouncePhase: number;
  obstacles: ObstacleData[];
  score: number;
  isGameOver: boolean;
  nextObstacleId: number;
  distanceSinceLastSpawn: number;
  nextSpawnThreshold: number;
  lastTimestamp: number;
  scrollOffset: number;
  rivers: RiverZone[];
  nextRiverAt: number;
}

export type Screen =
  | { name: 'title' }
  | { name: 'settings' }
  | { name: 'game' }
  | { name: 'gameover'; score: number };
