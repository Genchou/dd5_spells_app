/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { View as DefaultView, Text as RNText } from 'react-native';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & RNText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function View(props: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { theme } = useMaterial3Theme();
  const { style, ...otherProps } = props;
  const backgroundColor = theme[colorScheme].background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
