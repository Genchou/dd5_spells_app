import { Layout } from '@/constants/Layout';
import { Spell } from '@/types/spell.type';
import { FlashList } from '@shopify/flash-list';
import {
  ComponentType,
  forwardRef,
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { List } from 'react-native-paper';
import { useAppTheme } from './Material3ThemeProvider';

interface SpellListProps {
  spells: (string | Spell)[];
  preparedSpells?: Spell[];
  showDuration?: boolean;
  showRange?: boolean;
  showCastingTime?: boolean;
  showComponents?: boolean;
  sectionCollapsible?: boolean;
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
      sectionCollapsible = false,
    },
    ref
  ) => {
    const theme = useAppTheme();
    const [collapsedLevel, setCollapsedLevel] = useState<string[]>([]);
    const innerRef = useRef<FlashList<Spell | string>>(null);
    useImperativeHandle(ref, () => innerRef.current!, []);

    const shownSpells = useMemo(() => {
      const nonCollapsedSpells = spells.filter((s: Spell | string) => {
        return typeof s === 'string' || !collapsedLevel.includes(s.level);
      });
      return nonCollapsedSpells;
    }, [collapsedLevel, spells]);

    const collapseLevel = useCallback((level: string) => {
      setCollapsedLevel((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
    }, []);

    const stickyHeaderIndices = shownSpells
      .map((item, index) => {
        return typeof item === 'string' ? index : null;
      })
      .filter((item) => item !== null) as number[];

    const renderItem = useCallback(
      ({ item }: { item: Spell | string }) => {
        if (typeof item === 'string') {
          return (
            <List.Item
              title={`Level ${item}`}
              titleStyle={{ color: theme.colors.surfaceTint, paddingLeft: Layout.padding }}
              style={{
                backgroundColor: theme.colors.background,
              }}
              onPress={sectionCollapsible ? () => collapseLevel(item) : undefined}
            />
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
                color={isPrepared ? theme.colors.primary : 'transparent'}
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
      [
        collapseLevel,
        onSpellLongPress,
        onSpellPress,
        preparedSpells,
        sectionCollapsible,
        showCastingTime,
        showComponents,
        showDuration,
        showRange,
        theme.colors.background,
        theme.colors.primary,
        theme.colors.surfaceTint,
      ]
    );

    return (
      <FlashList
        ref={innerRef}
        data={shownSpells}
        extraData={preparedSpells}
        keyExtractor={(item: Spell | string) => (typeof item === 'string' ? `level${item}` : item.slug)}
        ListEmptyComponent={EmptyListComponent}
        renderItem={renderItem}
        stickyHeaderIndices={stickyHeaderIndices}
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
