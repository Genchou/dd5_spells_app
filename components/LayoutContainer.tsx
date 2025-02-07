import { FC, PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from './Material3ThemeProvider';

type LayoutProps = {
  topInset?: boolean;
  bottomInset?: boolean;
  background?: string;
  style?: ViewStyle;
};

export const LayoutContainer: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  topInset,
  bottomInset,
  background,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: topInset ? insets.top : 0,
          paddingBottom: bottomInset ? insets.bottom : 0,
          backgroundColor: background ?? theme.colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
