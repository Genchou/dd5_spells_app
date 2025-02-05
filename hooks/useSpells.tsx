import allSpells from '@/assets/all_spells.json';
import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';

export default function useSpells(characterClass: CharacterClass | 'all', useNewRules: boolean = true) {
  const baseList =
    characterClass === 'all' ? allSpells : allSpells.filter((s: Spell) => s.classes.includes(characterClass));
  if (!useNewRules) {
    return baseList.filter((spell: Spell) => {
      return spell.version !== '2024';
    });
  }

  return baseList.reduce((acc: Spell[], curr: Spell) => {
    const index = acc.findIndex((s: Spell) => s.name === curr.name);
    if (index !== -1) {
      acc[index] = curr.version > acc[index].version ? curr : acc[index];
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
}
