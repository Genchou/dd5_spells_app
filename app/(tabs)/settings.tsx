import { useMaterial3ThemeContext } from '@/components/Material3ThemeProvider';
import { View } from '@/components/Themed';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { updateTheme, resetTheme } = useMaterial3ThemeContext();

  return (
    <SafeAreaView>
      <Text>Some settings</Text>

      <Text>Maybe change theme color ?</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button mode="contained-tonal" onPress={() => updateTheme('#FF0000')}>
          Red
        </Button>

        <Button mode="contained-tonal" onPress={() => updateTheme('#3B82F6')}>
          Blue
        </Button>

        <Button mode="contained-tonal" onPress={() => updateTheme('#8B5CF6')}>
          Violet
        </Button>
      </View>

      <View>
        <Button onPress={resetTheme}>Reset</Button>
      </View>
    </SafeAreaView>
  );
}
