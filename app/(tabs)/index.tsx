import { SpellList } from '@/components/SpellList';
import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { Link, router } from 'expo-router';
import { useMemo } from 'react';
import { Button, Text } from 'react-native-paper';
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
        EmptyListComponent={
          <View
            style={{
              paddingTop: Layout.height / 3,
              paddingHorizontal: Layout.padding * 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ textAlign: 'center', paddingBottom: Layout.padding }} variant="titleSmall">
              You have no spell prepared.
            </Text>
            <Link asChild href="/spells">
              <Button mode="contained-tonal">Go to spells list</Button>
            </Link>
          </View>
        }
        onSpellPress={(item) => router.navigate({ pathname: '/spell/[slug]', params: { slug: item.slug } })}
      />
    </SafeAreaView>
  );
}
