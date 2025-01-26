import { Spell } from './spell.type';

export type Character = {
  name: string;
  knownSpells: Spell[];
  preparedSpells: Spell[];
};
