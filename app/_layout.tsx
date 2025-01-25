import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { RecoilRoot } from 'recoil';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CustomDefaultTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)', // System Blue
    background: 'rgb(242, 242, 247)', // Light mode background
    card: 'rgb(255, 255, 255)', // White cards/surfaces
    text: 'rgb(0, 0, 0)', // Black text for light mode
    border: 'rgb(216, 216, 220)', // Light gray for separators/borders
    notification: 'rgb(255, 59, 48)', // System Red
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    primary: 'rgb(10, 132, 255)', // System Blue (Dark Mode)
    background: 'rgb(1, 1, 1)', // True black background for OLED displays
    card: 'rgb(28, 28, 30)', // Dark card/surface color
    text: 'rgb(255, 255, 255)', // White text for dark mode
    border: 'rgb(44, 44, 46)', // Dark gray for separators/borders
    notification: 'rgb(255, 69, 58)', // System Red (Dark Mode)
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      <RecoilRoot>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="spell/[slug]"
            options={{
              title: 'Spell info',
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </RecoilRoot>
    </ThemeProvider>
  );
}
