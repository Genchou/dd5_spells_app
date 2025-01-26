import { useAppTheme } from '@/components/Material3ThemeProvider';
import { SpellList } from '@/components/SpellList';
import { store } from '@/state/store';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreparedSpellsScreen() {
  const { preparedSpells } = use$(store);

  const list = useMemo(() => {
    return sectionSpellsByLevel(preparedSpells);
  }, [preparedSpells]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
      }}
    >
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
