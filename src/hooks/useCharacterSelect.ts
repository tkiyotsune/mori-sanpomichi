import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CharacterType } from '../types';

const CHARACTER_KEY = '@mori_sanpomichi_character';

export function useCharacterSelect() {
  const [character, setCharacter] = useState<CharacterType>('kobito');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHARACTER_KEY).then(val => {
      if (val) setCharacter(val as CharacterType);
      setLoaded(true);
    });
  }, []);

  const selectCharacter = useCallback(async (c: CharacterType) => {
    setCharacter(c);
    await AsyncStorage.setItem(CHARACTER_KEY, c);
  }, []);

  return { character, selectCharacter, loaded };
}
