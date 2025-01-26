/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { View as DefaultView, Text as RNText } from 'react-native';
import { useAppTheme } from './Material3ThemeProvider';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & RNText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const theme = useAppTheme();
  const backgroundColor = theme.colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
