import { useAppTheme } from '@/components/Material3ThemeProvider';
import { View } from '@/components/Themed';
import { ThemeEditor } from '@/components/ThemeEditor';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { useCallback, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Dialog, Divider, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { resetSpells } = use$(store);
  const theme = useAppTheme();

  const onReset = useCallback(() => {
    Alert.alert('Reset prepared spells ? ', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        onPress: resetSpells,
        style: 'destructive',
      },
    ]);
  }, [resetSpells]);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: Layout.padding }}>
      <ScrollView>
        <View style={{ paddingTop: Layout.padding }}>
          <Text variant="titleLarge">Theme</Text>
          <ThemeEditor />
        </View>

        <View style={{ paddingTop: Layout.padding * 2 }}>
          <Button mode="contained-tonal" onPress={onReset}>
            Clear Prepared Spells
          </Button>
        </View>

        <View style={{ paddingTop: Layout.padding }}>
          <Text variant="titleLarge">Debug</Text>
          {Object.entries(theme.colors).map(([key, value]) => (
            <View
              key={`color-${key}`}
              style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 4 }}
            >
              <View
                style={{ marginRight: Layout.padding, width: 32, height: 32, borderRadius: 16, backgroundColor: value }}
              />
              <Text variant="titleSmall">{key}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
