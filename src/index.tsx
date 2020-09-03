import React, {Component, useState, useEffect, useMemo} from 'react';

import {
  TouchableOpacity,
  Animated,
  FlatList,
  Text,
  Easing,
  View,
} from 'react-native';

import styles from './styles';

import chevronWhite from './assets/images/arrow_white.png';
import chevronBlack from './assets/images/arrow_black.png';

export interface InnerItem extends Object {
  innerCellHeight?: number;
  name?: string;
  customInnerItem?: Component;
}

export interface Item extends Object {
  id: number;
  cellHeight?: number;
  isExpanded: boolean;
  subCategory: InnerItem[];
  categoryName?: string;
  customItem?: Component;
}

interface Style {
  height?: number;
  padding?: number;
  paddingTop?: number;
  paddingVertical?: number;
  paddingBottom?: number;
  marginVertical?: number;
  marginBottom?: number;
  marginTop?: number;
  margin?: number;
  fontSize?: number;
  backgroundColor?: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
}

interface Props {
  data: Array<Item>;
  /** Callback for item click */
  onItemClick?: Function;
  /** Callback for inner item click */
  onInnerItemClick?: Function;
  /** Add style to each inner item container */
  innerItemContainerStyle?: Style;
  /** Add style to each inner item label */
  innerItemLabelStyle?: Style;
  /** Add style to each item container */
  itemContainerStyle?: Style;
  /** Add style to each item label */
  itemLabelStyle?: Style;
  /** Add style to the item indicator */
  itemImageIndicatorStyle?: Style;
  /** Pass the path for your custom indicator */
  customChevron?: string;
  /** Color for default indicator */
  chevronColor?: 'white' | 'black';
  /** Render separator for items */
  renderItemSeparator?: boolean;
  /** Render separator for inner items */
  renderInnerItemSeparator?: boolean;
  /** Add style to the item separator */
  itemSeparatorStyle?: Style;
  /** Add style to the inner item separator */
  innerItemSeparatorStyle?: Style;
}

interface ExpandableListItem {
  item: Item;
  index: number;
}

export const ExpandableListView: React.FC<Props> = props => {
  const [data, setData] = useState([] as Item[]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [animatedValues, setAnimatedValues] = useState([] as Animated.Value[]);
  const [rotateValueHolder, setRotateValueHolder] = useState(
    [] as Animated.Value[],
  );

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    let newAnimatedValues: Array<Animated.Value> = [];
    let newRotateValueHolder: Array<Animated.Value> = [];
    data.map(() => {
      newAnimatedValues.push(new Animated.Value(0));
      newRotateValueHolder.push(new Animated.Value(0));
    });
    setAnimatedValues(newAnimatedValues);
    setRotateValueHolder(newRotateValueHolder);
  }, [data]);

  useEffect(() => {
    if (selectedIndex >= 0 && data.length > 0) {
      if (data[selectedIndex].isExpanded) {
        let height = 0;
        data[selectedIndex].subCategory.map((innerItem: any) => {
          height =
            height +
            (innerItem.innerCellHeight !== undefined
              ? innerItem.innerCellHeight
              : props.innerItemContainerStyle !== undefined &&
                props.innerItemContainerStyle.height !== undefined
              ? props.innerItemContainerStyle.height
              : 40);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.margin !== undefined
                ? props.innerItemContainerStyle.margin * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.padding !== undefined
                ? props.innerItemContainerStyle.padding * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.marginVertical !== undefined
                ? props.innerItemContainerStyle.marginVertical * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.marginBottom !== undefined
                ? props.innerItemContainerStyle.marginBottom
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.paddingVertical !== undefined
                ? props.innerItemContainerStyle.paddingVertical * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.paddingBottom !== undefined
                ? props.innerItemContainerStyle.paddingBottom
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.marginTop !== undefined
                ? props.innerItemContainerStyle.marginTop
                : 0
              : 0);
          height =
            height +
            (props.innerItemContainerStyle !== undefined
              ? props.innerItemContainerStyle.paddingTop !== undefined
                ? props.innerItemContainerStyle.paddingTop
                : 0
              : 0);
          height =
            height +
            (props.innerItemLabelStyle !== undefined
              ? props.innerItemLabelStyle.padding !== undefined
                ? props.innerItemLabelStyle.padding * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemLabelStyle !== undefined
              ? props.innerItemLabelStyle.paddingBottom !== undefined
                ? props.innerItemLabelStyle.paddingBottom
                : 0
              : 0);
          height =
            height +
            (props.innerItemLabelStyle !== undefined
              ? props.innerItemLabelStyle.paddingVertical !== undefined
                ? props.innerItemLabelStyle.paddingVertical * 2
                : 0
              : 0);
          height =
            height +
            (props.innerItemLabelStyle !== undefined
              ? props.innerItemLabelStyle.paddingTop !== undefined
                ? props.innerItemLabelStyle.paddingTop
                : 0
              : 0);
        });
        height =
          height +
          (props.renderInnerItemSeparator !== undefined &&
          props.renderInnerItemSeparator
            ? (props.innerItemSeparatorStyle !== undefined
                ? props.innerItemSeparatorStyle.height !== undefined
                  ? props.innerItemSeparatorStyle.height
                  : 2 * data[selectedIndex].subCategory.length
                : 2) * data[selectedIndex].subCategory.length
            : 0);
        console.log(height);
        Animated.spring(animatedValues[selectedIndex], {
          useNativeDriver: false,
          friction: 10,
          toValue: height,
        }).start();
        Animated.timing(rotateValueHolder[selectedIndex], {
          toValue: 90,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
      setLastSelectedIndex(selectedIndex);
    }
  }, [
    animatedValues,
    rotateValueHolder,
    selectedIndex,
    lastSelectedIndex,
    data,
    props.innerItemLabelStyle,
    props.renderInnerItemSeparator,
    props.innerItemSeparatorStyle,
    props.innerItemContainerStyle,
  ]);

  function updateLayout(updatedIndex: number) {
    const array = [...data];
    array.map((value, placeindex) => {
      if (placeindex === updatedIndex) {
        array[placeindex].isExpanded = !array[placeindex].isExpanded;
        setSelectedIndex(updatedIndex);
      } else {
        array[placeindex].isExpanded = false;
      }
    });
    setData(array);
    if (props.onItemClick) {
      return props.onItemClick(updatedIndex);
    }
    return;
  }

  const List = useMemo(() => FlatList, []);

  function renderInnerItem(itemO: any, headerItem: Item, headerIndex: number) {
    let {item}: {item: InnerItem} = itemO;
    let {index}: {index: number} = itemO;
    let {
      innerItemContainerStyle,
      innerItemLabelStyle,
      innerItemSeparatorStyle,
    } = props;

    let container = {
      ...styles.content,
      ...innerItemContainerStyle,
      height:
        (item.innerCellHeight !== undefined
          ? item.innerCellHeight
          : props.innerItemContainerStyle !== undefined &&
            props.innerItemContainerStyle.height !== undefined
          ? props.innerItemContainerStyle.height
          : 40) +
        (props.renderInnerItemSeparator !== undefined &&
        props.renderInnerItemSeparator
          ? props.innerItemSeparatorStyle !== undefined
            ? props.innerItemSeparatorStyle.height !== undefined
              ? props.innerItemSeparatorStyle.height
              : 1
            : 1
          : 0) +
        (props.innerItemContainerStyle !== undefined
          ? props.innerItemContainerStyle.paddingTop !== undefined
            ? props.innerItemContainerStyle.paddingTop
            : 0
          : 0) +
        (props.innerItemContainerStyle !== undefined
          ? props.innerItemContainerStyle.padding !== undefined
            ? props.innerItemContainerStyle.padding * 2
            : 0
          : 0) +
        (props.innerItemContainerStyle !== undefined
          ? props.innerItemContainerStyle.paddingBottom !== undefined
            ? props.innerItemContainerStyle.paddingBottom
            : 0
          : 0) +
        (props.innerItemContainerStyle !== undefined
          ? props.innerItemContainerStyle.paddingVertical !== undefined
            ? props.innerItemContainerStyle.paddingVertical * 2
            : 0
          : 0) +
        (props.innerItemLabelStyle !== undefined
          ? props.innerItemLabelStyle.padding !== undefined
            ? props.innerItemLabelStyle.padding * 2
            : 0
          : 0),
    };
    innerItemLabelStyle = {
      ...styles.text,
      ...innerItemLabelStyle,
    };

    innerItemSeparatorStyle = {
      ...styles.innerItemSeparator,
      ...innerItemSeparatorStyle,
    };

    let CustomComponent = item.customInnerItem;

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
          index < headerItem.subCategory.length - 1 && (
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
      height:
        item.cellHeight !== undefined
          ? item.cellHeight
          : props.itemContainerStyle !== undefined &&
            props.itemContainerStyle.height !== undefined
          ? props.itemContainerStyle.height
          : 40,
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
      <>
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
                  props.customChevron !== undefined
                    ? props.customChevron
                    : props.chevronColor !== undefined &&
                      props.chevronColor === 'white'
                    ? chevronWhite
                    : chevronBlack
                }
                resizeMethod="scale"
                resizeMode="contain"
                style={[
                  itemImageIndicatorStyle,
                  rotateValueHolder[index] !== undefined && {
                    transform: [
                      {
                        rotate: rotateValueHolder[index].interpolate({
                          inputRange: [0, 90],
                          outputRange: ['0deg', '90deg'],
                        }),
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
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: animatedValues[index],
              overflow: 'hidden',
            },
          ]}>
          <FlatList
            updateCellsBatchingPeriod={50}
            initialNumToRender={20}
            windowSize={20}
            maxToRenderPerBatch={20}
            keyExtractor={() => Math.random().toString()}
            listKey={String(item.id + index)}
            data={item.subCategory}
            renderItem={(innerItem: any) =>
              renderInnerItem(innerItem, item, index)
            }
          />
        </Animated.View>
        {props.renderItemSeparator !== undefined &&
          props.renderItemSeparator &&
          !item.isExpanded && <View style={itemSeparatorStyle} />}
      </>
    );
  }

  return (
    <List
      updateCellsBatchingPeriod={50}
      initialNumToRender={20}
      windowSize={20}
      maxToRenderPerBatch={20}
      keyExtractor={(item: any, itemIndex: number) => itemIndex.toString()}
      data={data}
      renderItem={(item: ExpandableListItem) => renderItem(item)}
    />
  );
};
