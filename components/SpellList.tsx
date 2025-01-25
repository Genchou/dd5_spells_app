import { Colors, zincColors } from '@/constants/Colors';
import { Spell } from '@/types/spell.type';
import { FlashList } from '@shopify/flash-list';
import { FC, useCallback, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SpellListItem } from './SpellListItem';
import { Text, View } from './Themed';
import { Layout } from '@/constants/Layout';
import TextInput from './TextInput';

interface SpellListProps {
  spells: (string | Spell)[];
  preparedSpells?: Spell[];
  onSpellPress?: (spell: Spell) => void;
  onSpellLongPress?: (spell: Spell) => void;
}

export const SpellList: FC<SpellListProps> = ({ spells, preparedSpells, onSpellLongPress, onSpellPress }) => {
  const colorScheme = useColorScheme();
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
          <View style={{ paddingVertical: Layout.padding / 1.5, paddingHorizontal: Layout.padding }}>
            <Text>Level {item}</Text>
          </View>
        );
      }
      return (
        <SpellListItem
          prepared={!!preparedSpells?.find((s) => s.name === item.name)}
          spell={item}
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
        paddingVertical: 40,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === 'string' ? 'sectionHeader' : 'row';
      }}
      ListHeaderComponent={
        <TextInput
          placeholder="Search"
          value={search}
          variant="filled"
          containerStyle={{
            paddingVertical: Layout.padding / 4,
            paddingHorizontal: Layout.padding / 2,
          }}
          onChangeText={setSearch}
        />
      }
    />
  );
};
