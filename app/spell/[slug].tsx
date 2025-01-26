import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';

export default function SpellScreen() {
  const colorScheme = useColorScheme();
  const { theme: m3Theme } = useMaterial3Theme();
  const theme = m3Theme[colorScheme ?? 'light'];
  const { slug } = useLocalSearchParams();
  const spells = useSpells('all');

  const { preparedSpells, prepareSpell } = use$(store);

  const spell = useMemo(() => spells.find((s) => s.slug === slug), [slug, spells]);
  const isPrepared = useMemo(() => !!preparedSpells.find((s) => s.name === spell?.name), [preparedSpells, spell]);

  const onPrepare = useCallback(() => {
    if (spell) {
      prepareSpell(spell);
    }
    router.back();
  }, [prepareSpell, spell]);

  useEffect(() => {
    // setBackgroundColorAsync(theme.background);
  }, [theme]);

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
          // statusBarBackgroundColor: theme.surfaceContainer,
          title: spell?.name ?? 'Spell',
        }}
      />

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.primary }} variant="titleMedium">
          Level
        </Text>
        <Text style={{ paddingLeft: Layout.padding }} variant="bodyMedium">
          {spell.level}
        </Text>
      </View>

      <Divider />

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.primary }} variant="titleMedium">
          Casting time
        </Text>
        <Text style={{ paddingLeft: Layout.padding }} variant="bodyMedium">
          {spell.casting_time}
        </Text>
      </View>

      <Divider />

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.primary }} variant="titleMedium">
          Range
        </Text>
        <Text style={{ paddingLeft: Layout.padding }} variant="bodyMedium">
          {spell.range}
        </Text>
      </View>

      <Divider />

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.primary }} variant="titleMedium">
          Components
        </Text>
        <Text style={{ paddingLeft: Layout.padding }} variant="bodyMedium">
          {spell.components}
        </Text>
      </View>

      <Divider />

      <View style={styles.infoContainer}>
        <Text style={{ color: theme.primary }} variant="titleMedium">
          Duration
        </Text>
        <Text style={{ paddingLeft: Layout.padding }} variant="bodyMedium">
          {spell.duration}
        </Text>
      </View>

      <Divider />

      <View style={styles.infoContainer}>
        <Text variant="bodyMedium">{spell.description}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button mode="elevated" style={{ marginBottom: Layout.padding }} onPress={onPrepare}>
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
  infoContainer: {
    paddingVertical: Layout.padding / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
