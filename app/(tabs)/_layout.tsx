import { useAppTheme } from '@/components/Material3ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
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
        name="trackers"
        options={{
          title: 'Trackers',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons color={color} name="track-changes" size={18} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'My Spells',
          tabBarIcon: ({ color }: { color: string }) => <MaterialIcons color={color} name="bookmarks" size={18} />,
        }}
      />

      <Tabs.Screen
        name="spells"
        options={{
          title: 'Spell List',
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
