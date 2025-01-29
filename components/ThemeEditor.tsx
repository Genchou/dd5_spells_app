import { backgroundColors } from '@/constants/Colors';
import { store } from '@/state/store';
import { use$ } from '@legendapp/state/react';
import { isDynamicThemeSupported } from '@pchmn/expo-material3-theme';
import { ScrollView, useColorScheme } from 'react-native';
import { IconButton, Switch, Text, TouchableRipple } from 'react-native-paper';
import { Flex } from './Flex';
import { useMaterial3ThemeContext } from './Material3ThemeProvider';
import { Layout } from '@/constants/Layout';

const colors = [
  ...backgroundColors
    .filter((_, index) => (index + 1) % 8 === 0)
    .map((color) => ({
      light: color,
      dark: color,
    })),
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

  const customDisabled = isDynamicThemeSupported && useDefaultTheme;

  return (
    <Flex gap={20} style={{ paddingTop: Layout.padding }}>
      {isDynamicThemeSupported && (
        <Flex direction="row" justify="space-between" style={{ marginHorizontal: Layout.padding * 2 }}>
          <Text variant="titleSmall">Use default theme</Text>
          <Switch value={useDefaultTheme} onValueChange={handleUseDefaultThemeChange} />
        </Flex>
      )}

      <Flex gap={20}>
        <Text style={{ marginLeft: Layout.padding * 2 }} variant="titleSmall">
          Select source color
        </Text>
        <ScrollView horizontal>
          {colors.map(({ light, dark }) => {
            const color = colorScheme === 'dark' ? dark : light;
            return (
              <TouchableRipple
                key={color}
                borderless
                disabled={customDisabled}
                rippleColor="rgba(0, 0, 0, .32)"
                style={{ height: 50, width: 50, borderRadius: 50, marginRight: 4 }}
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
                    opacity: customDisabled ? 0.5 : 1,
                  }}
                >
                  {sourceColor && [light, dark].includes(sourceColor) && (
                    <IconButton icon="check" iconColor="#000" size={20} />
                  )}
                </Flex>
              </TouchableRipple>
            );
          })}
        </ScrollView>
      </Flex>
    </Flex>
  );
}
