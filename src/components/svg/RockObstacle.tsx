import React from 'react';
import Svg, { Path, Ellipse, G } from 'react-native-svg';

// Warm gray rock
const ROCK = '#B5ADA0';
const ROCK_DARK = '#958D80';
const ROCK_LIGHT = '#CAC2B5';
const MOSS = '#88A070';
const MOSS_DARK = '#6E8458';

function RockObstacle() {
  return (
    <Svg width={50} height={40} viewBox="0 0 50 40">
      <G>
        {/* Ground shadows - 2 layers */}
        <Ellipse cx={25} cy={36} rx={20} ry={2.2} fill="#0000000A" />
        <Ellipse cx={25} cy={36.3} rx={14} ry={1.4} fill="#00000014" />

        {/* ========== ROCK BODY - asymmetric organic shape ========== */}
        <Path
          d="M5 30 Q2.5 21 7.5 14 Q13 8 20 7.5 Q28 7 34 10 Q41 13 44 20 Q46 28 43 32 Q36 35 25 35.5 Q14 35 6 33 Q4 32 5 30 Z"
          fill={ROCK}
        />
        {/* Rock shadow - bottom-left half */}
        <Path
          d="M5 30 Q2.5 21 7.5 14 Q10 11 14 9 Q9 15 7 22 Q6 28 7 32 Q12 34 25 35.5 Q14 35 6 33 Q4 32 5 30 Z"
          fill={ROCK_DARK}
        />
        {/* Rock highlight - upper right */}
        <Path
          d="M22 10 Q30 9 37 13 Q41 17 43 22"
          fill="none"
          stroke={ROCK_LIGHT}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Crack detail - subtle */}
        <Path d="M21 17 Q22.5 21 20 26" fill="none" stroke={ROCK_DARK} strokeWidth={0.5} opacity={0.4} strokeLinecap="round" />
        <Path d="M31 20 Q31.5 24 30 28" fill="none" stroke={ROCK_DARK} strokeWidth={0.4} opacity={0.35} strokeLinecap="round" />

        {/* Moss patch - upper left, asymmetric */}
        <Path
          d="M7 26 Q5.5 22 9 21 Q13 21 15 23 Q16 25 14 27 Q10 28 7 26 Z"
          fill={MOSS}
        />
        <Path
          d="M7 26 Q5.5 22 9 21 Q11 22 11 24 Q9 26 7 26 Z"
          fill={MOSS_DARK}
          opacity={0.6}
        />

        {/* Small moss on right */}
        <Ellipse cx={38} cy={25} rx={2.5} ry={1.5} fill={MOSS} opacity={0.8} />
        <Ellipse cx={37} cy={24.5} rx={1} ry={0.7} fill={MOSS_DARK} opacity={0.6} />
      </G>
    </Svg>
  );
}

export default React.memo(RockObstacle);
