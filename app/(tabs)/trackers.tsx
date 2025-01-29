import { View } from '@/components/Themed';
import { TrackerCard } from '@/components/TrackerCard';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { Tracker } from '@/types/tracker.type';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Button, FAB } from 'react-native-paper';
import ReorderableList, { reorderItems } from 'react-native-reorderable-list';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrackersScreen() {
  const { trackers } = use$(store);

  const onShortRest = useCallback(() => {
    store.trackers.set((prev) => {
      return prev.map((t) => ({
        ...t,
        value: t.restoreWhen === 'short' ? t.maxValue : t.value,
      }));
    });
  }, []);

  const onLongRest = useCallback(() => {
    store.trackers.set((prev) =>
      prev.map((t) => ({
        ...t,
        value: t.restoreWhen !== 'manual' ? t.maxValue : t.value,
      }))
    );
  }, []);

  const onUse = useCallback((tracker: Tracker) => {
    store.trackers.set((prev) => {
      return prev.map((t) => ({
        ...t,
        value: t.id === tracker.id && t.value > 0 ? t.value - 1 : t.value,
      }));
    });
  }, []);

  const onRestore = useCallback(
    (tracker: Tracker) => {
      const newTrackers = [...trackers];
      newTrackers.forEach((t) => {
        if (t.id === tracker.id) {
          t.value = t.maxValue;
        }
      });
      store.trackers.set(newTrackers);
    },
    [trackers]
  );

  const onReorder = useCallback(({ from, to }: { from: number; to: number }) => {
    store.trackers.set((prev) => reorderItems(prev, from, to));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Tracker; index: number }) => {
      return (
        <TrackerCard
          tracker={item}
          onDelete={() => store.trackers.set((prev) => prev.filter((t) => t.id !== item.id))}
          onRestore={() => onRestore(item)}
          onUse={() => onUse(item)}
        />
      );
    },
    [onRestore, onUse]
  );

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
          Short rest
        </Button>
        <View style={{ flex: 1 }} />
        <Button mode="contained-tonal" onPress={onLongRest}>
          Long rest
        </Button>
      </View>

      <ReorderableList
        contentContainerStyle={{ paddingVertical: Layout.padding }}
        data={trackers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        cellAnimations={{
          opacity: 1,
        }}
        onReorder={onReorder}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', bottom: Layout.padding, right: Layout.padding }}
        onPress={() => router.navigate('/new-tracker')}
      />
    </SafeAreaView>
  );
}
