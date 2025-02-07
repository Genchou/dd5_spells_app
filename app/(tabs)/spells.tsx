import { SpellList } from '@/components/SpellList';
import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Menu, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpellsScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState<string>('');
  const { prepareSpell, preparedSpells, selectedClass, useNewRules } = use$(store);
  const spells = useSpells(selectedClass, useNewRules);

  const listRef = useRef<FlashList<Spell | string>>(null);

  const list = useMemo(() => {
    return sectionSpellsByLevel(spells);
  }, [spells]);

  const scrollToTop = () => {
    listRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const searchResult = useMemo(() => {
    if (search?.length) {
      const normalizedSearch = search.toLowerCase().trim();
      return list
        .filter((spell: Spell | string) => {
          if (typeof spell === 'string') {
            return true;
          }
          const normalizedSpell = spell.name.toLowerCase().trim();
          return normalizedSpell.includes(normalizedSearch);
        })
        .reduceRight((acc: (Spell | string)[], curr) => {
          if (typeof curr === 'string') {
            if (acc.length) {
              const last: string | Spell = acc[acc.length - 1];
              if (typeof last !== 'string' && last.level === curr) {
                acc.push(curr);
              }
            }
          } else {
            acc.push(curr);
          }
          return acc;
        }, [])
        .toReversed();
    }
    return list;
  }, [search, list]);

  const onSpellPress = useCallback((spell: Spell) => {
    router.navigate({ pathname: '/spell/[slug]', params: { slug: spell.slug } });
  }, []);

  const onSpellLongPress = useCallback(
    (spell: Spell) => {
      impactAsync(ImpactFeedbackStyle.Light);
      prepareSpell(spell);
    },
    [prepareSpell]
  );

  const onClassSelect = useCallback((classSelect: CharacterClass | 'all') => {
    store.selectedClass.set(classSelect);
    setShowMenu(false);
    scrollToTop();
  }, []);

  const onSearchReset = useCallback(() => {
    setSearch('');
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: Layout.padding / 2,
          paddingRight: Layout.padding,
        }}
      >
        <Button icon="chevron-down" mode="text" onPress={() => setShowMenu(true)}>
          {selectedClass.substring(0, 1).toUpperCase() + selectedClass.substring(1)}
        </Button>
        <Menu anchor={{ x: 10, y: 80 }} anchorPosition="bottom" visible={showMenu} onDismiss={() => setShowMenu(false)}>
          <Menu.Item title="All" onPress={() => onClassSelect('all')} />
          <Menu.Item title="Bard" onPress={() => onClassSelect('bard')} />
          <Menu.Item title="Cleric" onPress={() => onClassSelect('cleric')} />
          <Menu.Item title="Druid" onPress={() => onClassSelect('druid')} />
          <Menu.Item title="Paladin" onPress={() => onClassSelect('paladin')} />
          <Menu.Item title="Ranger" onPress={() => onClassSelect('ranger')} />
          <Menu.Item title="Sorcerer" onPress={() => onClassSelect('sorcerer')} />
          <Menu.Item title="Warlock" onPress={() => onClassSelect('warlock')} />
          <Menu.Item title="Wizard" onPress={() => onClassSelect('wizard')} />
        </Menu>
        <Searchbar
          mode="bar"
          placeholder="Search"
          style={{ width: Layout.width * 0.65 }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <SpellList
        ref={listRef}
        sectionCollapsible
        preparedSpells={preparedSpells}
        spells={searchResult}
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
              No result found.
            </Text>
            <Button mode="contained-tonal" onPress={onSearchReset}>
              Reset search
            </Button>
          </View>
        }
        onSpellLongPress={onSpellLongPress}
        onSpellPress={onSpellPress}
      />
    </SafeAreaView>
  );
}
