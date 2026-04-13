import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@mori_sanpomichi_high_score';

export function useHighScore() {
  const [highScore, setHighScore] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then(val => {
      if (val !== null) {
        setHighScore(parseInt(val, 10));
      }
      setLoaded(true);
    });
  }, []);

  const updateHighScore = useCallback(async (score: number) => {
    // Always read from storage to avoid race conditions
    const stored = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    const current = stored ? parseInt(stored, 10) : 0;

    if (score > current) {
      setHighScore(score);
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true;
    }
    setHighScore(current);
    return false;
  }, []);

  return { highScore, updateHighScore, loaded };
}
