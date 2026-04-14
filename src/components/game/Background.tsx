import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Polygon, Line as SvgLine } from 'react-native-svg';
import ForestTree from '../svg/ForestTree';
import { COLORS } from '../../constants/colors';
import type { RiverZone } from '../../types';

const { width: SW, height: SH } = Dimensions.get('window');

const TREE_LEFT_X = -15;
const TREE_RIGHT_X = SW - 50;
const PATH_LEFT = SW * 0.1;
const PATH_RIGHT = SW * 0.9;
const PATH_W = PATH_RIGHT - PATH_LEFT;

const TREE_SPACING = 130;
const TREE_COUNT = Math.ceil(SH / TREE_SPACING) + 2;

// Path texture
const LINE_COUNT = 50;
const LINE_SPACING = 24;
const lineColors = [COLORS.pathDash, COLORS.pathPebble1, COLORS.pathPebble2, COLORS.pathPebble3];
const LINES: { x: number; w: number; color: string }[] = [];
for (let i = 0; i < LINE_COUNT; i++) {
  LINES.push({
    x: PATH_LEFT + 4 + ((i * 29 + 5) % (PATH_W - 14)),
    w: 3 + ((i * 11 + 3) % 8),
    color: lineColors[i % lineColors.length],
  });
}

// River flow lines — dark blue horizontals at random positions/lengths
const RIVER_FLOW_LINE_COUNT = 7;
const RIVER_FLOW_LINES: { x: number; w: number; yFrac: number; opacity: number; lh: number }[] =
  Array.from({ length: RIVER_FLOW_LINE_COUNT }, (_, i) => {
    const spread = i / (RIVER_FLOW_LINE_COUNT - 1); // 0→1, evenly distributed top-to-bottom
    const jitter = ((i * 31 + 11) % 100) / 100 * 0.06;
    return {
      x: Math.round(SW * ((i * 0.179 + 0.03) % 0.60)),
      w: Math.round(SW * (0.22 + (i * 0.131 + 0.07) % 0.52)),
      yFrac: Math.min(0.05 + spread * 0.88 + jitter, 0.93),
      opacity: 0.35 + (i % 5) * 0.06,
      lh: 3 + (i % 3) * 1.5,
    };
  });

// Flowers - smaller, more subtle
const FC = 20;
const FS = 55;
const FCOLS = [COLORS.flowerWhite, COLORS.flowerBlue, COLORS.flowerPink, COLORS.flowerYellow,
  COLORS.flowerLavender, COLORS.dandelion, COLORS.cloverGreen, COLORS.flowerWhite,
  COLORS.flowerPink, COLORS.flowerBlue];
const FLOWERS: { x: number; s: number; c: string }[] = [];
for (let i = 0; i < FC; i++) {
  const side = i % 2 === 0;
  FLOWERS.push({
    x: side ? 4 + ((i * 19 + 7) % (PATH_LEFT - 10)) : PATH_RIGHT + 4 + ((i * 17 + 3) % (SW - PATH_RIGHT - 10)),
    s: 2 + ((i * 7) % 3), // smaller: 2-5px
    c: FCOLS[i % FCOLS.length],
  });
}

// Distant trees (parallax layer) - faint silhouettes
const DISTANT_TREE_COUNT = 6;
const DISTANT_TREE_SPACING = 160;
const DISTANT_TREES: { x: number; h: number; w: number }[] = [];
for (let i = 0; i < DISTANT_TREE_COUNT; i++) {
  const side = i % 2 === 0;
  DISTANT_TREES.push({
    x: side ? 5 + ((i * 31) % 30) : SW - 35 - ((i * 23) % 25),
    h: 50 + ((i * 17) % 30),
    w: 18 + ((i * 11) % 12),
  });
}

const BRIDGE_WIDTH = 140;

function bridgeCenterX(progress: number, isLTR: boolean): number {
  const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
  return isLTR
    ? SW * 0.25 + eased * SW * 0.5
    : SW * 0.75 - eased * SW * 0.5;
}

/**
 * Returns space-separated "x,y x,y …" polygon points for an SVG Polygon.
 * Using 120 steps gives sub-pixel smoothness at any screen size.
 */
function bridgePolygonPoints(topY: number, h: number, isLTR: boolean): string {
  const STEPS = 120;
  const pts: string[] = [];
  for (let s = 0; s <= STEPS; s++) {
    const p = s / STEPS;
    const cx = bridgeCenterX(p, isLTR);
    pts.push(`${(cx - BRIDGE_WIDTH / 2).toFixed(2)},${(topY + p * h).toFixed(2)}`);
  }
  for (let s = STEPS; s >= 0; s--) {
    const p = s / STEPS;
    const cx = bridgeCenterX(p, isLTR);
    pts.push(`${(cx + BRIDGE_WIDTH / 2).toFixed(2)},${(topY + p * h).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface Props {
  scrollOffset: number;
  rivers: RiverZone[];
}

export default function Background({ scrollOffset, rivers }: Props) {
  const treeLoop = TREE_COUNT * TREE_SPACING;
  const lineLoop = LINE_COUNT * LINE_SPACING;
  const flowerLoop = FC * FS;

  const distantLoop = DISTANT_TREE_COUNT * DISTANT_TREE_SPACING;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {/* Meadow */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.meadowLight }} />

      {/* Layer 0: Distant haze at top */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SH * 0.15, backgroundColor: '#D8DCD0', opacity: 0.2 }} />

      {/* Layer 1: Distant tree silhouettes - slow parallax (0.3x) */}
      {DISTANT_TREES.map((dt, i) => {
        const y = ((i * DISTANT_TREE_SPACING + scrollOffset * 0.3) % distantLoop) - DISTANT_TREE_SPACING;
        return (
          <View key={`dt-${i}`} style={{
            position: 'absolute', top: y, left: dt.x,
            width: dt.w, height: dt.h, borderRadius: dt.w / 2,
            backgroundColor: COLORS.meadowDark, opacity: 0.15,
          }} />
        );
      })}

      {/* Path */}
      <View style={{ position: 'absolute', left: PATH_LEFT, right: SW - PATH_RIGHT, top: 0, bottom: 0, backgroundColor: COLORS.pathCenter, opacity: 0.3 }} />

      {/* Rivers */}
      {rivers.map((river, ri) => {
        const topY = -river.riverHeight + (scrollOffset - river.startOffset);
        const h = river.riverHeight;
        if (topY > SH + 50 || topY + h < -50) return null;

        const isLTR = river.bridgeDirection === 'left-to-right';

        return (
          <React.Fragment key={`rv-${ri}`}>
            {/* River water — base fill */}
            <View style={{
              position: 'absolute', top: topY, left: 0, right: 0, height: h,
              backgroundColor: '#7BB8D0',
            }} />
            {/* Flow lines — dark blue horizontals at random positions */}
            {RIVER_FLOW_LINES.map((rl, j) => (
              <View key={`rfl-${ri}-${j}`} style={{
                position: 'absolute',
                top: topY + rl.yFrac * h,
                left: rl.x,
                width: rl.w,
                height: rl.lh,
                backgroundColor: '#2E6070',
                opacity: rl.opacity,
                borderRadius: rl.lh,
              }} />
            ))}

            {/* Bridge — smooth SVG polygon (anti-aliased, no staircase) */}
            <Svg
              style={{ position: 'absolute', top: 0, left: 0, width: SW, height: SH }}
              pointerEvents="none"
            >
              <Polygon
                points={bridgePolygonPoints(topY, h, isLTR)}
                fill="#C4A870"
              />
              {[...Array(16)].map((_, pi) => {
                const progress = (pi + 0.5) / 16;
                const cx = bridgeCenterX(progress, isLTR);
                const lineY = topY + progress * h;
                return (
                  <SvgLine
                    key={pi}
                    x1={cx - BRIDGE_WIDTH / 2 + 2} y1={lineY}
                    x2={cx + BRIDGE_WIDTH / 2 - 2} y2={lineY}
                    stroke="#B09060"
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                );
              })}
            </Svg>

            {/* Lilies — always placed in open water, away from the bridge.
                LTR bridge: top-left → bottom-right, so water is top-right and bottom-left.
                RTL bridge: top-right → bottom-left, so water is top-left and bottom-right. */}
            <View style={{ position: 'absolute', top: topY + 50, left: isLTR ? SW - 55 : 40, width: 14, height: 10, borderRadius: 7, backgroundColor: COLORS.cloverGreen, opacity: 0.7 }} />
            <View style={{ position: 'absolute', top: topY + 48, left: isLTR ? SW - 48 : 46, width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.flowerPink, opacity: 0.8 }} />
            <View style={{ position: 'absolute', top: topY + h - 60, left: isLTR ? 40 : SW - 55, width: 12, height: 8, borderRadius: 6, backgroundColor: COLORS.cloverGreen, opacity: 0.6 }} />
            <View style={{ position: 'absolute', top: topY + h - 62, left: isLTR ? 46 : SW - 48, width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.flowerWhite, opacity: 0.9 }} />
          </React.Fragment>
        );
      })}

      {/* Path texture */}
      {LINES.map((ln, i) => {
        const y = ((i * LINE_SPACING + scrollOffset) % lineLoop) - LINE_SPACING;
        return (
          <View key={`ln-${i}`} style={{
            position: 'absolute', top: y, left: ln.x, width: ln.w, height: 1,
            backgroundColor: ln.color, opacity: 0.3,
          }} />
        );
      })}

      {/* Flowers */}
      {FLOWERS.map((f, i) => {
        const y = ((i * FS + scrollOffset) % flowerLoop) - FS;
        return (
          <View key={`fl-${i}`} style={{
            position: 'absolute', top: y, left: f.x,
            width: f.s, height: f.s, borderRadius: f.s / 2,
            backgroundColor: f.c, opacity: 0.4,
          }} />
        );
      })}

      {/* Trees left - skip river zones */}
      {[...Array(TREE_COUNT)].map((_, i) => {
        const y = ((i * TREE_SPACING + scrollOffset) % treeLoop) - TREE_SPACING;
        const inRiver = rivers.some(r => {
          const rt = -r.riverHeight + (scrollOffset - r.startOffset);
          return y + 105 > rt && y < rt + r.riverHeight;
        });
        if (inRiver) return null;
        return (
          <View key={`tl-${i}`} style={{ position: 'absolute', top: y, left: TREE_LEFT_X }}>
            <ForestTree side="left" variant={i % 6} />
          </View>
        );
      })}

      {/* Trees right - skip river zones */}
      {[...Array(TREE_COUNT)].map((_, i) => {
        const y = ((i * TREE_SPACING + TREE_SPACING / 2 + scrollOffset) % treeLoop) - TREE_SPACING;
        const inRiver = rivers.some(r => {
          const rt = -r.riverHeight + (scrollOffset - r.startOffset);
          return y + 105 > rt && y < rt + r.riverHeight;
        });
        if (inRiver) return null;
        return (
          <View key={`tr-${i}`} style={{ position: 'absolute', top: y, left: TREE_RIGHT_X }}>
            <ForestTree side="right" variant={(i + 3) % 6} />
          </View>
        );
      })}
    </View>
  );
}
