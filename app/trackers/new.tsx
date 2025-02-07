import { View } from '@/components/Themed';
import { Layout } from '@/constants/Layout';
import { store } from '@/state/store';
import { Tracker } from '@/types/tracker.type';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { randomUUID } from 'expo-crypto';
import { CreateTrackerDTO, TrackerForm } from '@/components/TrackerForm';
import { LayoutContainer } from '@/components/LayoutContainer';

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
