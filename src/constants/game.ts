export const GAME = {
  // Speeds (pixels per second)
  scrollSpeed: 180,
  horizontalSpeed: 150,

  // Bounce
  bounceHeight: 50,
  bouncePeriod: 0.5, // seconds per bounce cycle

  // Character base size
  characterWidth: 40,
  characterHeight: 50,
  // Per-character size multipliers (affects visual AND collision)
  // Smaller = easier (kobito), Larger = harder (kuma)
  characterSizeScale: {
    kobito: 0.85,  // smallest — easier
    kitsune: 1.0,  // normal
    shika: 1.0,    // normal
    kuma: 1.15,    // largest — harder
  },

  // Obstacles
  obstacleTypes: ['rock', 'stump', 'mushroom'] as const,
  hardObstacleTypes: ['rock', 'stump', 'mushroom', 'pond'] as const,
  obstacleSizes: {
    rock: { width: 50, height: 40 },
    stump: { width: 45, height: 50 },
    mushroom: { width: 40, height: 45 },
    pond: { width: 105, height: 55 },
  },
  // Score threshold to introduce pond obstacles
  pondScoreThreshold: 500,
  minSpawnDistance: 100,
  maxSpawnDistance: 180,
  firstSpawnDistance: 300, // first obstacle appears after 300px

  // Collision
  hitboxShrink: 0.65,

  // Score
  scorePerPixel: 0.1,
  scoreUpdateInterval: 6, // frames between score display updates

  // Target frame time
  targetFrameTime: 1000 / 60,
} as const;
