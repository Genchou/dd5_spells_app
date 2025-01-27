import { View } from '@/components/Themed';
import { TrackerCard } from '@/components/TrackerCard';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { Tracker } from '@/types/tracker.type';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { Button, FAB } from 'react-native-paper';
import ReorderableList, { reorderItems } from 'react-native-reorderable-list';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackersScreen() {
  const { trackers } = use$(store);

  const onShortRest = () => {
    const newTrackers = [...trackers];
    newTrackers.forEach((t) => {
      if (t.restoreWhen === 'short') {
        t.value = t.maxValue;
      }
    });
    store.trackers.set(newTrackers);
  };

  const onLongRest = () => {
    const newTrackers = trackers.map((t) => ({ ...t, value: t.restoreWhen !== 'manual' ? t.maxValue : t.value }));
    store.trackers.set(newTrackers);
  };

  const onRestore = (tracker: Tracker) => {
    const newTrackers = [...trackers];
    newTrackers.forEach((t) => {
      if (t.id === tracker.id) {
        t.value = t.maxValue;
      }
    });
    store.trackers.set(newTrackers);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: Layout.padding,
          marginVertical: Layout.padding,
        }}
      >
        <View style={{ flex: 5 }} />
        <Button mode="contained-tonal" onPress={onShortRest}>
          Short Rest
        </Button>
        <View style={{ flex: 1 }} />
        <Button mode="contained-tonal" onPress={onLongRest}>
          Long Rest
        </Button>
      </View>

      <ReorderableList
        contentContainerStyle={{ paddingVertical: Layout.padding }}
        data={trackers}
        keyExtractor={(item) => item.id}
        cellAnimations={{
          opacity: 1,
        }}
        renderItem={({ item, index }) => (
          <TrackerCard
            tracker={item}
            onDelete={() => store.trackers.set((prev) => prev.filter((t) => t.id !== item.id))}
            onRestore={() => onRestore(item)}
            onUse={() =>
              store.trackers.set((prev) => {
                const newTrackers = [...prev];
                const current = {
                  ...item,
                  value: item.value > 0 ? item.value - 1 : 0,
                };
                newTrackers.splice(index, 1, current);
                return newTrackers;
              })
            }
          />
        )}
        onReorder={({ from, to }) => {
          store.trackers.set((prev) => reorderItems(prev, from, to));
        }}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: Layout.padding, right: Layout.padding }}
        onPress={() => router.navigate('/new-tracker')}
      />
    </SafeAreaView>
  );
}
