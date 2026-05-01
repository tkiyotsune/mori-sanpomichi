import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import Background from '../components/game/Background';
import GameCanvas from '../components/game/GameCanvas';
import ScoreDisplay from '../components/game/ScoreDisplay';
import ControlButtons from '../components/game/ControlButtons';
import { useGameLoop } from '../hooks/useGameLoop';
import * as Haptics from 'expo-haptics';
import i18n from '../i18n';
import { COLORS } from '../constants/colors';
import type { CharacterType } from '../types';

const { width: SW, height: SH } = Dimensions.get('window');

interface Props {
  characterType: CharacterType;
  onGameOver: (score: number) => void;
}

// Falling leaves config
const LEAF_COUNT = 14;
const LEAF_COLORS = ['#D68650', '#C25448', '#D8A868', '#88A070', '#F0E0C8'];

type LeafAnim = {
  x: number;
  size: number;
  rotation: number;
  color: string;
  fallDuration: number;
  swayAmp: number;
  delay: number;
};

const LEAVES: LeafAnim[] = [];
for (let i = 0; i < LEAF_COUNT; i++) {
  LEAVES.push({
    x: (i * 73) % SW,
    size: 8 + (i * 3) % 6,
    rotation: (i * 47) % 360,
    color: LEAF_COLORS[i % LEAF_COLORS.length],
    fallDuration: 1200 + (i * 137) % 500,
    swayAmp: 15 + (i * 7) % 20,
    delay: (i * 43) % 300,
  });
}

export default function GameScreen({ characterType, onGameOver }: Props) {
  const {
    stateRef,
    displayScore,
    isGameOver,
    renderTick,
    changeDirection,
    startGame,
    stopGame,
  } = useGameLoop(characterType);

  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const leafAnims = useRef(LEAVES.map(() => ({
    y: new Animated.Value(-50),
    sway: new Animated.Value(0),
    spin: new Animated.Value(0),
  }))).current;
  const [showEffect, setShowEffect] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState<string | null>('3');
  const countdownAnim = useRef(new Animated.Value(0)).current;
  const tipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    Animated.timing(tipAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    const showStep = (label: string, delay: number, isGo: boolean) => {
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setCountdownLabel(label);
          Haptics.impactAsync(
            isGo ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
          );
          countdownAnim.setValue(0);
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.back(1.6)),
            useNativeDriver: true,
          }).start();
        }, delay)
      );
    };

    showStep('3', 0, false);
    showStep('2', 800, false);
    showStep('1', 1600, false);
    showStep(i18n.t('countdownGo'), 2400, true);

    timeouts.push(
      setTimeout(() => {
        if (cancelled) return;
        Animated.timing(tipAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }, 2400)
    );

    timeouts.push(
      setTimeout(() => {
        if (cancelled) return;
        setCountdownLabel(null);
        startGame();
      }, 2900)
    );

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      stopGame();
    };
  }, [startGame, stopGame, countdownAnim, tipAnim]);

  useEffect(() => {
    if (isGameOver) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setShowEffect(true);

      // Gentle green fade overlay (forest atmosphere)
      fadeOpacity.setValue(0);
      Animated.timing(fadeOpacity, {
        toValue: 0.5,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      // Soft screen shake
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 2, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();

      // Falling leaves animation
      LEAVES.forEach((leaf, i) => {
        const anim = leafAnims[i];
        anim.y.setValue(-50);
        anim.sway.setValue(0);
        anim.spin.setValue(0);
        Animated.parallel([
          Animated.timing(anim.y, {
            toValue: SH + 50,
            duration: leaf.fallDuration,
            delay: leaf.delay,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim.sway, {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
              Animated.timing(anim.sway, {
                toValue: -1,
                duration: 600,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.timing(anim.spin, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ),
        ]).start();
      });

      const timer = setTimeout(() => {
        onGameOver(displayScore);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, displayScore, onGameOver, fadeOpacity, shakeX, leafAnims]);

  const handlePress = (dir: 'left' | 'right') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    changeDirection(dir);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeX }] }]}>
      <Background scrollOffset={stateRef.current.scrollOffset} rivers={stateRef.current.rivers} />
      <GameCanvas stateRef={stateRef} renderTick={renderTick} characterType={characterType} />
      <ScoreDisplay score={displayScore} />
      {!isGameOver && <ControlButtons onPress={handlePress} />}

      {/* Countdown / tutorial overlay */}
      {countdownLabel !== null && (
        <View style={styles.countdownOverlay} pointerEvents="none">
          <Animated.Text
            style={[
              styles.countdownTip,
              {
                opacity: tipAnim,
                transform: [
                  {
                    translateY: tipAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-8, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {`◀  ${i18n.t('countdownTip')}  ▶`}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.countdownNumber,
              /^[0-9]+$/.test(countdownLabel) ? null : styles.countdownGoLabel,
              {
                opacity: countdownAnim,
                transform: [
                  {
                    scale: countdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1.15],
                    }),
                  },
                ],
              },
            ]}
          >
            {countdownLabel}
          </Animated.Text>
        </View>
      )}

      {/* Forest fade overlay */}
      {showEffect && (
        <Animated.View
          style={[styles.fade, { opacity: fadeOpacity }]}
          pointerEvents="none"
        />
      )}

      {/* Falling leaves */}
      {showEffect && LEAVES.map((leaf, i) => {
        const anim = leafAnims[i];
        const translateX = anim.sway.interpolate({
          inputRange: [-1, 1],
          outputRange: [-leaf.swayAmp, leaf.swayAmp],
        });
        const rotate = anim.spin.interpolate({
          inputRange: [0, 1],
          outputRange: [`${leaf.rotation}deg`, `${leaf.rotation + 360}deg`],
        });
        return (
          <Animated.View
            key={`leaf-${i}`}
            style={{
              position: 'absolute',
              left: leaf.x,
              width: leaf.size,
              height: leaf.size * 1.4,
              backgroundColor: leaf.color,
              borderTopLeftRadius: leaf.size / 2,
              borderTopRightRadius: leaf.size / 2,
              borderBottomLeftRadius: leaf.size / 4,
              borderBottomRightRadius: leaf.size / 4,
              transform: [
                { translateY: anim.y },
                { translateX },
                { rotate },
              ],
            }}
            pointerEvents="none"
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2A3A28',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownTip: {
    position: 'absolute',
    top: SH * 0.28,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: '#00000055',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: '#00000066',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 8,
  },
  countdownGoLabel: {
    fontSize: 56,
    letterSpacing: 4,
  },
});
