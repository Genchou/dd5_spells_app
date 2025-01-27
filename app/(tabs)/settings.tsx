import { useAppTheme } from '@/components/Material3ThemeProvider';
import { View } from '@/components/Themed';
import { ThemeEditor } from '@/components/ThemeEditor';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Snackbar, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { resetSpells, resetTrackers } = use$(store);
  const [showThemeColors, setShowThemeColors] = useState(false);
  const [showClipboardNotif, setShowClipboardNotif] = useState(false);
  const theme = useAppTheme();

  const onResetSpells = useCallback(() => {
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

  const onResetTrackers = useCallback(() => {
    Alert.alert('Reset prepared spells ? ', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        onPress: resetTrackers,
        style: 'destructive',
      },
    ]);
  }, [resetTrackers]);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: Layout.padding }}>
      <ScrollView>
        <View style={{ paddingTop: Layout.padding }}>
          <Text variant="titleLarge">Theme</Text>
          <ThemeEditor />
        </View>

        <View style={{ paddingTop: Layout.padding * 2 }}>
          <Button mode="contained-tonal" onPress={onResetSpells}>
            Clear Prepared Spells
          </Button>
        </View>

        <View style={{ paddingTop: Layout.padding * 2 }}>
          <Button mode="contained-tonal" onPress={onResetTrackers}>
            Clear Trackers
          </Button>
        </View>

        <View style={{ paddingTop: Layout.padding * 2 }}>
          <Button mode="contained-tonal" onPress={() => setShowThemeColors(true)}>
            Show theme values
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={showThemeColors} onDismiss={() => setShowThemeColors(false)}>
          <Dialog.Title>Color values</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: Layout.height / 2.5 }}>
            <ScrollView>
              {Object.entries(theme.colors).map(([key, value]) => (
                <TouchableRipple key={`color-${key}`} onPress={() => setShowClipboardNotif(true)}>
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginVertical: 4,
                    }}
                  >
                    <View
                      style={{
                        marginRight: Layout.padding,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: `${value}`,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: 'rgba(1, 1, 1, 0.3)',
                      }}
                    />
                    <Text>{JSON.stringify(value)}&nbsp;</Text>
                    <Text variant="titleSmall">{key}</Text>
                  </View>
                </TouchableRipple>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowThemeColors(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Snackbar duration={2000} visible={showClipboardNotif} onDismiss={() => setShowClipboardNotif(false)}>
          Color copied to clipboard
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
}
