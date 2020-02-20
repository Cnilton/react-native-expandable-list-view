import React, {Component, Fragment} from 'react';

import {TouchableOpacity, Animated, FlatList, Text, Easing} from 'react-native';

import {StyleSheet} from 'react-native'

import styles from '../styles';

import chevronWhite from '../assets/images/arrow_white.png';
import chevronBlack from '../assets/images/arrow_black.png';

interface State extends Object{
  index: number;
  rotateValueHolder: Animated.Value;
  animatedValue: Animated.Value;
}

interface Item extends Array<any>{
  isExpanded: Boolean;
  item: InnerItem;
  index: number;
  cellHeight?: number;
  categoryName: String;
  id: number;
  subCategory: Array<InnerItem>
}

interface InnerItem{
  item: Object;
  index: number;
  name: String;
  innerCellHeight?: number;
}

interface Props extends Object{
  itemContainerStyle?: StyleSheet;
  itemLabelStyle?: StyleSheet;
  headerContainerStyle?: StyleSheet;
  headerLabelStyle?: StyleSheet;
  customComponent?: Component;
  headerImageIndicatorStyle?: StyleSheet;
  customChevron?: String;
  chevronColor?: String;
  item: Item;
  index: number;
  height?: number; 
  data: Item;
  onInnerItemClick: Function;
  onItemClick: Function;
}

interface Types extends Object{
  props: Props;
  value: Boolean;
  setState: Function;
  isContainerClickable?: true | false;
  useNativeDriver?: Boolean;
  colorActive?: String;
  colorInactive?: String;
  textStyle?: Object;
  boxStyle?: Object;
  containerStyle?: Object;
  label?: String;
  checkImage?: String;
}

export default class ListView extends Component<Types> {

  static props: Props
  static setState: Function;

  state = {
    data: ListView.props.data,
    index: null,
    animatedValue: new Animated.Value(0),
    rotateValueHolder: new Animated.Value(0),
  }

  updateLayout = (index: number) => {
    const array = [ListView.props.data];
    array.map((value, placeindex) => {
      if (placeindex === index) {
        array[placeindex].isExpanded = !array[placeindex].isExpanded;
        ListView.setState({index: index});
      } else {
        array[placeindex].isExpanded = false;
      }
    });
    return ListView.props.onItemClick(array);
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.index !== null) {
      if (props.data[state.index].isExpanded) {
        let height = 0;
        props.data[state.index].subCategory.map((innerItem: InnerItem) => {
          height =
            height +
            (innerItem.innerCellHeight !== undefined
              ? innerItem.innerCellHeight
              : props.itemContainerStyle !== undefined &&
                props.itemContainerStyle.height !== undefined
              ? props.itemContainerStyle.height
              : 40);
        });
        Animated.spring(state.animatedValue, {
          friction: 10,
          toValue: height,
          easing: Easing.linear,
        }).start();
        Animated.timing(state.rotateValueHolder, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(state.animatedValue, {
          friction: 10,
          toValue: 0,
          easing: Easing.linear,
        }).start();
        Animated.timing(state.rotateValueHolder, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
    return null;
  }

  renderInnerItem = (item: InnerItem, index: number) => {
    let {itemContainerStyle, itemLabelStyle} = ListView.props;
    itemContainerStyle = {
      ...styles.content,
      ...itemContainerStyle,
      height:
        item.innerCellHeight !== undefined
          ? item.innerCellHeight
          : ListView.props.itemContainerStyle !== undefined &&
            ListView.props.itemContainerStyle.height !== undefined
          ? ListView.props.itemContainerStyle.height
          : 40,
    };

    itemLabelStyle = {
      ...styles.text,
      ...itemLabelStyle,
    };

    let CustomComponent = ListView.props.customComponent;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={Math.random}
        style={itemContainerStyle}
        onPress={() =>
          ListView.props.onInnerItemClick(index, ListView.props.item)
        }>
        {CustomComponent !== undefined ? (
          CustomComponent
        ) : (
          <Text style={itemLabelStyle}>{item.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    let {
      headerContainerStyle,
      headerLabelStyle,
      headerImageIndicatorStyle,
    } = ListView.props;
    headerContainerStyle = {
      ...styles.header,
      ...headerContainerStyle,
      height:
        ListView.props.item.cellHeight !== undefined
          ? ListView.props.item.cellHeight
          : ListView.props.headerContainerStyle !== undefined &&
            ListView.props.headerContainerStyle.height !== undefined
          ? ListView.props.headerContainerStyle.height
          : 40,
    };
    headerLabelStyle = {
      ...styles.headerText,
      ...headerLabelStyle,
    };
    headerImageIndicatorStyle = {
      ...headerImageIndicatorStyle,
    };

    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.updateLayout(ListView.props.index)}
          style={headerContainerStyle}>
          <Animated.Image
            source={
              ListView.props.customChevron !== undefined
                ? ListView.props.customChevron
                : ListView.props.chevronColor != undefined &&
                  ListView.props.chevronColor == 'white'
                ? chevronWhite
                : chevronBlack
            }
            resizeMethod="scale"
            resizeMode="contain"
            style={[
              headerImageIndicatorStyle,
              ListView.props.item.isExpanded && {
                transform: [
                  {
                    rotate: this.state.rotateValueHolder.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        '0deg',
                        ListView.props.item.isExpanded ? '90deg' : '-90deg',
                      ],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={headerLabelStyle}>
            {ListView.props.item.categoryName}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: this.state.animatedValue,
              overflow: 'hidden',
            },
          ]}>
          <FlatList
            keyExtractor={() => Math.random().toString()}
            listKey={() => ListView.props.item.id + ListView.props.index}
            data={ListView.props.item.subCategory}
            renderItem={({item}:{item: InnerItem}, {index}: {index: number}) => this.renderInnerItem(item, index)}
          />
        </Animated.View>
      </Fragment>
    );
  }
}
