import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { Direction } from '../../types';

interface Props {
  direction: Direction;
  size?: number;
}

const kitsuneImage = require('../../../assets/game/char_kitsune.png');

function KitsuneCharacter({ direction, size = 50 }: Props) {
  const flip = direction === 'left';
  // Image: 208x280
  const height = size;
  const width = height * (208 / 280);

  return (
    <Image
      source={kitsuneImage}
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

export default React.memo(KitsuneCharacter);
