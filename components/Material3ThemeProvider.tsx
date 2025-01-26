import { Material3Scheme, Material3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
  ThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createContext, FC, useContext } from 'react';
import { useColorScheme } from 'react-native';
import {
  MD3Theme,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme,
  adaptNavigationTheme,
} from 'react-native-paper';

type Material3ThemeProviderProps = {
  theme: Material3Theme;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const Material3ThemeProviderContext = createContext<Material3ThemeProviderProps>({} as Material3ThemeProviderProps);

export const Material3ThemeProvider: FC<ProviderProps & { sourceColor?: string; fallbackSourceColor?: string }> = ({
  children,
  sourceColor,
  fallbackSourceColor,
  ...otherProps
}) => {
  const colorScheme = useColorScheme();

  const { theme, updateTheme, resetTheme } = useMaterial3Theme({
    sourceColor,
    fallbackSourceColor,
  });

  const paperTheme =
    colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light };

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialDark: { ...MD3DarkTheme, colors: theme.dark },
    materialLight: { ...MD3LightTheme, colors: theme.light },
  });

  const navigationTheme =
    colorScheme === 'dark'
      ? { ...DarkTheme, fonts: { ...NavigationDarkTheme.fonts } }
      : { ...LightTheme, fonts: { ...NavigationDefaultTheme.fonts } };

  return (
    <Material3ThemeProviderContext.Provider value={{ theme, updateTheme, resetTheme }}>
      <PaperProvider theme={paperTheme} {...otherProps}>
        <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
      </PaperProvider>
    </Material3ThemeProviderContext.Provider>
  );
};

export function useMaterial3ThemeContext() {
  const ctx = useContext(Material3ThemeProviderContext);
  if (!ctx) {
    throw new Error('useMaterial3ThemeContext must be used inside Material3ThemeProvider');
  }
  return ctx;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;
