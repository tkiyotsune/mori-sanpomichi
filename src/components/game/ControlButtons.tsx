import React, { useCallback, useState } from 'react';
import { View, Pressable, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colors';
import type { Direction } from '../../types';

interface Props {
  onPress: (direction: Direction) => void;
}

function ControlButtons({ onPress }: Props) {
  const [activeButton, setActiveButton] = useState<Direction | null>(null);

  const handlePressIn = useCallback(
    (dir: Direction) => {
      setActiveButton(dir);
      onPress(dir);
    },
    [onPress]
  );

  const handlePressOut = useCallback(() => {
    setActiveButton(null);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          styles.leftButton,
          activeButton === 'left' && styles.activeButton,
        ]}
        onPressIn={() => handlePressIn('left')}
        onPressOut={handlePressOut}
      >
        <Text style={styles.arrow}>{'<'}</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          styles.rightButton,
          activeButton === 'right' && styles.activeButton,
        ]}
        onPressIn={() => handlePressIn('right')}
        onPressOut={handlePressOut}
      >
        <Text style={styles.arrow}>{'>'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.buttonBg,
  },
  leftButton: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#FFFFFF44',
  },
  rightButton: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#FFFFFF44',
  },
  activeButton: {
    backgroundColor: COLORS.buttonActive,
  },
  arrow: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF88',
  },
});

export default React.memo(ControlButtons);
