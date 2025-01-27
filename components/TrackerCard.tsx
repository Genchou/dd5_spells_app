import { Layout } from '@/constants/Layout';
import { Tracker } from '@/types/tracker.type';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { FC, useRef, useState } from 'react';
import { Animated, Pressable } from 'react-native';
import { IconButton, Menu, Surface, Text } from 'react-native-paper';
import { useReorderableDrag } from 'react-native-reorderable-list';
import { Flex } from './Flex';
import { useAppTheme } from './Material3ThemeProvider';

interface TrackerProps {
  tracker: Tracker;
  onUse: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

export const TrackerCard: FC<TrackerProps> = ({ tracker, onUse, onDelete, onRestore }) => {
  const theme = useAppTheme();
  const drag = useReorderableDrag();
  const elevation = useRef(new Animated.Value(3));
  const [menuVisible, setMenuVisible] = useState(false);

  const getRestoreLabel = () => {
    switch (tracker.restoreWhen) {
      case 'manual':
        return 'Manual';
      case 'short':
        return 'Short rest';
      case 'long':
        return 'Long rest';
      default:
        return 'Manual';
    }
  };

  const onPressIn = () => {
    Animated.spring(elevation.current, {
      toValue: 1,
      tension: 50,
      friction: 150,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(elevation.current, {
      toValue: 3,
      tension: 50,
      friction: 150,
      useNativeDriver: true,
    }).start();
  };

  const onLongPress = () => {
    impactAsync(ImpactFeedbackStyle.Light);
    drag();
  };

  return (
    <Pressable onLongPress={onLongPress} onPress={onUse} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Surface
        elevation={elevation.current}
        style={{
          minHeight: Layout.padding * 4,
          paddingRight: Layout.padding,
          borderRadius: 8,
          marginHorizontal: Layout.padding,
          marginBottom: Layout.padding,
        }}
      >
        <Flex align="center" direction="row" flex={1} style={{ backgroundColor: 'transparent' }}>
          <Menu
            anchorPosition="bottom"
            visible={menuVisible}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={18}
                style={{
                  padding: 0,
                  margin: 0,
                }}
                onPress={() => setMenuVisible(true)}
              />
            }
            onDismiss={() => setMenuVisible(false)}
          >
            <Menu.Item
              leadingIcon="reload"
              title="Restore"
              onPress={() => {
                onRestore && onRestore();
                setMenuVisible(false);
              }}
            />
            <Menu.Item
              leadingIcon="delete-outline"
              title="Remove"
              onPress={() => {
                onDelete && onDelete();
                setMenuVisible(false);
              }}
            />
          </Menu>

          <Flex align="center" direction="row" flex={1} justify="space-between">
            <Flex align="flex-start" direction="column" justify="flex-start">
              <Text style={{ color: theme.colors.onSurface }} variant="titleMedium">
                {tracker.name}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }} variant="labelSmall">
                {getRestoreLabel()}
              </Text>
            </Flex>
            <Text style={{ color: theme.colors.primary }} variant="titleMedium">
              {tracker.value} / {tracker.maxValue}
            </Text>
          </Flex>
        </Flex>
      </Surface>
    </Pressable>
  );
};
