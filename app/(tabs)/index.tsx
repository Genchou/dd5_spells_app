import { useAppTheme } from '@/components/Material3ThemeProvider';
import { SpellList } from '@/components/SpellList';
import { store } from '@/state/store';
import { sectionSpellsByLevel } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreparedSpellsScreen() {
  const { preparedSpells, resetSpells } = use$(store);
  const theme = useAppTheme();

  const list = useMemo(() => {
    return sectionSpellsByLevel(preparedSpells);
  }, [preparedSpells]);

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
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
      }}
    >
      <Appbar.Header>
        <Appbar.Content title="" />
        {preparedSpells.length > 0 && (
          <Appbar.Action
            disabled={preparedSpells.length === 0}
            icon={() => <MaterialIcons color={theme.colors.primary} name="delete" size={24} />}
            onPress={onReset}
          />
        )}
      </Appbar.Header>
      <SpellList
        showCastingTime
        showDuration
        showRange
        spells={list}
        onSpellPress={(item) => router.navigate({ pathname: '/spell/[slug]', params: { slug: item.slug } })}
      />
    </SafeAreaView>
  );
}
