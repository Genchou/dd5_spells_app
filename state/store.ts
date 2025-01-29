import { CharacterClass } from '@/types/character-class.type';
import { Spell } from '@/types/spell.type';
import { Tracker } from '@/types/tracker.type';
import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  trackers: Tracker[];
  addTracker: (tracker: Tracker) => void;
  resetTrackers: () => void;
  hideOlderSpells: boolean;
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
  trackers: [],
  addTracker: (tracker: Tracker) => {
    const trackers = store.trackers.get();
    store.trackers.set([...trackers, tracker]);
  },
  resetTrackers: () => store.trackers.set([]),
  sourceColor: undefined,
  useDefaultTheme: true,
  hideOlderSpells: true,
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

syncObservable(store, persistOptions({ persist: { name: 'store' } }));
