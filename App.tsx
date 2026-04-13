import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TitleScreen from './src/screens/TitleScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useCharacterSelect } from './src/hooks/useCharacterSelect';
import { initializeAds } from './src/ads/init';
import type { Screen } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'title' });
  const { character, selectCharacter, loaded } = useCharacterSelect();

  useEffect(() => {
    initializeAds();
  }, []);

  const handleStart = useCallback(() => {
    setScreen({ name: 'game' });
  }, []);

  const handleSettings = useCallback(() => {
    setScreen({ name: 'settings' });
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setScreen({ name: 'gameover', score });
  }, []);

  const handleRetry = useCallback(() => {
    setScreen({ name: 'game' });
  }, []);

  const handleTitle = useCallback(() => {
    setScreen({ name: 'title' });
  }, []);

  if (!loaded) return <SafeAreaProvider><View style={styles.container} /></SafeAreaProvider>;

  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen.name === 'title' && (
        <TitleScreen
          characterType={character}
          onStart={handleStart}
          onSettings={handleSettings}
        />
      )}
      {screen.name === 'settings' && (
        <SettingsScreen
          selected={character}
          onSelect={selectCharacter}
          onBack={handleTitle}
        />
      )}
      {screen.name === 'game' && (
        <GameScreen
          characterType={character}
          onGameOver={handleGameOver}
        />
      )}
      {screen.name === 'gameover' && (
        <GameOverScreen
          score={screen.score}
          characterType={character}
          onRetry={handleRetry}
          onTitle={handleTitle}
        />
      )}
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
