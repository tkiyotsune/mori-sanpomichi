import React from 'react';
import { Image, StyleSheet } from 'react-native';

const oakImage = require('../../../assets/game/tree.png');
const birchImage = require('../../../assets/game/birch.png');

interface Props {
  side: 'left' | 'right';
  variant?: number;
}

// Alternate between oak and birch based on variant
// Birch is taller and narrower, oak is wider and rounder
const TREE_CONFIGS = [
  { img: oakImage, width: 65, height: 105 },
  { img: birchImage, width: 55, height: 115 },
  { img: oakImage, width: 72, height: 115 },
  { img: birchImage, width: 50, height: 105 },
  { img: oakImage, width: 60, height: 95 },
  { img: birchImage, width: 58, height: 125 },
];

function ForestTree({ side, variant = 0 }: Props) {
  const flip = side === 'right';
  const config = TREE_CONFIGS[variant % TREE_CONFIGS.length];

  return (
    <Image
      source={config.img}
      style={[
        styles.tree,
        {
          width: config.width,
          height: config.height,
          transform: flip ? [{ scaleX: -1 }] : [],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  tree: {
    resizeMode: 'contain',
  },
});

export default React.memo(ForestTree);
