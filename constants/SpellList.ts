import { Spell } from '@/types/spell.type';

const loadSpells = async () => {
  const druidSpells: Spell[] = await require('@/assets/druid_spells.json');
  const clericSpells: Spell[] = await require('@/assets/cleric_spells.json');
  const bardSpells: Spell[] = await require('@/assets/bard_spells.json');
  const paladinSpells: Spell[] = await require('@/assets/paladin_spells.json');
  const wizardSpells: Spell[] = await require('@/assets/wizard_spells.json');
  const sorcererSpells: Spell[] = await require('@/assets/sorcerer_spells.json');
  const rangerSpells: Spell[] = await require('@/assets/ranger_spells.json');

  return {
    druidSpells,
  };
};
