import { useAppTheme } from '@/components/Material3ThemeProvider';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { color } from '@rneui/base';
import { withLayoutContext } from 'expo-router';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

export const Tabs = withLayoutContext(createMaterialBottomTabNavigator().Navigator);

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prepared Spells',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons color={color} name="bookmarks" size={18} />,
        }}
      />

      <Tabs.Screen
        name="spells"
        options={{
          title: 'Spells',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons color={color} name="library-books" size={18} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons color={color} name="settings" size={18} />,
        }}
      />
    </Tabs>
  );
}
