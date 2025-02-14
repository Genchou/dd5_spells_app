import { Flex } from '@/components/Flex';
import { LayoutContainer } from '@/components/LayoutContainer';
import { useAppTheme } from '@/components/Material3ThemeProvider';
import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpell from '@/hooks/useSpell';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { Button, Chip, Divider, FAB, Text } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';

export default function SpellScreen() {
  const theme = useAppTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const spell = useSpell(slug);

  const { preparedSpells, prepareSpell } = use$(store);

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
    <LayoutContainer>
      <ScrollView
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignContent: 'center',
          paddingHorizontal: Layout.padding,
          paddingBottom: Layout.padding * 5,
        }}
      >
        <Stack.Screen
          options={{
            title: spell?.name ?? 'Spell',
          }}
        />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Level
          </Text>
          <Text variant="titleMedium">{spell.level}</Text>
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Casting time
          </Text>
          <Text variant="titleMedium">{spell.casting_time}</Text>
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Range
          </Text>
          <Text variant="titleMedium">{spell.range}</Text>
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Components
          </Text>
          <Text variant="titleMedium">{spell.components}</Text>
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Duration
          </Text>
          <Text variant="titleMedium">{spell.duration}</Text>
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <RenderHTML
            contentWidth={Layout.width}
            defaultTextProps={{
              style: {
                fontFamily: 'Inter_400Regular',
                color: theme.colors.onSurface,
                fontSize: 14.5,
                lineHeight: 20,
              },
            }}
            source={{
              html: spell.description,
            }}
          />
        </View>

        <Divider />

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Classes
          </Text>
          <Flex direction="row" wrap="wrap">
            {spell.classes.map((c, index) => (
              <Chip key={index} style={{ marginLeft: Layout.padding / 4, marginTop: 4 }}>
                {c}
              </Chip>
            ))}
          </Flex>
        </View>

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Source
          </Text>
          <Text variant="titleMedium">{spell.source}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Version
          </Text>
          <Text variant="titleMedium">{spell.version}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={{ color: theme.colors.primary }} variant="titleSmall">
            Link
          </Text>
          <Button mode="text" onPress={() => Linking.openURL(spell.link)}>
            {spell.link}
          </Button>
        </View>
      </ScrollView>
      <FAB
        icon={isPrepared ? 'bookmark' : 'bookmark-outline'}
        style={{
          position: 'absolute',
          bottom: Layout.padding * 1.5,
          right: Layout.padding,
        }}
        onPress={onPrepare}
      />
    </LayoutContainer>
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
