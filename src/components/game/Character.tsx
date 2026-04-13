import React from 'react';
import { View, StyleSheet } from 'react-native';
import CharacterRenderer from '../svg/CharacterRenderer';
import type { Direction, CharacterType } from '../../types';
import { GAME } from '../../constants/game';

interface Props {
  x: number;
  y: number;
  direction: Direction;
  characterType: CharacterType;
}

export default function Character({ x, y, direction, characterType }: Props) {
  const scale = GAME.characterSizeScale[characterType];
  const width = GAME.characterWidth * scale;
  const height = GAME.characterHeight * scale;

  return (
    <View
      style={[
        styles.container,
        {
          left: x - width / 2,
          top: y - height / 2,
          width,
          height,
        },
      ]}
    >
      <CharacterRenderer type={characterType} direction={direction} size={50 * scale} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
