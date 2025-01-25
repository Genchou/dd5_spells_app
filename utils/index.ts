import { Spell } from '@/types/spell.type';

export function sectionSpellsByLevel(spells: Spell[]): (string | Spell)[] {
  const levels = spells
    .reduce((acc: number[], curr: Spell) => {
      if (!acc.includes(+curr.level)) {
        acc.push(+curr.level);
      }
      return acc;
    }, [])
    .sort((a: number, b: number) => a - b);

  return levels.flatMap((level: number) => {
    const filteredSpells = spells.filter((s: Spell) => s.level === level.toString());
    return [level.toString(), ...filteredSpells.sort((a, b) => (a.slug < b.slug ? -1 : 1))];
  });
}
