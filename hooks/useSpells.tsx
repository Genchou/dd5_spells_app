import allSpells from '@/assets/all_spells.json';
import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';

export default function useSpells(characterClass: CharacterClass | 'all') {
  if (characterClass === 'all') {
    return allSpells;
  }
  return allSpells.filter((s: Spell) => s.classes.includes(characterClass));
}
