import { FC, ReactNode, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableAndroidRippleConfig,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { Text } from './Themed';
import { Colors } from '@/constants/Colors';

type ButtonVariant = 'filled' | 'outlined' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const sizeStyles: Record<ButtonSize, { height: number; fontSize: number; padding: number }> = {
  sm: { height: 32, fontSize: 12, padding: 4 },
  md: { height: 40, fontSize: 14, padding: 8 },
  lg: { height: 48, fontSize: 16, padding: 12 },
};

export const Button: FC<ButtonProps> = ({
  onPress,
  onLongPress,
  variant = 'filled',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyle: () => ViewStyle = useCallback(() => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: isDark ? '#3B82F6' : '#3B82F6',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDark ? '#3B82F6' : '#3B82F6',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  }, [isDark, variant]);

  const getTextColor: () => string = useCallback(() => {
    if (disabled) {
      return isDark ? '#9CA3AF' : '#9CA3AF';
    }
    switch (variant) {
      case 'filled':
        return isDark ? '#fff' : '#fff';
      case 'outlined':
        return isDark ? '#3B82F6' : '#3B82F6';
      case 'ghost':
        return isDark ? '#3B82F6' : '#3B82F6';
      default:
        return '#9CA3AF';
    }
  }, [disabled, isDark, variant]);

  return (
    <Pressable
      disabled={disabled || loading}
      android_ripple={{
        borderless: false,
        color: Colors[colorScheme ?? 'light'].background,
        foreground: true,
      }}
      style={({ pressed }) => [
        styles.button,
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : pressed ? 0.6 : 1,
        },
        style,
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            {
              fontSize: sizeStyles[size].fontSize,
              color: getTextColor(),
              textAlign: 'center',
              marginBottom: 0,
              fontWeight: '700',
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
