import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';

// Muted teal water
const WATER = '#8BB0BC';
const WATER_DARK = '#6B909C';
const WATER_LIGHT = '#A8C8D0';
const WATER_SHIMMER = '#D0E0E4';
const LILY = '#88A070';
const LILY_DARK = '#6E8458';
const LILY_FLOWER = '#E0B0B8';
const LILY_FLOWER_LIGHT = '#F0D4D8';
const REED = '#6E8458';
const REED_LIGHT = '#A0B888';
const PETAL = '#F4E0D0';

function PondObstacle() {
  return (
    <Svg width={105} height={55} viewBox="0 0 105 55">
      <G>
        {/* Ground shadows */}
        <Ellipse cx={52.5} cy={52} rx={45} ry={2.8} fill="#0000000A" />
        <Ellipse cx={52.5} cy={52.3} rx={32} ry={1.8} fill="#00000014" />

        {/* Water body - rounder top, asymmetric */}
        <Path
          d="M4 28 Q3 16 12 10 Q28 5 52.5 5 Q77 5 93 10 Q102 16 101 29 Q100 42 88 47 Q70 50 52.5 50 Q35 50 17 47 Q5 42 4 28 Z"
          fill={WATER}
        />
        {/* Water deep shadow - bottom half */}
        <Path
          d="M4 28 Q5 38 17 46 Q35 50 52.5 50 Q70 50 88 46 Q100 38 101 29 Q94 42 72 48 Q50 50 33 48 Q11 43 4 28 Z"
          fill={WATER_DARK}
          opacity={0.55}
        />

        {/* Water surface highlight band - more pronounced on rounded top */}
        <Ellipse cx={52.5} cy={13} rx={42} ry={4} fill={WATER_LIGHT} opacity={0.6} />
        <Ellipse cx={52.5} cy={11} rx={33} ry={1.8} fill={WATER_SHIMMER} opacity={0.5} />

        {/* Diagonal ripples */}
        <Path d="M16 24 Q25 22 34 24" fill="none" stroke={WATER_SHIMMER} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
        <Path d="M60 30 Q70 28 78 30" fill="none" stroke={WATER_SHIMMER} strokeWidth={0.9} strokeLinecap="round" opacity={0.7} />
        <Path d="M26 38 Q35 37 44 38" fill="none" stroke={WATER_LIGHT} strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
        <Path d="M70 22 Q78 21 86 22" fill="none" stroke={WATER_SHIMMER} strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />

        {/* Lily pad - right */}
        <Ellipse cx={75} cy={33} rx={7.5} ry={4} fill={LILY} />
        <Path d="M67 33 Q71 29 75 29 Q76 33 74 34.5 Q70 35 67 33 Z" fill={LILY_DARK} opacity={0.65} />
        <Path d="M76 33 L82 30 L82 36 Z" fill={WATER} />
        <Circle cx={76} cy={30} r={2.5} fill={LILY_FLOWER} />
        <Circle cx={76} cy={30} r={1.4} fill={LILY_FLOWER_LIGHT} />
        <Circle cx={76} cy={30} r={0.6} fill="#F4D840" />

        {/* Lily pad - left */}
        <Ellipse cx={26} cy={37} rx={6} ry={3.3} fill={LILY} />
        <Path d="M20 37 Q24 33 26 33 Q27 37 25 38.5 Q22 39 20 37 Z" fill={LILY_DARK} opacity={0.65} />
        <Path d="M27 37 L32 34 L32 40 Z" fill={WATER} />

        {/* Floating petals */}
        <Ellipse cx={42} cy={22} rx={1.5} ry={0.8} fill={PETAL} opacity={0.85} />
        <Ellipse cx={56} cy={41} rx={1.3} ry={0.7} fill={PETAL} opacity={0.85} />
        <Ellipse cx={92} cy={38} rx={1.2} ry={0.65} fill={PETAL} opacity={0.8} />

        {/* Reeds - left edge only */}
        <Path d="M5 22 Q4 13 7 5" fill="none" stroke={REED} strokeWidth={1.2} strokeLinecap="round" />
        <Path d="M8 21 Q7 12 10 4" fill="none" stroke={REED} strokeWidth={1.1} strokeLinecap="round" />
        <Path d="M11 21 Q11 13 13 5" fill="none" stroke={REED_LIGHT} strokeWidth={1} strokeLinecap="round" />
        <Path d="M14 22 Q15 15 16 9" fill="none" stroke={REED} strokeWidth={0.9} strokeLinecap="round" />
        {/* Reed tips/seeds */}
        <Ellipse cx={7} cy={5} rx={0.7} ry={1.3} fill={REED} />
        <Ellipse cx={10} cy={4} rx={0.7} ry={1.4} fill={REED} />
        <Ellipse cx={13} cy={5} rx={0.55} ry={1.2} fill={REED_LIGHT} />
        <Ellipse cx={16} cy={9} rx={0.5} ry={1.1} fill={REED} />
      </G>
    </Svg>
  );
}

export default React.memo(PondObstacle);
