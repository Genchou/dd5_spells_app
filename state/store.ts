import { Spell } from '@/types/spell.type';
import { observable } from '@legendapp/state';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';

interface Store {
  preparedSpells: Spell[];
  prepareSpell: (spell: Spell) => void;
  useSpell: (spell: Spell) => void;
  longRest: () => void;
  shortRest: () => void;
}

export const store = observable<Store>({
  preparedSpells: [],
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
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

syncObservable(store, persistOptions({ persist: { name: 'store' } }));
