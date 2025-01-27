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

export default function NewTrackerScreen() {
  const { addTracker } = use$(store);
  const [name, setName] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [restoreWhen, setRestoreWhen] = useState<'short' | 'long' | 'manual'>('short');
  const [errors, setErrors] = useState<(string | null)[]>();

  const hasError = (index: number) => {
    return errors && !!errors[index];
  };

  const onSave = () => {
    const err: (string | null)[] = [null, null];
    if (!name?.length) {
      err[0] = 'Name required';
    }
    if (!maxValue?.length || +maxValue <= 0) {
      err[1] = 'Max value required and must be higher than 0';
    }
    console.log(errors);
    setErrors(err);
    if (err.filter((e) => !!e).length === 0) {
      const tracker: Tracker = {
        id: Math.random().toString(),
        name,
        value: +maxValue,
        maxValue: +maxValue,
        restoreWhen,
      };
      addTracker(tracker);
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'flex-start',
          marginHorizontal: Layout.padding,
          marginBottom: Layout.padding,
        }}
      >
        <TextInput error={hasError(0)} label="Name" mode="outlined" value={name} onChangeText={setName} />
        <HelperText type="error" visible={hasError(0)}>
          {errors?.length && errors[0]}
        </HelperText>

        <TextInput
          error={hasError(1)}
          keyboardType="decimal-pad"
          label="Max Value"
          mode="outlined"
          value={maxValue}
          onChangeText={setMaxValue}
        />
        <HelperText type="error" visible={hasError(1)}>
          {errors?.length && errors[1]}
        </HelperText>
        <SegmentedButtons
          value={restoreWhen}
          buttons={[
            {
              value: 'short',
              showSelectedCheck: true,
              label: 'Short rest',
            },
            {
              value: 'long',
              showSelectedCheck: true,
              label: 'Long rest',
            },
            {
              value: 'manual',
              showSelectedCheck: true,
              label: 'Manual',
            },
          ]}
          onValueChange={(value: 'short' | 'long' | 'manual') => setRestoreWhen(value)}
        />
        <View style={{ paddingHorizontal: Layout.padding / 2, paddingTop: Layout.padding / 2 }}>
          <Text variant="labelMedium">How value is restored.</Text>
          <Text variant="labelMedium">
            Manual requires you to manually restore the value, short and long rests restore the rest.
          </Text>
        </View>

        <KeyboardAvoidingView behavior="height" style={{ paddingTop: Layout.padding }}>
          <Button mode="contained-tonal" onPress={onSave}>
            Save
          </Button>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
