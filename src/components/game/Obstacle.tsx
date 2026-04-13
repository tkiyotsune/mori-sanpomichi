import React from 'react';
import { View, StyleSheet } from 'react-native';
import RockObstacle from '../svg/RockObstacle';
import StumpObstacle from '../svg/StumpObstacle';
import MushroomObstacle from '../svg/MushroomObstacle';
import PondObstacle from '../svg/PondObstacle';
import type { ObstacleType } from '../../types';

interface Props {
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SVG_MAP = {
  rock: RockObstacle,
  stump: StumpObstacle,
  mushroom: MushroomObstacle,
  pond: PondObstacle,
} as const;

export default function ObstacleView({ type, x, y, width, height }: Props) {
  const SvgComponent = SVG_MAP[type];

  return (
    <View
      style={[
        styles.container,
        {
          left: x - width / 2,
          top: y - height / 2,
        },
      ]}
    >
      <SvgComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
