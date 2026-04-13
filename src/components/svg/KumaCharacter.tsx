import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { Direction } from '../../types';

interface Props {
  direction: Direction;
  size?: number;
}

const kumaImage = require('../../../assets/game/char_kuma.png');

function KumaCharacter({ direction, size = 50 }: Props) {
  const flip = direction === 'left';
  // Image: 203x280
  const height = size;
  const width = height * (203 / 280);

  return (
    <Image
      source={kumaImage}
      style={[
        styles.char,
        {
          width,
          height,
          transform: flip ? [{ scaleX: -1 }] : [],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  char: {
    resizeMode: 'contain',
  },
});

export default React.memo(KumaCharacter);
