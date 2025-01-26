import { Text, View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function SpellScreen() {
  const { slug } = useLocalSearchParams();
  const spells = useSpells('druid');

  const { preparedSpells, prepareSpell } = use$(store);

  const spell = useMemo(() => spells.find((s) => s.slug === slug), [slug, spells]);
  const isPrepared = useMemo(() => !!preparedSpells.find((s) => s.name === spell?.name), [preparedSpells, spell]);

  const onPrepare = useCallback(() => {
    if (spell) {
      prepareSpell(spell);
    }
    router.back();
  }, [prepareSpell, spell]);

  if (!spell) {
    return (
      <View>
        <Text>No Spell found</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        paddingHorizontal: Layout.padding,
      }}
    >
      <Stack.Screen
        options={{
          title: spell?.name ?? 'Spell',
        }}
      />
      <Text>Level {spell.level}</Text>
      <View darkColor="rgba(255,255,255,0.1)" lightColor="#eee" style={styles.separator} />

      <Text>{spell.casting_time}</Text>
      <View darkColor="rgba(255,255,255,0.1)" lightColor="#eee" style={styles.separator} />

      <Text>{spell.range}</Text>
      <View darkColor="rgba(255,255,255,0.1)" lightColor="#eee" style={styles.separator} />

      <Text>{spell.components}</Text>
      <View darkColor="rgba(255,255,255,0.1)" lightColor="#eee" style={styles.separator} />

      <Text>{spell.duration}</Text>
      <View darkColor="rgba(255,255,255,0.1)" lightColor="#eee" style={styles.separator} />

      <Text>{spell.description}</Text>

      <Button mode="elevated" onPress={onPrepare}>
        {isPrepared ? 'Remove' : 'Prepare'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 3,
    height: 1,
    width: '80%',
  },
});
