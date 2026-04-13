import { useRef, useState, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import type { GameState, Direction, ObstacleData, ObstacleType, RiverZone, CharacterType } from '../types';
import { GAME } from '../constants/game';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLAY_LEFT = 20;
const PLAY_RIGHT = SCREEN_WIDTH - 20;
const CHARACTER_BASE_Y = SCREEN_HEIGHT * 0.7;

const OBSTACLE_TYPES: ObstacleType[] = ['rock', 'stump', 'mushroom'];
const HARD_OBSTACLE_TYPES: ObstacleType[] = ['rock', 'stump', 'mushroom', 'pond'];

// River config
const RIVER_FIRST = 2000;
const RIVER_INTERVAL = 3000;
const RIVER_HEIGHT = 380;
const BRIDGE_WIDTH = 140;
// BEFORE = above river on screen (obstacles approaching from top = player's future path)
// AFTER = below river on screen (player already crossed)
// Obstacles spawn at y≈0 and scroll down. River also scrolls down.
// We want a small gap before the river appears (BEFORE) and a small gap after (AFTER).
const SAFE_BEFORE = 110;
const SAFE_AFTER = 110;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createInitialState(): GameState {
  return {
    characterX: SCREEN_WIDTH / 2,
    characterY: CHARACTER_BASE_Y,
    direction: 'right',
    bouncePhase: 0,
    obstacles: [],
    score: 0,
    isGameOver: false,
    nextObstacleId: 0,
    distanceSinceLastSpawn: 0,
    nextSpawnThreshold: GAME.firstSpawnDistance,
    lastTimestamp: 0,
    scrollOffset: 0,
    rivers: [],
    nextRiverAt: RIVER_FIRST,
  };
}

const PATH_LEFT = SCREEN_WIDTH * 0.1;
const PATH_RIGHT = SCREEN_WIDTH * 0.9;

// Get the bridge's allowed X range at a given screen Y within the river
// River screen top: starts off screen top (-RIVER_HEIGHT), scrolls down
function getRiverScreenTop(river: RiverZone, scrollOffset: number): number {
  return -river.riverHeight + (scrollOffset - river.startOffset);
}

function getBridgeCenterX(progress: number, isLTR: boolean): number {
  // Arch curve: sine easing for smooth S-curve
  // Range: 25%~75% of screen to avoid overlapping trees at edges
  const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
  if (isLTR) {
    return SCREEN_WIDTH * 0.25 + eased * (SCREEN_WIDTH * 0.5);
  } else {
    return SCREEN_WIDTH * 0.75 - eased * (SCREEN_WIDTH * 0.5);
  }
}

function getBridgeBoundsAtY(river: RiverZone, screenY: number, riverScreenTop: number): { left: number; right: number } | null {
  const relY = screenY - riverScreenTop;
  if (relY < 0 || relY > river.riverHeight) return null;
  const progress = relY / river.riverHeight;
  const isLTR = river.bridgeDirection === 'left-to-right';
  const centerX = getBridgeCenterX(progress, isLTR);
  return { left: centerX - BRIDGE_WIDTH / 2, right: centerX + BRIDGE_WIDTH / 2 };
}

function getCharacterRiverInfo(state: GameState): { inRiver: boolean; bounds: { left: number; right: number } } {
  for (const river of state.rivers) {
    const riverScreenTop = getRiverScreenTop(river, state.scrollOffset);
    const bounds = getBridgeBoundsAtY(river, CHARACTER_BASE_Y, riverScreenTop);
    if (bounds) {
      return { inRiver: true, bounds };
    }
  }
  return { inRiver: false, bounds: { left: PLAY_LEFT, right: PLAY_RIGHT } };
}

// Check if spawning an obstacle now would visually overlap with any river.
// Since obstacles and rivers scroll at the same speed, their relative position is
// fixed after spawn. We check if the obstacle's full vertical extent overlaps the
// river's safe zone (both existing and upcoming rivers).
function isInSafeZone(state: GameState): boolean {
  // Generous obstacle bounds (max height is pond at ~55, use 60 for safety)
  const OBSTACLE_HEIGHT = 60;
  const spawnCenterY = -30; // center at top of screen, obstacle extends up from here
  const obstacleTop = spawnCenterY - OBSTACLE_HEIGHT;
  const obstacleBottom = spawnCenterY + OBSTACLE_HEIGHT;

  const overlapsRiver = (riverTop: number): boolean => {
    const zoneTop = riverTop - SAFE_BEFORE;
    const zoneBottom = riverTop + RIVER_HEIGHT + SAFE_AFTER;
    return obstacleBottom >= zoneTop && obstacleTop <= zoneBottom;
  };

  // Check all existing rivers
  for (const river of state.rivers) {
    const riverTop = getRiverScreenTop(river, state.scrollOffset);
    if (overlapsRiver(riverTop)) return true;
  }

  // Check upcoming river (not yet spawned). Project its position as if it existed now.
  // delta is negative when river hasn't spawned yet
  const delta = state.scrollOffset - state.nextRiverAt;
  if (delta > -1000 && delta <= 0) {
    const projectedRiverTop = -RIVER_HEIGHT + delta;
    if (overlapsRiver(projectedRiverTop)) return true;
  }

  return false;
}

function spawnObstacle(state: GameState): ObstacleData {
  const types = state.score >= GAME.pondScoreThreshold ? HARD_OBSTACLE_TYPES : OBSTACLE_TYPES;
  const type = types[Math.floor(Math.random() * types.length)];
  const size = GAME.obstacleSizes[type];

  const minX = PATH_LEFT + size.width / 2 + 5;
  const maxX = PATH_RIGHT - size.width / 2 - 5;

  const r = (Math.random() + Math.random()) / 2;
  const x = minX + r * (maxX - minX);

  return {
    id: state.nextObstacleId,
    type,
    x,
    y: -size.height,
    width: size.width,
    height: size.height,
  };
}

function checkCollision(
  cx: number,
  cy: number,
  obstacle: ObstacleData,
  charScale: number
): boolean {
  const cw = GAME.characterWidth * charScale * GAME.hitboxShrink;
  const ch = GAME.characterHeight * charScale * GAME.hitboxShrink;
  const ow = obstacle.width * GAME.hitboxShrink;
  const oh = obstacle.height * GAME.hitboxShrink;

  return (
    cx - cw / 2 < obstacle.x + ow / 2 &&
    cx + cw / 2 > obstacle.x - ow / 2 &&
    cy - ch / 2 < obstacle.y + oh / 2 &&
    cy + ch / 2 > obstacle.y - oh / 2
  );
}

export function useGameLoop(characterType: CharacterType) {
  const stateRef = useRef<GameState>(createInitialState());
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [renderTick, setRenderTick] = useState(0);
  const frameCountRef = useRef(0);

  const changeDirection = useCallback((dir: Direction) => {
    const state = stateRef.current;
    if (state.isGameOver) return;
    if (state.direction !== dir) {
      state.direction = dir;
      state.bouncePhase = 0;
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const state = stateRef.current;
    if (state.isGameOver) return;

    if (state.lastTimestamp === 0) {
      state.lastTimestamp = timestamp;
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const rawDt = (timestamp - state.lastTimestamp) / 1000;
    const dt = Math.min(rawDt, 0.05);
    state.lastTimestamp = timestamp;

    state.bouncePhase += dt / GAME.bouncePeriod;
    if (state.bouncePhase >= 1) state.bouncePhase -= Math.floor(state.bouncePhase);

    const bounceOffset = GAME.bounceHeight * Math.sin(state.bouncePhase * Math.PI);
    state.characterY = CHARACTER_BASE_Y - bounceOffset;

    const hDir = state.direction === 'left' ? -1 : 1;
    state.characterX += GAME.horizontalSpeed * hDir * dt;

    const charScale = GAME.characterSizeScale[characterType];

    // Boundary check - river-aware
    const riverInfo = getCharacterRiverInfo(state);
    const halfChar = (GAME.characterWidth * charScale) / 2;
    const bounds = riverInfo.inRiver ? riverInfo.bounds : { left: PLAY_LEFT, right: PLAY_RIGHT };
    if (state.characterX - halfChar < bounds.left || state.characterX + halfChar > bounds.right) {
      state.isGameOver = true;
      setIsGameOver(true);
      setDisplayScore(Math.floor(state.score));
      return;
    }

    const scrollDelta = GAME.scrollSpeed * dt;
    for (const obs of state.obstacles) obs.y += scrollDelta;

    // Remove obstacles that have scrolled into a river zone so they never
    // appear visually on the water or bridge.
    state.obstacles = state.obstacles.filter(o => {
      if (o.y >= SCREEN_HEIGHT + 60) return false;
      const obsCenter = o.y + o.height / 2;
      for (const river of state.rivers) {
        const riverTop = getRiverScreenTop(river, state.scrollOffset);
        if (obsCenter > riverTop && obsCenter < riverTop + river.riverHeight) {
          return false;
        }
      }
      return true;
    });

    // Spawn obstacles only if NOT in safe zone around rivers
    state.distanceSinceLastSpawn += scrollDelta;
    if (state.distanceSinceLastSpawn >= state.nextSpawnThreshold) {
      if (!isInSafeZone(state)) {
        const newObs = spawnObstacle(state);
        state.obstacles.push(newObs);
        state.nextObstacleId++;
      }
      state.distanceSinceLastSpawn = 0;
      state.nextSpawnThreshold = randomBetween(GAME.minSpawnDistance, GAME.maxSpawnDistance);
    }

    // Collision detection
    for (const obs of state.obstacles) {
      if (checkCollision(state.characterX, state.characterY, obs, charScale)) {
        state.isGameOver = true;
        setIsGameOver(true);
        setDisplayScore(Math.floor(state.score));
        return;
      }
    }

    state.scrollOffset += scrollDelta;

    // Spawn rivers
    if (state.scrollOffset >= state.nextRiverAt) {
      // Alternate direction based on how many rivers spawned so far
      const riverIndex = Math.round((state.nextRiverAt - RIVER_FIRST) / RIVER_INTERVAL);
      state.rivers.push({
        startOffset: state.nextRiverAt,
        riverHeight: RIVER_HEIGHT,
        bridgeDirection: riverIndex % 2 === 0 ? 'left-to-right' : 'right-to-left',
        safeMarginBefore: SAFE_BEFORE,
        safeMarginAfter: SAFE_AFTER,
      });
      state.nextRiverAt += RIVER_INTERVAL;
    }

    state.rivers = state.rivers.filter(
      r => state.scrollOffset < r.startOffset + r.riverHeight + SCREEN_HEIGHT * 2
    );

    state.score += scrollDelta * GAME.scorePerPixel;

    frameCountRef.current++;
    if (frameCountRef.current % GAME.scoreUpdateInterval === 0) setDisplayScore(Math.floor(state.score));
    if (frameCountRef.current % 2 === 0) setRenderTick(t => t + 1);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = createInitialState();
    frameCountRef.current = 0;
    setDisplayScore(0);
    setIsGameOver(false);
    setRenderTick(0);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const stopGame = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
  }, []);

  useEffect(() => { return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }; }, []);

  return { stateRef, displayScore, isGameOver, renderTick, changeDirection, startGame, stopGame };
}
