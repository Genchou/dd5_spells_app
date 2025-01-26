import { SpellList } from '@/components/SpellList';
import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';
import { sectionSpellsByLevel } from '@/utils';
import { observable } from '@legendapp/state';
import { use$ } from '@legendapp/state/react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Button, Menu, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpellsScreen() {
  const [showMenu, setShowMenu] = useState(false);
  // const [selectedClass, setSelectedClass] = useState<CharacterClass | 'all'>('all');
  const selectedClass = observable(store.selectedClass);
  const [search, setSearch] = useState<string>('');
  const spells = useSpells(selectedClass.get());
  const { prepareSpell, preparedSpells } = use$(store);

  const list = useMemo(() => {
    return sectionSpellsByLevel(spells);
  }, [spells]);

  const searchResult = useMemo(() => {
    if (search?.length) {
      const normalizedSearch = search.toLowerCase().trim();
      return list.filter((spell: Spell | string) => {
        if (typeof spell === 'string') {
          return true;
        }
        const normalizedSpell = spell.name.toLowerCase().trim();
        return normalizedSpell.includes(normalizedSearch);
      });
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

  const onClassSelect = useCallback(
    (classSelect: CharacterClass | 'all') => {
      selectedClass.set(classSelect);
      setShowMenu(false);
    },
    [selectedClass]
  );

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
          paddingRight: Layout.padding / 2,
        }}
      >
        <Button icon="chevron-down" mode="text" onPress={() => setShowMenu(true)}>
          {selectedClass.get().substring(0, 1).toUpperCase() + selectedClass.get().substring(1)}
        </Button>
        <Menu anchor={{ x: 10, y: 80 }} anchorPosition="bottom" visible={showMenu} onDismiss={() => setShowMenu(false)}>
          <Menu.Item title="Bard" onPress={() => onClassSelect('bard')} />
          <Menu.Item title="Cleric" onPress={() => onClassSelect('cleric')} />
          <Menu.Item title="Druid" onPress={() => onClassSelect('druid')} />
          <Menu.Item title="Paladin" onPress={() => onClassSelect('paladin')} />
          <Menu.Item title="Ranger" onPress={() => onClassSelect('ranger')} />
          <Menu.Item title="Sorcerer" onPress={() => onClassSelect('sorcerer')} />
          <Menu.Item title="Warlock" onPress={() => onClassSelect('warlock')} />
          <Menu.Item title="Wizard" onPress={() => onClassSelect('wizard')} />

          <Menu.Item title="All" onPress={() => onClassSelect('all')} />
        </Menu>
        <Searchbar
          mode="bar"
          placeholder="Search"
          style={{ maxWidth: Layout.width * 0.6 }}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <SpellList
        preparedSpells={preparedSpells}
        spells={searchResult}
        onSpellLongPress={onSpellLongPress}
        onSpellPress={onSpellPress}
      />
    </SafeAreaView>
  );
}
