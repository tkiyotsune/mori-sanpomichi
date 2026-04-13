import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  score: number;
}

function ScoreDisplay({ score }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current && score > 0) {
      prevScore.current = score;
      scaleAnim.setValue(1.08);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [score, scaleAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SCORE</Text>
      <Animated.Text style={[styles.score, { transform: [{ scale: scaleAnim }] }]}>
        {score}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 3,
    textShadowColor: COLORS.scoreShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    textShadowColor: COLORS.scoreShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default React.memo(ScoreDisplay);
