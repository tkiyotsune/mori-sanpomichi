import React from 'react';
import Svg, { Path, Ellipse, G } from 'react-native-svg';

const TRUNK = '#E8DEC8';
const TRUNK_DARK = '#CAC0A8';
const TRUNK_LIGHT = '#F4EEDC';
const BARK = '#6A4520';
const RING = '#A08058';
const RING_DARK = '#6A4520';
const TOP_BASE = '#C4A878';
const TOP_DARK = '#A08058';

function StumpObstacle() {
  return (
    <Svg width={45} height={50} viewBox="0 0 45 50">
      <G>
        {/* Ground shadows */}
        <Ellipse cx={22.5} cy={47} rx={18} ry={2.2} fill="#0000000A" />
        <Ellipse cx={22.5} cy={47.3} rx={13} ry={1.5} fill="#00000014" />

        {/* Trunk side - cream wood, no green */}
        <Path
          d="M8 18 Q7.5 30 8 42 Q9 46 22.5 46 Q36 46 37 42 Q37.5 30 37 18 Z"
          fill={TRUNK}
        />
        <Path
          d="M8 18 Q7.5 30 8 42 Q9 46 22.5 46 L22.5 18 Z"
          fill={TRUNK_DARK}
        />
        <Path
          d="M33 22 Q33.5 32 33 40"
          fill="none"
          stroke={TRUNK_LIGHT}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.55}
        />

        {/* Bark marks */}
        <Ellipse cx={13} cy={25} rx={2.2} ry={0.55} fill={BARK} opacity={0.75} />
        <Ellipse cx={28} cy={29} rx={1.8} ry={0.5} fill={BARK} opacity={0.75} />
        <Ellipse cx={12} cy={34} rx={2} ry={0.55} fill={BARK} opacity={0.75} />
        <Ellipse cx={30} cy={37} rx={1.6} ry={0.5} fill={BARK} opacity={0.75} />
        <Ellipse cx={15} cy={41} rx={1.5} ry={0.45} fill={BARK} opacity={0.7} />

        {/* Top surface - wood color only, no moss */}
        <Ellipse cx={22.5} cy={18} rx={15} ry={5.5} fill={TOP_BASE} />
        {/* Top shadow - left half */}
        <Path
          d="M8 18 Q9 14 15 13 Q20 12.5 22.5 13 L22.5 20.3 Q14 20 8 18 Z"
          fill={TOP_DARK}
          opacity={0.6}
        />

        {/* Tree rings on top */}
        <Ellipse cx={22.5} cy={18} rx={11} ry={4} fill="none" stroke={RING} strokeWidth={0.6} opacity={0.8} />
        <Ellipse cx={22.5} cy={18} rx={7} ry={2.5} fill="none" stroke={RING} strokeWidth={0.6} opacity={0.8} />
        <Ellipse cx={22.5} cy={18} rx={3.5} ry={1.2} fill="none" stroke={RING} strokeWidth={0.6} opacity={0.8} />
        <Ellipse cx={22.5} cy={18} rx={1.2} ry={0.5} fill={RING_DARK} />
      </G>
    </Svg>
  );
}

export default React.memo(StumpObstacle);
