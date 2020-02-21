import React, {Component, Fragment} from 'react';

import {TouchableOpacity, Animated, FlatList, Text, Easing} from 'react-native';

import styles from '../styles';

interface Style extends Object {
  height?: number;
}

interface State extends Object {
  index: number;
  rotateValueHolder: Animated.Value;
  animatedValue: Animated.Value;
}

interface Item extends Array<any> {
  isExpanded: Boolean;
  item: InnerItem;
  index: number;
  cellHeight?: number;
  categoryName: String;
  id: number;
  subCategory: Array<InnerItem>;
}

interface InnerItem extends Object {
  item: Object;
  index: number;
  name: String;
  innerCellHeight?: number;
}

interface Props extends Object {
  itemContainerStyle?: Style;
  itemLabelStyle?: Style;
  headerContainerStyle?: Style;
  headerLabelStyle?: Style;
  customComponent?: Component;
  headerImageIndicatorStyle?: Style;
  customChevron?: String;
  chevronColor?: String;
  item: Item;
  index: number;
  height?: number;
  data: Item;
  onInnerItemClick: Function;
  onItemClick: Function;
}

interface Types extends Object {
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

export default class ListView extends Component<Props> {
  props!: Props;
  // setState!: Function;

  state = {
    data: this.props.data,
    index: null,
    animatedValue: new Animated.Value(0),
    rotateValueHolder: new Animated.Value(0),
  };

  updateLayout = (index: number) => {
    const array = [this.props.data];
    array.map((value, placeindex) => {
      if (placeindex === index) {
        array[placeindex].isExpanded = !array[placeindex].isExpanded;
        this.setState({index: index});
      } else {
        array[placeindex].isExpanded = false;
      }
    });
    return this.props.onItemClick(array);
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

  renderInnerItem = (innerItem: any) => {
    let {item}: {item: InnerItem} = innerItem;
    let {index}: {index: number} = innerItem;
    let {itemContainerStyle, itemLabelStyle} = this.props;
    itemContainerStyle = {
      ...styles.content,
      ...itemContainerStyle,
      height:
        item.innerCellHeight !== undefined
          ? item.innerCellHeight
          : this.props.itemContainerStyle !== undefined &&
            this.props.itemContainerStyle.height !== undefined
          ? this.props.itemContainerStyle.height
          : 40,
    };

    itemLabelStyle = {
      ...styles.text,
      ...itemLabelStyle,
    };

    let CustomComponent = this.props.customComponent;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={Math.random()}
        style={itemContainerStyle}
        onPress={() => this.props.onInnerItemClick(index, this.props.item)}>
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
    } = this.props;
    headerContainerStyle = {
      ...styles.header,
      ...headerContainerStyle,
      height:
        this.props.item.cellHeight !== undefined
          ? this.props.item.cellHeight
          : this.props.headerContainerStyle !== undefined &&
            this.props.headerContainerStyle.height !== undefined
          ? this.props.headerContainerStyle.height
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
          onPress={() => this.updateLayout(this.props.index)}
          style={headerContainerStyle}>
          <Animated.Image
            source={
              this.props.customChevron !== undefined
                ? this.props.customChevron
                : this.props.chevronColor !== undefined &&
                  this.props.chevronColor === 'white'
                ? require('../assets/images/arrow_white.png')
                : require('../assets/images/arrow_black.png')
            }
            resizeMethod="scale"
            resizeMode="contain"
            style={[
              headerImageIndicatorStyle,
              this.props.item.isExpanded && {
                transform: [
                  {
                    rotate: this.state.rotateValueHolder.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        '0deg',
                        this.props.item.isExpanded ? '90deg' : '-90deg',
                      ],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={headerLabelStyle}>{this.props.item.categoryName}</Text>
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
            listKey={String(this.props.item.id + this.props.index)}
            data={this.props.item.subCategory}
            renderItem={item => this.renderInnerItem(item)}
          />
        </Animated.View>
      </Fragment>
    );
  }
}
