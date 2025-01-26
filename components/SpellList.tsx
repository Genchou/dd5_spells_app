import { Colors } from '@/constants/Colors';
import { Spell } from '@/types/spell.type';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { FlashList } from '@shopify/flash-list';
import { FC, useCallback, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Divider, List } from 'react-native-paper';

interface SpellListProps {
  spells: (string | Spell)[];
  preparedSpells?: Spell[];
  onSpellPress?: (spell: Spell) => void;
  onSpellLongPress?: (spell: Spell) => void;
}

export const SpellList: FC<SpellListProps> = ({ spells, preparedSpells, onSpellLongPress, onSpellPress }) => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const [search, setSearch] = useState<string>('');

  const searchResult = useMemo(() => {
    if (search?.length) {
      const normalizedSearch = search.toLowerCase().trim();
      return spells.filter((spell: Spell | string) => {
        if (typeof spell === 'string') {
          return true;
        }
        const normalizedSpell = spell.name.toLowerCase().trim();
        return normalizedSpell.includes(normalizedSearch);
      });
    }
    return spells;
  }, [search, spells]);

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
      return (
        <List.Item
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
    [onSpellLongPress, onSpellPress, preparedSpells]
  );

  return (
    <FlashList
      data={searchResult}
      extraData={preparedSpells}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: 40,
        backgroundColor: theme[colorScheme ?? 'light'].background,
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === 'string' ? 'sectionHeader' : 'row';
      }}
    />
  );
};
