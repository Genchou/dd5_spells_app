import { Material3ThemeProvider } from '@/components/Material3ThemeProvider';
import MaterialNavBar from '@/components/MaterialNavBar';
import { useColorScheme } from '@/components/useColorScheme';
import { store } from '@/state/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { use$ } from '@legendapp/state/react';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import 'react-native-reanimated';

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const { sourceColor } = use$(store);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialDark: { ...MD3DarkTheme, colors: theme.dark },
    materialLight: { ...MD3LightTheme, colors: theme.light },
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

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? DarkTheme.colors.card : LightTheme.colors.card);
  }, [DarkTheme.colors.card, LightTheme.colors.card, colorScheme]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <Material3ThemeProvider sourceColor={sourceColor}>
        <Stack
          screenOptions={{
            header: (props) => <MaterialNavBar {...props} />,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="spell/[slug]"
            options={{
              title: 'Spell info',
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="new-tracker" options={{ title: 'New tracker' }} />
        </Stack>
        <StatusBar
          backgroundColor={theme[colorScheme ?? 'light'].background}
          style={colorScheme === 'dark' ? 'light' : 'auto'}
        />
      </Material3ThemeProvider>
    </GestureHandlerRootView>
  );
}
