import { Layout } from '@/constants/Layout';
import { Tracker } from '@/types/tracker.type';
import { FC, useCallback, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';

export type CreateTrackerDTO = {
  name: string;
  value: number;
  maxValue: number;
  restoreWhen: 'short' | 'long' | 'manual';
};

type TrackerFormProps = {
  onSave: (tracker: CreateTrackerDTO) => void;
  tracker?: Tracker;
};

export const TrackerForm: FC<TrackerFormProps> = ({ onSave, tracker }) => {
  const [name, setName] = useState(tracker?.name ?? '');
  const [maxValue, setMaxValue] = useState(tracker?.maxValue?.toString() ?? '');
  const [restoreWhen, setRestoreWhen] = useState<'short' | 'long' | 'manual'>(tracker?.restoreWhen ?? 'short');
  const [errors, setErrors] = useState<(string | null)[]>();

  const hasError = (index: number) => {
    return errors && !!errors[index];
  };

  const onSavePress = useCallback(() => {
    const err: (string | null)[] = [null, null];
    if (!name?.length) {
      err[0] = 'Name required';
    }
    if (!maxValue?.length || +maxValue <= 0) {
      err[1] = 'Max value required and must be higher than 0';
    }
    setErrors(err);
    if (err.filter((e) => !!e).length === 0) {
      onSave({
        name,
        value: +maxValue,
        maxValue: +maxValue,
        restoreWhen,
      });
    }
  }, [maxValue, name, onSave, restoreWhen]);

  return (
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
        <Text variant="labelMedium">
          Manual requires you to manually restore the tracker, while short/long rest will be restored on a rest. Long
          rests will always restore short and long rest trackers.
        </Text>
      </View>

      <KeyboardAvoidingView behavior="height" style={{ paddingTop: Layout.padding }}>
        <Button mode="contained-tonal" onPress={onSavePress}>
          Save
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
};
