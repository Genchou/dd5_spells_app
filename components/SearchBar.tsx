import { FC } from 'react';
import { SearchBar as RNESearchBar } from '@rneui/base';
import { Platform } from 'react-native';
import TextInput from './TextInput';
import { View } from './Themed';

interface SearchBarProps {}

export const SearchBar: FC<SearchBarProps> = () => {
  return (
    <View>
      <TextInput placeholder="Search" variant="outlined" />
      <RNESearchBar placeholder="Search" platform={Platform.OS === 'android' ? 'android' : 'ios'} />
    </View>
  );
};
