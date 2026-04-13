import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CharacterRenderer from '../components/svg/CharacterRenderer';
import ForestTree from '../components/svg/ForestTree';
import BannerAdView, { AD_BANNER_HEIGHT } from '../ads/BannerAdView';
import { COLORS } from '../constants/colors';
import i18n from '../i18n';
import type { CharacterType } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHARACTER_TYPES: { type: CharacterType; nameKey: string; descKey: string }[] = [
  { type: 'kobito', nameKey: 'kobito', descKey: 'kobitoDesc' },
  { type: 'kitsune', nameKey: 'kitsune', descKey: 'kitsuneDesc' },
  { type: 'kuma', nameKey: 'kuma', descKey: 'kumaDesc' },
  { type: 'shika', nameKey: 'shika', descKey: 'shikaDesc' },
];

interface Props {
  selected: CharacterType;
  onSelect: (c: CharacterType) => void;
  onBack: () => void;
}

export default function SettingsScreen({ selected, onSelect, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const backButtonBottom = insets.bottom + AD_BANNER_HEIGHT + 20;
  const gridPaddingBottom = backButtonBottom + 70;
  return (
    <View style={styles.container}>
      <View style={styles.bg} />

      {/* Decorative trees */}
      <View style={styles.treeLeft}><ForestTree side="left" variant={0} /></View>
      <View style={styles.treeRight}><ForestTree side="right" variant={1} /></View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('characterSelect')}</Text>
      </View>

      {/* Character grid */}
      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: gridPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        {CHARACTER_TYPES.map(c => {
          const isSelected = selected === c.type;
          return (
            <Pressable
              key={c.type}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => onSelect(c.type)}
            >
              <View style={styles.charPreview}>
                <CharacterRenderer type={c.type} direction="right" size={80} />
              </View>
              <Text style={[styles.charName, isSelected && styles.charNameSelected]}>
                {i18n.t(c.nameKey)}
              </Text>
              <Text style={styles.charDesc}>{i18n.t(c.descKey)}</Text>
              {isSelected && <View style={styles.checkBadge}><Text style={styles.checkText}>{i18n.t('inUse')}</Text></View>}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Back button */}
      <View style={[styles.footer, { bottom: backButtonBottom }]}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={onBack}
        >
          <Text style={styles.backText}>{i18n.t('back')}</Text>
        </Pressable>
      </View>

      <BannerAdView />
    </View>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.meadowLight,
  },
  treeLeft: {
    position: 'absolute',
    top: 60,
    left: -15,
    opacity: 0.4,
  },
  treeRight: {
    position: 'absolute',
    top: 140,
    right: -15,
    opacity: 0.4,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
    textShadowColor: '#5A5A5A40',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 14,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF30',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF60',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: COLORS.accentBlue,
    backgroundColor: '#FFFFFF50',
  },
  charPreview: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  charName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.outline,
  },
  charNameSelected: {
    color: COLORS.accentBlue,
  },
  charDesc: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  checkBadge: {
    marginTop: 8,
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  checkText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: COLORS.accentBlue,
    paddingHorizontal: 50,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF80',
  },
  backButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },
  backText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 3,
  },
});
