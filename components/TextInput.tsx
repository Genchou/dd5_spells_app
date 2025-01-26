import { zincColors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from './Themed';

type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  onSearchClear?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  variant = 'default',
  size = 'md',
  containerStyle,
  inputStyle,
  disabled = false,
  onSearchClear,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const inputRef = useRef<RNTextInput>(null);

  const sizeStyles: Record<InputSize, { height?: number; fontSize: number; padding: number }> = {
    sm: { fontSize: 16, padding: 8 },
    md: { height: 50, fontSize: 16, padding: 14 },
    lg: { height: 55, fontSize: 32, padding: 16 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: 12,
      backgroundColor: isDark ? zincColors[900] : 'rgb(229, 229, 234)',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[700] : zincColors[100],
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? zincColors[600] : zincColors[200],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? zincColors[500] : zincColors[400];
    }
    return isDark ? zincColors[50] : zincColors[900];
  };

  const onSearchClearPress = useCallback(() => {
    inputRef.current?.clear();
    if (onSearchClear) {
      onSearchClear();
    }
  }, [onSearchClear]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={[getVariantStyle(), disabled && styles.disabled]}>
          <FontAwesome
            color={getTextColor()}
            name="search"
            size={16}
            style={{
              paddingLeft: sizeStyles[size].padding,
              paddingVertical: sizeStyles[size].padding,
            }}
          />
          <RNTextInput
            ref={inputRef}
            editable={!disabled}
            placeholderTextColor={isDark ? zincColors[500] : zincColors[400]}
            style={[
              {
                flex: 1,
                height: sizeStyles[size].height,
                fontSize: sizeStyles[size].fontSize,
                padding: sizeStyles[size].padding,
                color: getTextColor(),
              },
              inputStyle,
            ]}
            {...props}
          />
          {props.value?.length ? (
            <Ionicons
              color={getTextColor()}
              name="close"
              size={16}
              style={{ paddingRight: Layout.padding }}
              onPress={onSearchClearPress}
            />
          ) : null}
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  error: {
    color: '#ef4444', // red-500
    marginTop: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;
