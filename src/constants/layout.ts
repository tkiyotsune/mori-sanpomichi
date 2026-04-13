import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,
  playAreaLeft: 20,
  playAreaRight: width - 20,
  playAreaWidth: width - 40,
  characterBaseY: height * 0.7,
  controlAreaHeight: height * 0.3,
  scoreTopMargin: 60,
} as const;
