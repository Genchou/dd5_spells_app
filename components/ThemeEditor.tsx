import { useColorScheme } from 'react-native';
import { IconButton, Switch, Text, TouchableRipple } from 'react-native-paper';
import { useMaterial3ThemeContext } from './Material3ThemeProvider';
import { Flex } from './Flex';
import { isDynamicThemeSupported } from '@pchmn/expo-material3-theme';
import { observable } from '@legendapp/state';
import { store } from '@/state/store';
import { useEffect } from 'react';
import { use$ } from '@legendapp/state/react';

const colors = [
  {
    light: '#FFE082',
    dark: '#FFE082',
  },
  {
    light: '#3E8260',
    dark: '#ADF2C7',
  },
  {
    light: '#756FAB',
    dark: '#E5DFFF',
  },
  {
    light: '#9F6C2C',
    dark: '#FDDDB9',
  },
];

export function ThemeEditor() {
  const colorScheme = useColorScheme();
  const { updateTheme, resetTheme } = useMaterial3ThemeContext();
  const { useDefaultTheme, sourceColor } = use$(store);

  const handleUseDefaultThemeChange = (value: boolean) => {
    if (value) {
      resetTheme();
      store.sourceColor.set(undefined);
    }
    store.useDefaultTheme.set(value);
  };

  const handleSourceColorChange = (color: string) => {
    store.sourceColor.set(color);
    updateTheme(color);
  };

  return (
    <Flex gap={20} style={{ paddingTop: 20 }}>
      {isDynamicThemeSupported && (
        <Flex direction="row" justify="space-between">
          <Text variant="titleSmall">Use default theme</Text>
          <Switch value={useDefaultTheme} onValueChange={handleUseDefaultThemeChange} />
        </Flex>
      )}

      <Flex gap={20}>
        <Text variant="titleSmall">Select source color</Text>
        <Flex direction="row" gap={20} justify="center">
          {colors.map(({ light, dark }) => {
            const color = colorScheme === 'dark' ? dark : light;
            return (
              <TouchableRipple
                key={color}
                borderless
                disabled={useDefaultTheme}
                rippleColor="rgba(0, 0, 0, .32)"
                style={{ height: 50, width: 50, borderRadius: 50 }}
                onPress={() => handleSourceColorChange(color)}
              >
                <Flex
                  align="center"
                  backgroundColor={color}
                  justify="center"
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                    opacity: useDefaultTheme ? 0.5 : 1,
                  }}
                >
                  {sourceColor && [light, dark].includes(sourceColor) && (
                    <IconButton icon="check" iconColor="#000" size={20} />
                  )}
                </Flex>
              </TouchableRipple>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}
