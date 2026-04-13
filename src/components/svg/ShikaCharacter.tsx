import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { Direction } from '../../types';

interface Props {
  direction: Direction;
  size?: number;
}

const shikaImage = require('../../../assets/game/char_shika.png');

function ShikaCharacter({ direction, size = 50 }: Props) {
  const flip = direction === 'left';
  // Image: 198x280
  const height = size;
  const width = height * (198 / 280);

  return (
    <Image
      source={shikaImage}
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

export default React.memo(ShikaCharacter);
