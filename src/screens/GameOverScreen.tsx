import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CharacterRenderer from '../components/svg/CharacterRenderer';
import BannerAdView, { AD_BANNER_HEIGHT } from '../ads/BannerAdView';
import { COLORS } from '../constants/colors';
import { useHighScore } from '../hooks/useHighScore';
import i18n from '../i18n';
import type { CharacterType } from '../types';

interface Props {
  score: number;
  characterType: CharacterType;
  onRetry: () => void;
  onTitle: () => void;
}

export default function GameOverScreen({ score, characterType, onRetry, onTitle }: Props) {
  const insets = useSafeAreaInsets();
  const { highScore, updateHighScore } = useHighScore();
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Shift centered content up so it is not covered by the bottom banner.
  const contentShift = (insets.bottom + AD_BANNER_HEIGHT) / 2;

  useEffect(() => {
    updateHighScore(score).then(isNew => {
      if (isNew) setIsNewRecord(true);
    });
  }, [score, updateHighScore]);

  return (
    <View style={[styles.container, { paddingBottom: contentShift * 2 }]}>
      <View style={styles.bg} />
      <View style={styles.overlay} />

      <Text style={styles.gameOverText}>{i18n.t('gameOver')}</Text>

      <View style={styles.characterContainer}>
        <CharacterRenderer type={characterType} direction="right" size={80} />
      </View>

      <View style={styles.scoreContainer}>
        {isNewRecord && <Text style={styles.newRecord}>{i18n.t('newRecord')}</Text>}
        <Text style={styles.scoreLabel}>{i18n.t('score')}</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <View style={styles.divider} />
        <Text style={styles.highScoreLabel}>{i18n.t('best')}</Text>
        <Text style={styles.highScoreValue}>{isNewRecord ? score : highScore}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>{i18n.t('retry')}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.titleButton, pressed && styles.buttonPressed]}
          onPress={onTitle}
        >
          <Text style={styles.titleButtonText}>{i18n.t('titleButton')}</Text>
        </Pressable>
      </View>

      <BannerAdView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.meadowLight,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlayDark,
  },
  gameOverText: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 3,
    textShadowColor: '#5A5A5A40',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  characterContainer: {
    marginBottom: 25,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF20',
    paddingHorizontal: 50,
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF30',
    marginBottom: 35,
  },
  newRecord: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 10,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFFAA',
    letterSpacing: 3,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 4,
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: '#FFFFFF44',
    marginVertical: 14,
  },
  highScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFFAA',
    letterSpacing: 3,
  },
  highScoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.gold,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  retryButton: {
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
  },
  titleButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  retryText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
  titleButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
});
