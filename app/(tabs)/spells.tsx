import { SpellList } from '@/components/SpellList';
import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Menu, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpellsScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('druid');
  const spells = useSpells(selectedClass);
  const { prepareSpell, preparedSpells } = use$(store);

  useEffect(() => console.log('showMenu', showMenu), [showMenu]);

  const list = useMemo(() => {
    return sectionSpellsByLevel(spells);
  }, [spells]);

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

  const onClassSelect = useCallback((classSelect: CharacterClass) => {
    setSelectedClass(classSelect);
    setShowMenu(false);
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
        }}
      >
        <Menu
          anchorPosition="bottom"
          visible={showMenu}
          anchor={
            <Button icon={'chevron-down'} mode="outlined" onPress={() => setShowMenu(true)}>
              {selectedClass.substring(0, 1).toUpperCase() + selectedClass.substring(1)}
            </Button>
          }
          onDismiss={() => setShowMenu(false)}
        >
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
          style={{ maxWidth: Layout.width * 0.6 }}
          value=""
          onChangeText={() => {}}
        />
      </View>

      <SpellList
        preparedSpells={preparedSpells}
        spells={list}
        onSpellLongPress={onSpellLongPress}
        onSpellPress={onSpellPress}
      />
    </SafeAreaView>
  );
}
