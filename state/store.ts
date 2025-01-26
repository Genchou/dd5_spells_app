import { Spell } from '@/types/spell.type';
import { observable } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { CharacterClass } from '@/types/character-class.type';

interface Store {
  preparedSpells: Spell[];
  prepareSpell: (spell: Spell) => void;
  useSpell: (spell: Spell) => void;
  longRest: () => void;
  shortRest: () => void;
  resetSpells: () => void;
  selectedClass: CharacterClass | 'all';
  selectClass: (selected: CharacterClass | 'all') => void;
  sourceColor: string | undefined;
  useDefaultTheme: boolean;
}

export const store = observable<Store>({
  selectedClass: 'all',
  selectClass: (selected: CharacterClass | 'all') => {
    store.selectedClass.set(selected);
  },
  preparedSpells: [],
  resetSpells: () => {
    store.preparedSpells.set([]);
  },
  prepareSpell: (spell: Spell) => {
    const filteredList = store.preparedSpells.get().filter((s) => s.slug !== spell.slug);
    if (filteredList.length === store.preparedSpells.length) {
      store.preparedSpells.set([...store.preparedSpells.get(), spell]);
    } else {
      store.preparedSpells.set(filteredList);
    }
  },
  useSpell: (spell: Spell) => console.log('Using spell', spell.slug),
  longRest: () => null,
  shortRest: () => null,
  sourceColor: undefined,
  useDefaultTheme: true,
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

syncObservable(store, persistOptions({ persist: { name: 'store' } }));
