import { Spell } from '@/types/spell.type';
import { FlashList } from '@shopify/flash-list';
import { ComponentType, FC, JSXElementConstructor, ReactElement, useCallback } from 'react';
import { Divider, List } from 'react-native-paper';
import { useAppTheme } from './Material3ThemeProvider';

interface SpellListProps {
  spells: (string | Spell)[];
  preparedSpells?: Spell[];
  showDuration?: boolean;
  showRange?: boolean;
  showCastingTime?: boolean;
  showComponents?: boolean;
  onSpellPress?: (spell: Spell) => void;
  onSpellLongPress?: (spell: Spell) => void;
  EmptyListComponent?:
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ComponentType<unknown>
    | null
    | undefined;
}

export const SpellList: FC<SpellListProps> = ({
  spells,
  preparedSpells,
  onSpellLongPress,
  onSpellPress,
  showDuration,
  showRange,
  showCastingTime,
  showComponents,
  EmptyListComponent,
}) => {
  const theme = useAppTheme();

  const renderItem = useCallback(
    ({ item }: { item: Spell | string }) => {
      if (typeof item === 'string') {
        return (
          <List.Section>
            <List.Subheader>Level {item}</List.Subheader>
            <Divider />
          </List.Section>
        );
      }
      const isPrepared = !!preparedSpells?.find((s) => s.name === item.name);
      const castingTime = showCastingTime ? `${item.casting_time}, ` : '';
      const duration = showDuration ? `${item.duration}, ` : '';
      const range = showRange ? `${item.range}, ` : '';
      const components = showComponents ? `${item.components}, ` : '';
      const descr = `${castingTime}${duration}${range}${components}`;
      return (
        <List.Item
          description={descr.substring(0, descr.length - 2)}
          left={() => <List.Icon color={isPrepared ? theme.colors.primary : 'transparent'} icon="bookmark" />}
          style={{ backgroundColor: 'transparent', paddingLeft: 12 }}
          title={item.name}
          titleStyle={{
            fontWeight: isPrepared ? '700' : 'normal',
          }}
          onLongPress={onSpellLongPress ? () => onSpellLongPress(item) : undefined}
          onPress={onSpellPress ? () => onSpellPress(item) : undefined}
        />
      );
    },
    [onSpellLongPress, onSpellPress, preparedSpells, showCastingTime, showComponents, showDuration, showRange, theme]
  );

  return (
    <FlashList
      data={spells}
      extraData={preparedSpells}
      ListEmptyComponent={EmptyListComponent}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: 40,
        backgroundColor: theme.colors.background,
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === 'string' ? 'sectionHeader' : 'row';
      }}
    />
  );
};
