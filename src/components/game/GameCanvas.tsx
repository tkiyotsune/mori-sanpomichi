import React from 'react';
import { View, StyleSheet } from 'react-native';
import Character from './Character';
import ObstacleView from './Obstacle';
import type { GameState, CharacterType } from '../../types';

interface Props {
  stateRef: React.MutableRefObject<GameState>;
  renderTick: number;
  characterType: CharacterType;
}

export default function GameCanvas({ stateRef, renderTick, characterType }: Props) {
  const state = stateRef.current;

  return (
    <View style={styles.container} pointerEvents="none">
      {state.obstacles.map(obs => (
        <ObstacleView
          key={obs.id}
          type={obs.type}
          x={obs.x}
          y={obs.y}
          width={obs.width}
          height={obs.height}
        />
      ))}
      <Character
        x={state.characterX}
        y={state.characterY}
        direction={state.direction}
        characterType={characterType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
