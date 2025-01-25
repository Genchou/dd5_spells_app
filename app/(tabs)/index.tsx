import { SpellList } from '@/components/SpellList';
import { View } from '@/components/Themed';
import { store } from '@/state/store';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useMemo } from 'react';

export default function PreparedSpellsScreen() {
  const preparedSpells = use$(store.preparedSpells);

  const list = useMemo(() => {
    return sectionSpellsByLevel(preparedSpells);
  }, [preparedSpells]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
      }}
    >
      <SpellList
        spells={list}
        onSpellPress={(item) => router.navigate({ pathname: '/spell/[slug]', params: { slug: item.slug } })}
      />
    </View>
  );
}
