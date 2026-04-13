import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { Direction } from '../../types';

interface Props {
  direction: Direction;
  size?: number;
}

const kobitoImage = require('../../../assets/game/char_kobito.png');

function KobitoCharacter({ direction, size = 50 }: Props) {
  const flip = direction === 'left';
  // Image: 159x280
  const height = size;
  const width = height * (159 / 280);

  return (
    <Image
      source={kobitoImage}
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

export default React.memo(KobitoCharacter);
