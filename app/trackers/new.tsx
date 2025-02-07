import { LayoutContainer } from '@/components/LayoutContainer';
import { CreateTrackerDTO, TrackerForm } from '@/components/TrackerForm';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { randomUUID } from 'expo-crypto';
import { router } from 'expo-router';

export default function NewTrackerScreen() {
  const { addTracker } = use$(store);

  const onSave = (tracker: CreateTrackerDTO) => {
    addTracker({
      ...tracker,
      id: randomUUID(),
    });
    router.back();
  };

  return (
    <LayoutContainer topInset>
      <TrackerForm onSave={onSave} />
    </LayoutContainer>
  );
}
