import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

const i18n = new I18n({
  ja: {
    title: 'もりのさんぽみち',
    subtitle: 'Metsän Tonttu',
    start: 'START',
    character: 'CHARACTER',
    score: 'SCORE',
    best: 'BEST',
    gameOver: 'GAME OVER',
    newRecord: 'NEW RECORD!',
    retry: 'RETRY',
    titleButton: 'TITLE',
    back: 'BACK',
    inUse: 'IN USE',
    characterSelect: 'キャラクター',
    kobito: '小人',
    kobitoDesc: '赤い帽子の森の小人',
    kitsune: 'きつね',
    kitsuneDesc: 'ふさふさ尻尾の子ぎつね',
    kuma: 'くま',
    kumaDesc: 'マフラー巻きの子ぐま',
    shika: 'しか',
    shikaDesc: '小さな角の子じか',
  },
  en: {
    title: 'Forest of Walkroad',
    subtitle: 'Metsän Tonttu',
    start: 'START',
    character: 'CHARACTER',
    score: 'SCORE',
    best: 'BEST',
    gameOver: 'GAME OVER',
    newRecord: 'NEW RECORD!',
    retry: 'RETRY',
    titleButton: 'TITLE',
    back: 'BACK',
    inUse: 'IN USE',
    characterSelect: 'Character',
    kobito: 'Kobito',
    kobitoDesc: 'Red-hooded forest gnome',
    kitsune: 'Fox',
    kitsuneDesc: 'Fluffy-tailed little fox',
    kuma: 'Bear',
    kumaDesc: 'Scarf-wearing bear cub',
    shika: 'Deer',
    shikaDesc: 'Little fawn with small antlers',
  },
});

i18n.locale = getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
