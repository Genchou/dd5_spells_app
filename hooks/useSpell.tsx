import allSpells from '@/assets/all_spells.json';

export default function useSpell(slug: string) {
  return allSpells.find((s) => s.slug === slug);
}
