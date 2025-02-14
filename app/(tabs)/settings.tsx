import { Flex } from '@/components/Flex';
import { LayoutContainer } from '@/components/LayoutContainer';
import { useAppTheme } from '@/components/Material3ThemeProvider';
import { View } from '@/components/Themed';
import { ThemeEditor } from '@/components/ThemeEditor';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { checkForUpdate, getCurrentVersion, GITHUB_REPO } from '@/utils/update';
import { use$ } from '@legendapp/state/react';
import { useCallback, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Checkbox, Dialog, Portal, Snackbar, Switch, Text, TouchableRipple } from 'react-native-paper';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const { resetSpells, resetTrackers, useNewRules } = use$(store);
  const [showThemeColors, setShowThemeColors] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [clearSpells, setClearSpells] = useState(false);
  const [clearTrackers, setClearTrackers] = useState(false);
  const [snackbarText, setSnackbarText] = useState<string | undefined>(undefined);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [nextUpdate, setNextUpdate] = useState<string>();

  const onUpdatePress = useCallback(() => {
    setShowUpdateModal(false);
    Linking.openURL(`https://github.com/${GITHUB_REPO}/releases/latest`);
  }, []);

  const onCheckUpdate = useCallback(() => {
    checkForUpdate().then((update) => {
      if (update.needsUpdate) {
        setShowUpdateModal(true);
        const next = update.latestRelease.name;
        setNextUpdate(next.substring(1));
      } else {
        setSnackbarText('Your app is up to date');
      }
    });
  }, []);

  const onResetDialogDismiss = useCallback(() => {
    setShowResetWarning(false);
    setClearSpells(false);
    setClearTrackers(false);
  }, []);

  const onResetData = useCallback(() => {
    if (clearSpells) {
      resetSpells();
    }
    if (clearTrackers) {
      resetTrackers();
    }
    setSnackbarText('Data cleared');
    onResetDialogDismiss();
  }, [clearSpells, clearTrackers, onResetDialogDismiss, resetSpells, resetTrackers]);

  return (
    <LayoutContainer topInset>
      <ScrollView contentContainerStyle={{ paddingTop: Layout.padding * 4 }}>
        <Flex style={{ marginHorizontal: Layout.padding * 2 }}>
          <Text variant="titleLarge">App settings</Text>
          <Flex align="center" direction="row" justify="space-between" style={{ marginTop: Layout.padding }}>
            <Text variant="titleSmall">Use 2024 ruleset</Text>
            <Switch value={useNewRules} onValueChange={() => store.useNewRules.set((prev) => !prev)} />
          </Flex>
        </Flex>

        <Flex style={{ marginTop: Layout.padding }}>
          <Text style={{ marginLeft: Layout.padding * 2 }} variant="titleLarge">
            Theme
          </Text>
          <ThemeEditor />
        </Flex>

        <Flex style={{ marginTop: Layout.padding, marginHorizontal: Layout.padding * 2 }}>
          <Text variant="titleLarge">Misc</Text>
          <Flex style={{ paddingTop: Layout.padding }}>
            <Button mode="contained-tonal" onPress={() => setShowResetWarning(true)}>
              Clear data
            </Button>
          </Flex>

          {Platform.OS === 'android' && (
            <Flex style={{ paddingTop: Layout.padding }}>
              <Button mode="contained-tonal" onPress={onCheckUpdate}>
                Check for update
              </Button>
            </Flex>
          )}
        </Flex>

        <Flex align="center" style={{ marginTop: Layout.padding, marginHorizontal: Layout.padding * 2 }}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onBackground,
            }}
          >
            App version: {getCurrentVersion()}
          </Text>
        </Flex>
      </ScrollView>

      <Portal>
        <Dialog visible={showThemeColors} onDismiss={() => setShowThemeColors(false)}>
          <Dialog.Title>Color values</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: Layout.height / 2.5 }}>
            <ScrollView>
              {Object.entries(theme.colors).map(([key, value]) => (
                <TouchableRipple key={`color-${key}`} onPress={() => setSnackbarText('Color copied to clipboard.')}>
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
        <Snackbar
          duration={2000}
          style={{ marginBottom: Layout.padding * 6 }}
          visible={!!snackbarText}
          onDismiss={() => setSnackbarText(undefined)}
        >
          {snackbarText}
        </Snackbar>
      </Portal>

      <Portal>
        <Dialog visible={showResetWarning} onDismiss={onResetDialogDismiss}>
          <Dialog.Content>
            <Flex align="center" direction="row" justify="flex-start">
              <Checkbox.Android
                status={clearTrackers ? 'checked' : 'unchecked'}
                onPress={() => setClearTrackers((prev) => !prev)}
              />
              <Text variant="bodyMedium">Clear Trackers</Text>
            </Flex>
            <Flex align="center" direction="row" justify="flex-start">
              <Checkbox.Android
                status={clearSpells ? 'checked' : 'unchecked'}
                onPress={() => setClearSpells((prev) => !prev)}
              />
              <Text variant="bodyMedium">Clear My Spells</Text>
            </Flex>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onResetDialogDismiss}>Cancel</Button>
            <Button disabled={!clearSpells && !clearTrackers} textColor={theme.colors.error} onPress={onResetData}>
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={showUpdateModal} onDismiss={() => setShowUpdateModal(false)}>
          <Dialog.Content>
            <Flex>
              <Text variant="titleSmall">An update is available</Text>
              <Flex style={{ paddingTop: Layout.padding }}>
                <Text>Latest version: {nextUpdate}</Text>
                <Text>Your version: {getCurrentVersion()}</Text>
              </Flex>
            </Flex>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowUpdateModal(false)}>Cancel</Button>
            <Button onPress={onUpdatePress}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LayoutContainer>
  );
}
