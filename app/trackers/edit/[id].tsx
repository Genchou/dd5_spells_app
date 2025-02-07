import { LayoutContainer } from '@/components/LayoutContainer';
import { CreateTrackerDTO, TrackerForm } from '@/components/TrackerForm';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator } from 'react-native-paper';

export default function EditTrackerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trackers, modifyTracker } = use$(store);

  const tracker = useMemo(() => {
    return trackers.find((t) => t.id === id);
  }, [id, trackers]);

  const onSave = useCallback(
    (updatedTracker: CreateTrackerDTO) => {
      if (tracker) {
        modifyTracker({
          ...updatedTracker,
          id,
        });
        router.back();
      }
    },
    [id, modifyTracker, tracker]
  );

  if (!tracker) {
    return <ActivityIndicator />;
  }

  return (
    <LayoutContainer>
      <Stack.Screen
        options={{
          title: tracker.name,
        }}
      />
      <TrackerForm tracker={tracker} onSave={onSave} />
    </LayoutContainer>
  );
}
