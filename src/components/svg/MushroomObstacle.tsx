import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';

const CAP = '#D68650';
const CAP_DARK = '#B06838';
const CAP_LIGHT = '#E89A60';
const STEM = '#F0E0C4';
const STEM_DARK = '#D4C0A0';

function MushroomObstacle() {
  return (
    <Svg width={40} height={45} viewBox="0 0 40 45">
      <G>
        {/* Ground shadow */}
        <Ellipse cx={20} cy={42} rx={14} ry={2.5} fill="#0000000C" />

        {/* Stem */}
        <Path
          d="M15 28 Q14 35 15.5 42 L24.5 42 Q26 35 25 28 Z"
          fill={STEM}
        />
        {/* Stem shadow */}
        <Path
          d="M15 28 Q14 35 15.5 42 L20 42 L20 28 Z"
          fill={STEM_DARK}
        />

        {/* Cap - chanterelle shape */}
        <Path
          d="M4 28 Q4 12 20 7 Q36 12 36 28 Q30 31 20 31 Q10 31 4 28 Z"
          fill={CAP}
        />
        {/* Cap shadow - left */}
        <Path
          d="M4 28 Q4 12 20 7 Q16 9 12 14 Q8 20 6 25 Q5 27 4 28 Z"
          fill={CAP_DARK}
        />
        {/* Cap highlight */}
        <Path
          d="M22 9 Q28 11 32 16 Q34 20 33 25"
          fill="none"
          stroke={CAP_LIGHT}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.55}
        />

        {/* Cap ridges (chanterelle style) */}
        <Path d="M12 27 Q13 22 15 17" fill="none" stroke={CAP_DARK} strokeWidth={0.5} opacity={0.5} strokeLinecap="round" />
        <Path d="M20 28 L20 19" fill="none" stroke={CAP_DARK} strokeWidth={0.5} opacity={0.5} strokeLinecap="round" />
        <Path d="M28 27 Q27 22 25 17" fill="none" stroke={CAP_DARK} strokeWidth={0.5} opacity={0.5} strokeLinecap="round" />

        {/* Stem ring detail */}
        <Path d="M16 33 Q20 34 24 33" fill="none" stroke={STEM_DARK} strokeWidth={0.4} opacity={0.7} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

export default React.memo(MushroomObstacle);
