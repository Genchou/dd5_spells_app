import { SpellList } from '@/components/SpellList';
import useSpells from '@/hooks/useSpells';
import { store } from '@/state/store';
import { Spell } from '@/types/spell.type';
import { sectionSpellsByLevel } from '@/utils';
import { use$ } from '@legendapp/state/react';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';

export default function SpellsScreen() {
  const spells = useSpells('druid');
  const { prepareSpell, preparedSpells } = use$(store);

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

  return (
    <SpellList
      preparedSpells={preparedSpells}
      spells={list}
      onSpellLongPress={onSpellLongPress}
      onSpellPress={onSpellPress}
    />
  );
}
