import React, {useEffect, useReducer, useMemo} from 'react';

import {
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

import * as Animatable from 'react-native-animatable';

import styles from './styles';

import White from './assets/images/chevron_white.svg';

export interface InnerItem extends Object {
  /**Inner Item id */
  id: string;
  /**Default text for Inner Item */
  name?: string;
  /**Add your custom Inner Item */
  customInnerItem?: JSX.Element;
}

export interface Item extends Object {
  /**Item id */
  id: string;
  /**Inner Items */
  subCategory: InnerItem[];
  /**Default text for Item */
  categoryName?: string;
  /**Add your custom Item */
  customItem?: JSX.Element;
}

interface Props {
  /** Data for the expandable listview */
  data: Array<Item>;
  /** Callback for item click */
  onItemClick?: Function;
  /** Callback for inner item click */
  onInnerItemClick?: Function;
  /** Add style to whole expandable listview */
  styles?: ViewStyle;
  /** Add style to each inner item container */
  innerItemContainerStyle?: ViewStyle;
  /** Add style to each inner item label */
  innerItemLabelStyle?: ViewStyle;
  /** Add style to each item container */
  itemContainerStyle?: ViewStyle;
  /** Add style to each item label */
  itemLabelStyle?: TextStyle;
  /** Add style to the item indicator */
  itemImageIndicatorStyle?: ImageStyle;
  /** Pass the path for your custom indicator */
  customChevron?: string;
  /** Color for default indicator */
  chevronColor?: string;
  /** Height for default indicator */
  chevronHeight?: number;
  /** Width for default indicator */
  chevronWidth?: number;
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
}

interface ExpandableListItem {
  item: Item;
  index: number;
}

interface ChevronProps {
  fill?: string;
  height?: number;
  width?: number;
  style?: Object;
}

class ChevronComponent extends React.Component<ChevronProps> {
  render() {
    return (
      <White
        fill={this.props.fill}
        height={this.props.height}
        width={this.props.width}
        style={this.props.style}
      />
    );
  }
}

const Chevron = Animatable.createAnimatableComponent(ChevronComponent);
// const Chevron = Animated.createAnimatedComponent(ChevronComponent);

const initialState = {
  opened: false,
  height: [],
  data: [],
  isMounted: [],
  lastSelectedIndex: -1,
  selectedIndex: -1,
  opacityValues: [],
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
    opacityValues?: Animated.Value[];
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
        opacityValues: [],
        animatedValues: [],
        rotateValueHolder: [],
      };
    default:
      return {...state};
  }
}

export const ExpandableListView: React.FC<Props> = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  props.data;
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
      if (state.opacityValues.length === state.data.length) {
        state.opacityValues.map((_: any, index: number) => {
          Animated.timing(state.opacityValues[index], {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          }).start();
        });
      }
    }
  }, [
    state.data,
    state.height,
    state.opened,
    state.opacityValues,
    state.animatedValues,
    state.rotateValueHolder,
    state.selectedIndex,
    state.lastSelectedIndex,
  ]);

  useEffect(() => {
    async function reset() {
      await dispatch({type: 'reset'});
      await dispatch({type: 'set', data: props.data});
    }
    reset();
  }, [props.data]);

  function handleLayout(evt: LayoutChangeEvent, index: number) {
    if (!state.isMounted[index] && evt.nativeEvent.layout.height !== 0) {
      let h = state.height;
      h[index] = evt.nativeEvent.layout.height;
      let m = state.isMounted;
      m[index] = true;
      let newOpacityValues: Array<Animated.Value> = [...state.opacityValues];
      let newAnimatedValues: Array<Animated.Value> = [...state.animatedValues];
      let newRotateValueHolder: Array<Animated.Value> = [
        ...state.rotateValueHolder,
      ];
      newOpacityValues.push(new Animated.Value(0));
      newAnimatedValues.push(new Animated.Value(0));
      newRotateValueHolder.push(new Animated.Value(0));

      dispatch({
        type: 'set',
        opacityValues: newOpacityValues,
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

    if (props.onItemClick) {
      return props.onItemClick(updatedIndex);
    }
    return;
  }

  const List = useMemo(() => FlatList, []);

  function renderInnerItem(itemO: any, headerItem: Item, headerIndex: number) {
    let {item}: {item: InnerItem} = itemO;
    let {index}: {index: number} = itemO;

    let CustomComponent = item.customInnerItem;

    let {
      innerItemContainerStyle,
      innerItemLabelStyle,
      innerItemSeparatorStyle,
    } = props;

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
            props.onInnerItemClick &&
            props.onInnerItemClick(index, headerItem, headerIndex)
          }>
          {CustomComponent !== undefined ? (
            CustomComponent
          ) : (
            <Text style={innerItemLabelStyle}>{item.name}</Text>
          )}
        </TouchableOpacity>
        {props.renderInnerItemSeparator !== undefined &&
          props.renderInnerItemSeparator &&
          index < state.data.length - 1 && (
            <View style={innerItemSeparatorStyle} />
          )}
      </>
    );
  }

  function renderItem({item, index}: ExpandableListItem) {
    let {
      itemContainerStyle,
      itemLabelStyle,
      itemImageIndicatorStyle,
      itemSeparatorStyle,
    } = props;
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
      ...itemImageIndicatorStyle,
    };

    itemSeparatorStyle = {...styles.headerSeparator, ...itemSeparatorStyle};

    let CustomComponent = item.customItem;
    return (
      <Animated.View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: undefined,
          opacity:
            props.animated === undefined ||
            (props.animated !== undefined && props.animated)
              ? state.isMounted[index]
                ? state.opacityValues[index]
                : 0
              : 1,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => updateLayout(index)}
          style={itemContainerStyle}>
          {CustomComponent !== undefined ? (
            CustomComponent
          ) : (
            <>
              {props.customChevron !== undefined ? (
                <Animated.Image
                  source={props.customChevron}
                  resizeMethod="scale"
                  resizeMode="contain"
                  style={[
                    itemImageIndicatorStyle,
                    props.animated === undefined ||
                    (props.animated !== undefined && props.animated)
                      ? state.rotateValueHolder[index] !== undefined && {
                          transform: [
                            {
                              rotate: state.rotateValueHolder[
                                index
                              ].interpolate({
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
              ) : (
                <Chevron
                  fill={
                    props.chevronColor !== undefined
                      ? props.chevronColor
                      : '#000000'
                  }
                  height={
                    props.chevronHeight !== undefined ? props.chevronHeight : 36
                  }
                  width={
                    props.chevronWidth !== undefined ? props.chevronWidth : 36
                  }
                  style={[
                    itemImageIndicatorStyle,
                    props.animated === undefined ||
                    (props.animated !== undefined && props.animated)
                      ? state.rotateValueHolder[index] !== undefined && {
                          transform: [
                            {
                              rotate: state.rotateValueHolder[
                                index
                              ].interpolate({
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
              )}
              <Text style={itemLabelStyle}>{item.categoryName}</Text>
            </>
          )}
        </TouchableOpacity>

        <Animated.View
          style={[
            props.animated === undefined ||
            (props.animated !== undefined && props.animated)
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
            initialNumToRender={20}
            windowSize={20}
            maxToRenderPerBatch={20}
            keyExtractor={() => Math.random().toString()}
            listKey={String(Math.random())}
            data={item.subCategory}
            renderItem={(innerItem: any) =>
              renderInnerItem(innerItem, item, index)
            }
          />
        </Animated.View>

        {props.renderItemSeparator !== undefined &&
          props.renderItemSeparator &&
          (!state.opened || state.selectedIndex !== index) &&
          state.data.length > index + 1 && <View style={itemSeparatorStyle} />}
      </Animated.View>
    );
  }

  return (
    <List
      style={props.styles}
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
      windowSize={20}
      maxToRenderPerBatch={20}
      keyExtractor={(item: any, itemIndex: number) => itemIndex.toString()}
      data={state.data}
      renderItem={(item: ExpandableListItem) => renderItem(item)}
    />
  );
};
