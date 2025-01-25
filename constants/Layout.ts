import { Dimensions } from 'react-native';

export const Layout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  padding: Dimensions.get('window').width / 24,
};
