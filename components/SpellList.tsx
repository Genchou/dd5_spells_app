import { Spell } from '@/types/spell.type';
import { FlashList } from '@shopify/flash-list';
import { FC, useCallback } from 'react';
import { Button, Divider, List, Text } from 'react-native-paper';
import { useAppTheme } from './Material3ThemeProvider';
import { View } from './Themed';
import { Layout } from '@/constants/Layout';
import { Link } from 'expo-router';

interface SpellListProps {
  spells: (string | Spell)[];
  preparedSpells?: Spell[];
  showDuration?: boolean;
  showRange?: boolean;
  showCastingTime?: boolean;
  showComponents?: boolean;
  onSpellPress?: (spell: Spell) => void;
  onSpellLongPress?: (spell: Spell) => void;
}

export const SpellList: FC<SpellListProps> = ({
  spells,
  preparedSpells,
  onSpellLongPress,
  onSpellPress,
  showDuration,
  showRange,
  showCastingTime,
  showComponents,
}) => {
  const theme = useAppTheme();

  const renderItem = useCallback(
    ({ item }: { item: Spell | string }) => {
      if (typeof item === 'string') {
        return (
          <List.Section>
            <List.Subheader>Level {item}</List.Subheader>
            <Divider />
          </List.Section>
        );
      }
      const isPrepared = !!preparedSpells?.find((s) => s.name === item.name);
      const castingTime = showCastingTime ? `${item.casting_time}, ` : '';
      const duration = showDuration ? `${item.duration}, ` : '';
      const range = showRange ? `${item.range}, ` : '';
      const components = showComponents ? `${item.components}, ` : '';
      const descr = `${castingTime}${duration}${range}${components}`;
      return (
        <List.Item
          description={descr.substring(0, descr.length - 2)}
          style={{ backgroundColor: 'transparent' }}
          title={item.name}
          titleStyle={{
            fontWeight: isPrepared ? '700' : 'normal',
            fontStyle: isPrepared ? 'italic' : 'normal',
          }}
          onLongPress={onSpellLongPress ? () => onSpellLongPress(item) : undefined}
          onPress={onSpellPress ? () => onSpellPress(item) : undefined}
        />
      );
    },
    [onSpellLongPress, onSpellPress, preparedSpells, showCastingTime, showComponents, showDuration, showRange]
  );

  return (
    <FlashList
      data={spells}
      extraData={preparedSpells}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: 40,
        backgroundColor: theme.colors.background,
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === 'string' ? 'sectionHeader' : 'row';
      }}
      ListEmptyComponent={
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
    />
  );
};
