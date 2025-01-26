import { View } from '@/components/Themed';
import { ThemeEditor } from '@/components/ThemeEditor';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Dialog, Divider, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { resetSpells } = use$(store);

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
      <View style={{ paddingTop: Layout.padding }}>
        <Text variant="titleLarge">Theme</Text>
        <ThemeEditor />
      </View>

      <View style={{ paddingTop: Layout.padding * 2 }}>
        <Button mode="contained-tonal" onPress={onReset}>
          Clear Prepared Spells
        </Button>
      </View>
    </SafeAreaView>
  );
}
