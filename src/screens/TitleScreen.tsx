import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CharacterRenderer from '../components/svg/CharacterRenderer';
import Background from '../components/game/Background';
import BannerAdView, { AD_BANNER_HEIGHT } from '../ads/BannerAdView';
import { COLORS } from '../constants/colors';
import i18n from '../i18n';
import type { CharacterType } from '../types';

interface Props {
  characterType: CharacterType;
  onStart: () => void;
  onSettings: () => void;
}

export default function TitleScreen({ characterType, onStart, onSettings }: Props) {
  const insets = useSafeAreaInsets();
  const buttonsBottom = insets.bottom + AD_BANNER_HEIGHT + 28;
  return (
    <View style={styles.container}>
      {/* Same background as game screen */}
      <Background scrollOffset={0} rivers={[]} />

      {/* Title */}
      <View style={[styles.titleContainer, { marginTop: insets.top + 40 }]}>
        <Text style={styles.titleMain}>{i18n.t('title')}</Text>
        <Text style={styles.titleSub}>{i18n.t('subtitle')}</Text>
      </View>

      {/* Character */}
      <View style={styles.characterContainer}>
        <CharacterRenderer type={characterType} direction="right" size={130} />
      </View>

      {/* Buttons - positioned above banner */}
      <View style={[styles.buttonsContainer, { bottom: buttonsBottom }]}>
        <Pressable
          style={({ pressed }) => [styles.startButton, pressed && styles.buttonPressed]}
          onPress={onStart}
        >
          <Text style={styles.startText}>{i18n.t('start')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
          onPress={onSettings}
        >
          <Text style={styles.settingsText}>{i18n.t('character')}</Text>
        </Pressable>
      </View>

      {/* Bottom banner ad */}
      <BannerAdView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    alignSelf: 'stretch',
  },
  titleMain: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.white,
    textShadowColor: '#5A5A5A40',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 3,
    textAlign: 'center',
  },
  titleSub: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 3,
    marginTop: 6,
    textShadowColor: '#5A5A5A40',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    opacity: 0.8,
    textAlign: 'center',
  },
  characterContainer: {
    marginTop: 30,
  },
  buttonsContainer: {
    position: 'absolute',
    alignItems: 'center',
    gap: 14,
  },
  startButton: {
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  settingsButton: {
    backgroundColor: COLORS.mushroomOrange,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
    opacity: 0.8,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  settingsButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.6,
  },
  startText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 3,
  },
});
