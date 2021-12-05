import {PixelRatio, Platform, Dimensions} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WIDTH_SCALE = SCREEN_WIDTH / 375;
const HEIGHT_SCALE = SCREEN_HEIGHT / 812;

export const relativeWidth = (width = 0) => {
  const newSize = width * WIDTH_SCALE;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const relativeHeight = (height = 0) => {
  const newSize = height * HEIGHT_SCALE;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
