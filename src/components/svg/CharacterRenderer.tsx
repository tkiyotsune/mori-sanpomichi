import React from 'react';
import KobitoCharacter from './KobitoCharacter';
import KitsuneCharacter from './KitsuneCharacter';
import KumaCharacter from './KumaCharacter';
import ShikaCharacter from './ShikaCharacter';
import type { CharacterType, Direction } from '../../types';

interface Props {
  type: CharacterType;
  direction: Direction;
  size?: number;
}

export default function CharacterRenderer({ type, direction, size = 50 }: Props) {
  switch (type) {
    case 'kitsune':
      return <KitsuneCharacter direction={direction} size={size} />;
    case 'kuma':
      return <KumaCharacter direction={direction} size={size} />;
    case 'shika':
      return <ShikaCharacter direction={direction} size={size} />;
    default:
      return <KobitoCharacter direction={direction} size={size} />;
  }
}
