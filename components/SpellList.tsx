import { Spell } from '@/types/spell.type';
import { FlashList } from '@shopify/flash-list';
import { ComponentType, forwardRef, JSXElementConstructor, ReactElement, useCallback } from 'react';
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

export const SpellList = forwardRef<FlashList<Spell | string>, SpellListProps>(
  (
    {
      spells,
      preparedSpells,
      onSpellLongPress,
      onSpellPress,
      showDuration,
      showRange,
      showCastingTime,
      showComponents,
      EmptyListComponent,
    },
    ref
  ) => {
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
        const version = `(${item.version})  `;
        const isPrepared = !!preparedSpells?.find((s) => s.slug === item.slug);
        const castingTime = showCastingTime ? `${item.casting_time}, ` : '';
        const duration = showDuration ? `${item.duration}, ` : '';
        const range = showRange ? `${item.range}, ` : '';
        const components = showComponents ? `${item.components}, ` : '';
        const descr = `${version}${castingTime}${duration}${range}${components}`;
        return (
          <List.Item
            description={descr.substring(0, descr.length - 2)}
            style={{ backgroundColor: 'transparent', paddingLeft: 12 }}
            title={item.name}
            left={() => (
              <List.Icon
                color={isPrepared ? theme.colors.primary : theme.colors.surfaceDim}
                icon={isPrepared ? 'bookmark' : 'bookmark-outline'}
              />
            )}
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
        ref={ref}
        data={spells}
        extraData={preparedSpells}
        keyExtractor={(item: Spell | string) => (typeof item === 'string' ? `level${item}` : item.slug)}
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
  }
);

SpellList.displayName = 'SpelList';
