import { Colors, zincColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Spell } from '@/types/spell.type';
import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';
import { Animated, Pressable, useColorScheme } from 'react-native';
import { View } from './Themed';
import { Text } from 'react-native-paper';

interface SpellListItemProps {
  onPress?: () => void;
  onLongPress?: () => void;
  spell: Spell;
  prepared?: boolean;
}

export const SpellListItem: FC<SpellListItemProps> = ({ spell, prepared, onLongPress, onPress }) => {
  const colorScheme = useColorScheme();
  const animated = new Animated.Value(1);

  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 0.4,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      android_ripple={{
        borderless: false,
        color: zincColors[400],
        foreground: true,
      }}
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
      onLongPress={onLongPress}
      onPress={onPress}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: Layout.padding,
          paddingHorizontal: Layout.padding,
          opacity: animated,
        }}
      >
        <Text
          style={{
            fontWeight: '700',
            color: zincColors[colorScheme === 'dark' ? 200 : 700],
          }}
        >
          {spell.name}
          {prepared ? ' [P]' : ''}
        </Text>
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
        <Ionicons color={Colors[colorScheme ?? 'light'].text} name="chevron-forward" size={16} />
      </Animated.View>
      <View style={{ width: Layout.width * 0.9, borderBottomWidth: 1, borderBottomColor: zincColors[700] }} />
    </Pressable>
  );
};
