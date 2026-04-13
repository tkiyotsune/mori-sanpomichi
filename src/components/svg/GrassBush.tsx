import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

interface Props {
  variant?: number;
}

function GrassBush({ variant = 0 }: Props) {
  const v = variant % 4;

  if (v === 0) {
    // Round bush with berries
    return (
      <Svg width={40} height={30} viewBox="0 0 40 30">
        <Ellipse cx={20} cy={20} rx={16} ry={10} fill={COLORS.birchLeaf} stroke={COLORS.outline} strokeWidth={1.2} />
        <Ellipse cx={12} cy={16} rx={8} ry={7} fill={COLORS.birchLeafLight} stroke={COLORS.outline} strokeWidth={1.2} />
        <Ellipse cx={28} cy={17} rx={9} ry={8} fill={COLORS.pineLight} stroke={COLORS.outline} strokeWidth={1.2} />
        <Circle cx={10} cy={20} r={2} fill={COLORS.lingonberry} />
        <Circle cx={14} cy={22} r={1.5} fill={COLORS.lingonberry} />
      </Svg>
    );
  }
  if (v === 1) {
    // Grass tuft with flowers
    return (
      <Svg width={35} height={28} viewBox="0 0 35 28">
        <Path d="M10 28 Q8 16 12 8" fill="none" stroke={COLORS.pineGreen} strokeWidth={2} strokeLinecap="round" />
        <Path d="M17 28 Q16 12 18 5" fill="none" stroke={COLORS.birchLeaf} strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M24 28 Q26 14 22 7" fill="none" stroke={COLORS.pineGreen} strokeWidth={2} strokeLinecap="round" />
        <Circle cx={12} cy={7} r={3} fill={COLORS.white} stroke={COLORS.outline} strokeWidth={0.8} />
        <Circle cx={12} cy={7} r={1} fill={COLORS.gold} />
        <Circle cx={22} cy={6} r={2.5} fill={COLORS.lingonberry} opacity={0.8} />
      </Svg>
    );
  }
  if (v === 2) {
    // Small pine seedling
    return (
      <Svg width={30} height={35} viewBox="0 0 30 35">
        <Path d="M15 32 L15 18" stroke={COLORS.stumpBrown} strokeWidth={2.5} strokeLinecap="round" />
        <Path d="M15 8 L22 20 L8 20 Z" fill={COLORS.pineLight} stroke={COLORS.outline} strokeWidth={1.2} />
        <Path d="M15 3 L20 14 L10 14 Z" fill={COLORS.pineGreen} stroke={COLORS.outline} strokeWidth={1.2} />
      </Svg>
    );
  }
  // v === 3: Blueberry bush
  return (
    <Svg width={38} height={28} viewBox="0 0 38 28">
      <Ellipse cx={19} cy={18} rx={15} ry={10} fill={COLORS.birchLeaf} stroke={COLORS.outline} strokeWidth={1.2} />
      <Ellipse cx={12} cy={15} rx={8} ry={7} fill={COLORS.birchLeafLight} stroke={COLORS.outline} strokeWidth={1.2} />
      <Circle cx={22} cy={20} r={2.5} fill={COLORS.blueberry} />
      <Circle cx={26} cy={17} r={2} fill={COLORS.blueberry} />
      <Circle cx={18} cy={22} r={2} fill={COLORS.blueberry} />
    </Svg>
  );
}

export default React.memo(GrassBush);
