import React, {useEffect, useReducer, useMemo} from 'react';

import {
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Text,
  Easing,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  LayoutChangeEvent,
  FlatList,
} from 'react-native';

import {styles} from './styles';

import white_chevron from './assets/images/white.png';
import black_chevron from './assets/images/black.png';

export type InnerItem = {
  /**Inner Item id */
  id: string;
  /**Default text for Inner Item */
  name?: string;
  /**Add your custom Inner Item */
  customInnerItem?: JSX.Element;
};

export interface Item {
  /**Item id */
  id: string;
  /**Inner Items */
  subCategory: InnerItem[];
  /**Default text for Item */
  categoryName?: string;
  /**Add your custom Item */
  customItem?: JSX.Element;
}

interface InnerItemClickCallback {
  innerItemIndex: number;
  item: Item;
  itemIndex: number;
}

interface Props {
  /** Data for the expandable listview */
  data: Array<Item>;
  /** Callback for item click */
  onItemClick?: ({index}: {index: number}) => void;
  /** Callback for inner item click */
  onInnerItemClick?: ({
    innerItemIndex,
    item,
    itemIndex,
  }: InnerItemClickCallback) => void;
  /** Add style to whole expandable listview */
  ExpandableListViewStyles?: ViewStyle;
  /** Add style to each inner item container */
  innerItemContainerStyle?: ViewStyle;
  /** Add style to each inner item label */
  innerItemLabelStyle?: TextStyle;
  /** Add style to each item container */
  itemContainerStyle?: ViewStyle;
  /** Add style to each item label */
  itemLabelStyle?: TextStyle;
  /** Add style to the item indicator */
  itemImageIndicatorStyle?: ImageStyle;
  /** Pass the path for your custom indicator */
  customChevron?: string;
  /** Color for default indicator */
  chevronColor?: 'white' | 'black';
  /** Render separator for items */
  renderItemSeparator?: boolean;
  /** Render separator for inner items */
  renderInnerItemSeparator?: boolean;
  /** Add style to the item separator */
  itemSeparatorStyle?: ViewStyle;
  /** Add style to the inner item separator */
  innerItemSeparatorStyle?: ViewStyle;
  /** Set Animation on/off, default on */
  animated?: boolean;
  /** Set your styles to default loader (only for animated={true}) */
  defaultLoaderStyles?: ViewStyle;
  /** Pass your custom loader, while your content is measured and rendered (only for animated={true}) */
  customLoader?: JSX.Element;
}

interface ExpandableListItem {
  item: Item;
  index: number;
}

const initialState = {
  opened: false,
  height: [],
  data: [],
  isMounted: [],
  lastSelectedIndex: -1,
  selectedIndex: -1,
  opacityValues: new Animated.Value(0),
  animatedValues: [],
  rotateValueHolder: [],
};

function reducer(
  state: any,
  action: {
    type: string;
    data?: Item[];
    opened?: boolean;
    height?: [];
    isMounted?: [];
    lastSelectedIndex?: number;
    selectedIndex?: number;
    opacityValues?: Animated.Value;
    animatedValues?: Animated.Value[];
    rotateValueHolder?: Animated.Value[];
  },
) {
  switch (action.type) {
    case 'set':
      return {...state, ...action};
    case 'reset':
      return {
        opened: false,
        height: [],
        data: [],
        isMounted: [],
        lastSelectedIndex: -1,
        selectedIndex: -1,
        opacityValues: new Animated.Value(0),
        animatedValues: [],
        rotateValueHolder: [],
      };
    default:
      return {...state};
  }
}

export const ExpandableListView: React.FC<Props> = ({data,innerItemLabelStyle,renderItemSeparator,renderInnerItemSeparator,onInnerItemClick,onItemClick,defaultLoaderStyles,itemSeparatorStyle,itemLabelStyle,itemImageIndicatorStyle,itemContainerStyle,innerItemSeparatorStyle,innerItemContainerStyle,customLoader,customChevron,animated=true,chevronColor, ExpandableListViewStyles}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const CustomLoader = customLoader;
  useEffect(() => {
    if (state.selectedIndex >= 0) {
      if (state.animatedValues[state.selectedIndex] !== undefined) {
        if (state.selectedIndex !== state.lastSelectedIndex) {
          if (
            state.lastSelectedIndex >= 0 &&
            state.lastSelectedIndex < state.data.length
          ) {
            Animated.parallel([
              Animated.timing(state.animatedValues[state.lastSelectedIndex], {
                useNativeDriver: false,
                duration: 300,
                easing: Easing.linear,
                toValue: 0,
              }),
              Animated.timing(
                state.rotateValueHolder[state.lastSelectedIndex],
                {
                  toValue: 0,
                  duration: 300,
                  easing: Easing.linear,
                  useNativeDriver: true,
                },
              ),
            ]).start();
          }
          Animated.parallel([
            Animated.timing(state.animatedValues[state.selectedIndex], {
              useNativeDriver: false,
              duration: 300,
              easing: Easing.linear,
              toValue: state.height[state.selectedIndex],
            }),
            Animated.timing(state.rotateValueHolder[state.selectedIndex], {
              toValue: 1,
              duration: 300,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.timing(state.animatedValues[state.selectedIndex], {
              useNativeDriver: false,
              duration: 300,
              easing: Easing.linear,
              toValue:
                state.opened &&
                state.height !== undefined &&
                state.height[state.selectedIndex] !== undefined
                  ? state.height[state.selectedIndex]
                  : 0,
            }),
            Animated.timing(state.rotateValueHolder[state.selectedIndex], {
              toValue: state.opened ? 1 : 0,
              duration: 300,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start();
        }
        dispatch({type: 'set', lastSelectedIndex: state.selectedIndex});
      }
    } else {
      if (
        state.isMounted.length === state.data.length &&
        state.data.length > 0
      ) {
        Animated.timing(state.opacityValues, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [
    state.data,
    state.height,
    state.opened,
    state.isMounted,
    state.opacityValues,
    state.animatedValues,
    state.rotateValueHolder,
    state.selectedIndex,
    state.lastSelectedIndex,
  ]);

  useEffect(() => {
    async function reset() {
      await dispatch({type: 'reset'});
      await dispatch({type: 'set', data: data});
    }
    reset();
  }, [data]);

  function handleLayout(evt: LayoutChangeEvent, index: number) {
    if (!state.isMounted[index] && evt.nativeEvent.layout.height !== 0) {
      let h = state.height;
      h[index] = evt.nativeEvent.layout.height;
      let m = state.isMounted;
      m[index] = true;
      let newAnimatedValues: Array<Animated.Value> = [...state.animatedValues];
      let newRotateValueHolder: Array<Animated.Value> = [
        ...state.rotateValueHolder,
      ];
      newAnimatedValues.push(new Animated.Value(0));
      newRotateValueHolder.push(new Animated.Value(0));

      dispatch({
        type: 'set',
        animatedValues: newAnimatedValues,
        rotateValueHolder: newRotateValueHolder,
        height: h,
        isMounted: m,
      });
    }
  }

  function updateLayout(updatedIndex: number) {
    dispatch({
      type: 'set',
      opened: updatedIndex === state.selectedIndex ? !state.opened : true,
      selectedIndex: updatedIndex,
    });

    if (onItemClick) {
      return onItemClick({index: updatedIndex});
    }
    return;
  }

  const List = useMemo(() => Animated.FlatList, []);

  function renderInnerItem(itemO: any, headerItem: Item, headerIndex: number) {
    let {item}: {item: InnerItem} = itemO;
    let {index}: {index: number} = itemO;

    let CustomComponent = item.customInnerItem;

    let container = {
      ...styles.content,
      ...innerItemContainerStyle,
      height: undefined,
    };
    innerItemLabelStyle = {
      ...styles.text,
      ...innerItemLabelStyle,
      height: undefined,
    };

    innerItemSeparatorStyle = {
      ...styles.innerItemSeparator,
      ...innerItemSeparatorStyle,
    };

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          key={Math.random()}
          style={container}
          onPress={() =>
            onInnerItemClick &&
            onInnerItemClick({
              innerItemIndex: index,
              item: headerItem,
              itemIndex: headerIndex,
            })
          }>
          {CustomComponent !== undefined ? (
            CustomComponent
          ) : (
            <Text style={innerItemLabelStyle}>{item.name}</Text>
          )}
        </TouchableOpacity>
        {renderInnerItemSeparator !== undefined &&
          renderInnerItemSeparator &&
          index < headerItem.subCategory.length - 1 && (
            <View style={innerItemSeparatorStyle} />
          )}
      </>
    );
  }

  function renderItem({item, index}: ExpandableListItem) {

    itemContainerStyle = {
      ...styles.header,
      ...itemContainerStyle,
      height: undefined,
    };
    itemLabelStyle = {
      ...styles.headerText,
      ...itemLabelStyle,
    };
    itemImageIndicatorStyle = {
      height: 15,
      width: 15,
      marginHorizontal: 5,
      ...itemImageIndicatorStyle,
    };

    itemSeparatorStyle = {...styles.headerSeparator, ...itemSeparatorStyle};

    let CustomComponent = item.customItem;
    return (
      <Animated.View
        style={{
          height: undefined,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => updateLayout(index)}
          style={itemContainerStyle}>
          {CustomComponent !== undefined ? (
            CustomComponent
          ) : (
            <>
              <Animated.Image
                source={
                  customChevron !== undefined
                    ? customChevron
                    : chevronColor !== undefined &&
                      chevronColor === 'white'
                    ? white_chevron
                    : black_chevron
                }
                resizeMethod="scale"
                resizeMode="contain"
                style={[
                  itemImageIndicatorStyle,
                  animated === undefined ||
                  (animated !== undefined && animated)
                    ? state.rotateValueHolder[index] !== undefined && {
                        transform: [
                          {
                            rotate: state.rotateValueHolder[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '90deg'],
                            }),
                          },
                        ],
                      }
                    : {
                        transform: [
                          {
                            rotate:
                              state.opened && index === state.selectedIndex
                                ? '90deg'
                                : '0deg',
                          },
                        ],
                      },
                ]}
              />

              <Text style={itemLabelStyle}>{item.categoryName}</Text>
            </>
          )}
        </TouchableOpacity>

        <Animated.View
          style={[
            animated === undefined ||
            (animated !== undefined && animated)
              ? // eslint-disable-next-line react-native/no-inline-styles
                {
                  height: !state.isMounted[index]
                    ? undefined
                    : state.animatedValues[index],
                  overflow: 'hidden',
                }
              : // eslint-disable-next-line react-native/no-inline-styles
                {
                  display:
                    state.opened && index === state.selectedIndex
                      ? 'flex'
                      : 'none',
                  overflow: 'hidden',
                },
          ]}
          onLayout={(evt: any) => handleLayout(evt, index)}>
          <FlatList
            style={{height: undefined}}
            contentContainerStyle={{height: undefined}}
            updateCellsBatchingPeriod={50}
            initialNumToRender={50}
            windowSize={50}
            maxToRenderPerBatch={50}
            keyExtractor={() => Math.random().toString()}
            listKey={String(Math.random())}
            data={item.subCategory}
            renderItem={(innerItem: any) =>
              renderInnerItem(innerItem, item, index)
            }
          />
        </Animated.View>

        {renderItemSeparator !== undefined &&
          renderItemSeparator &&
          (!state.opened || state.selectedIndex !== index) &&
          index < state.data.length - 1 && <View style={itemSeparatorStyle} />}
      </Animated.View>
    );
  }

  return (
    <>
    {animated && data.length >0 && state.isMounted[data.length -1] === undefined && (CustomLoader !== undefined ? CustomLoader : <ActivityIndicator style={defaultLoaderStyles} color="#94bfda" size="large" />)}

    <Animated.View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          opacity:
            animated === undefined ||
            (animated !== undefined && animated)
              ? state.isMounted.length === state.data.length &&
                data.length > 0
                ? state.opacityValues
                : 0
              : 1,
        },
        {...ExpandableListViewStyles},
        {height: animated && data.length >0 && state.isMounted[data.length -1] === undefined ? 0 : ExpandableListViewStyles?.height !== undefined ? ExpandableListViewStyles?.height : 'auto'},
      ]}>


      <List
        updateCellsBatchingPeriod={50}
        initialNumToRender={50}
        windowSize={50}
        maxToRenderPerBatch={50}
        keyExtractor={(_: any, itemIndex: number) => itemIndex.toString()}
        data={state.data}
        renderItem={(item: ExpandableListItem) => renderItem(item)}
      />
    </Animated.View>
    </>
  );
};
