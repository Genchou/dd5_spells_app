import { getHeaderTitle } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MaterialNavBar({ navigation, route, options, back }: NativeStackHeaderProps) {
  const title = getHeaderTitle(options, route.name);
  const { top } = useSafeAreaInsets();

  const getStyle = useCallback(() => {
    return Platform.OS === 'ios' ? { marginTop: -top } : {};
  }, [top]);

  return (
    <Appbar.Header style={getStyle()}>
      {back && Platform.OS === 'android' ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}
