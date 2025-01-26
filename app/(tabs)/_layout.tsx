import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { withLayoutContext } from 'expo-router';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

export const Tabs = withLayoutContext(createMaterialBottomTabNavigator().Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prepared Spells',
        }}
      />

      <Tabs.Screen
        name="spells"
        options={{
          title: 'Spells',
        }}
      />
    </Tabs>
  );
}
